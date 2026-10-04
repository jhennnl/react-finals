import { Router } from "express";
import Review from "../models/Review.js";
import Cake from "../models/Cake.js";
import { createError, isValidObjectId } from "../middleware/errorHandler.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();

function formatReview(review) {
  return {
    id: review._id,
    _id: review._id,
    customer: review.customer,
    cake: review.cake,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

router.get("/stats/by-cake", async (req, res, next) => {
  try {
    const stats = await Review.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$cake",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
          ratingSum: { $sum: "$rating" },
        },
      },
      { $sort: { averageRating: -1 } },
    ]);

    const cakes = await Cake.find({ _id: { $in: stats.map((item) => item._id) } });
    const cakeMap = Object.fromEntries(cakes.map((cake) => [String(cake._id), cake]));

    res.json({
      rankings: stats.map((item) => ({
        cakeId: item._id,
        cakeName: cakeMap[String(item._id)]?.name || "Unknown",
        cakeSlug: cakeMap[String(item._id)]?.slug,
        averageRating: Math.round(item.averageRating * 10) / 10,
        reviewCount: item.reviewCount,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.cakeId) {
      if (!isValidObjectId(req.query.cakeId)) {
        const cake = await Cake.findOne({ slug: req.query.cakeId });
        if (!cake) throw createError(404, "Cake not found");
        filter.cake = cake._id;
      } else {
        filter.cake = req.query.cakeId;
      }
    }
    if (req.query.status) filter.status = req.query.status;
    const reviews = await Review.find(filter)
      .populate("customer", "name email")
      .populate("cake", "name slug")
      .sort({ createdAt: -1 });
    res.json({ reviews: reviews.map(formatReview) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const review = await Review.findById(req.params.id)
      .populate("customer", "name email")
      .populate("cake", "name slug");
    if (!review) throw createError(404, "Review not found");
    res.json({ review: formatReview(review) });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { cakeId, rating, title, comment } = req.body;
    const cake = isValidObjectId(cakeId)
      ? await Cake.findById(cakeId)
      : await Cake.findOne({ slug: cakeId });
    if (!cake) throw createError(404, "Cake not found");

    const review = await Review.create({
      customer: req.customer._id,
      cake: cake._id,
      rating,
      title,
      comment,
      status: "approved",
    });

    res.status(201).json({ review: formatReview(review) });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const review = await Review.findById(req.params.id);
    if (!review) throw createError(404, "Review not found");
    if (String(review.customer) !== String(req.customer._id) && req.customer.role !== "admin") {
      throw createError(403, "You can only edit your own reviews");
    }

    if (req.body.rating !== undefined) review.rating = req.body.rating;
    if (req.body.title !== undefined) review.title = req.body.title;
    if (req.body.comment !== undefined) review.comment = req.body.comment;
    if (req.body.status !== undefined && req.customer.role === "admin") {
      review.status = req.body.status;
    }

    await review.save();
    res.json({ review: formatReview(review) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const review = await Review.findById(req.params.id);
    if (!review) throw createError(404, "Review not found");
    if (String(review.customer) !== String(req.customer._id) && req.customer.role !== "admin") {
      throw createError(403, "You can only delete your own reviews");
    }
    await review.deleteOne();
    res.json({ message: "Review deleted", review: formatReview(review) });
  } catch (error) {
    next(error);
  }
});

export default router;
