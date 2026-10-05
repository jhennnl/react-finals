import { Router } from "express";
import Cake from "../models/Cake.js";
import Order from "../models/Order.js";
import { createError, isValidObjectId } from "../middleware/errorHandler.js";
import { requireAdmin, requireAuth } from "../utils/auth.js";

const router = Router();

function formatCake(cake) {
  return {
    id: cake.slug,
    _id: cake._id,
    slug: cake.slug,
    name: cake.name,
    description: cake.description,
    basePrice: cake.basePrice,
    category: cake.category,
    tone: cake.tone,
    imageFile: cake.imageFile,
    stock: cake.stock,
    popular: cake.popular,
    active: cake.active,
    createdAt: cake.createdAt,
    updatedAt: cake.updatedAt,
  };
}

router.get("/stats/summary", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const cakes = await Cake.find();
    const byCategory = {};
    let totalStock = 0;
    let activeCount = 0;
    for (const cake of cakes) {
      byCategory[cake.category] = (byCategory[cake.category] || 0) + 1;
      totalStock += cake.stock;
      if (cake.active) activeCount += 1;
    }
    const avgPrice =
      cakes.length === 0
        ? 0
        : Math.round(cakes.reduce((sum, cake) => sum + cake.basePrice, 0) / cakes.length);

    res.json({
      totalCakes: cakes.length,
      activeCount,
      totalStock,
      averageBasePrice: avgPrice,
      lowStock: cakes.filter((cake) => cake.stock <= 5).map(formatCake),
      byCategory,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice, popular, sort = "name" } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: String(q), $options: "i" } },
        { description: { $regex: String(q), $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (popular === "true") filter.popular = true;
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    const sortMap = {
      name: { name: 1 },
      priceAsc: { basePrice: 1 },
      priceDesc: { basePrice: -1 },
      newest: { createdAt: -1 },
    };

    const cakes = await Cake.find(filter).sort(sortMap[sort] || sortMap.name);
    res.json({ count: cakes.length, cakes: cakes.map(formatCake) });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const cakes = await Cake.find().sort({ name: 1 });
    res.json({ cakes: cakes.map(formatCake) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const cake = isValidObjectId(req.params.id)
      ? await Cake.findById(req.params.id)
      : await Cake.findOne({ slug: req.params.id });
    if (!cake) throw createError(404, "Cake not found");
    res.json({ cake: formatCake(cake) });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const cake = await Cake.create(req.body);
    res.status(201).json({ cake: formatCake(cake) });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cake) throw createError(404, "Cake not found");
    res.json({ cake: formatCake(cake) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const activeOrders = await Order.countDocuments({
      cake: req.params.id,
      status: { $nin: ["Completed", "Cancelled"] },
    });
    if (activeOrders > 0) {
      throw createError(400, "Cannot delete a cake with active orders");
    }
    const cake = await Cake.findByIdAndDelete(req.params.id);
    if (!cake) throw createError(404, "Cake not found");
    res.json({ message: "Cake deleted", cake: formatCake(cake) });
  } catch (error) {
    next(error);
  }
});

export default router;
