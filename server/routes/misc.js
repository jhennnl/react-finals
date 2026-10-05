import { Router } from "express";
import Order from "../models/Order.js";
import Cake from "../models/Cake.js";
import Customer from "../models/Customer.js";
import Promotion from "../models/Promotion.js";
import Review from "../models/Review.js";
import { dailyPickupSlots } from "../utils/pricing.js";
import { requireAdmin, requireAuth } from "../utils/auth.js";

const router = Router();

router.get("/pickup-slots", async (req, res, next) => {
  try {
    const orders = await Order.find({ status: { $ne: "Cancelled" } });
    const slots = dailyPickupSlots(orders);
    res.json({ slots });
  } catch (error) {
    next(error);
  }
});

router.get("/dashboard/overview", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const [cakeCount, customerCount, orderCount, promoCount, reviewCount, orders, cakes] =
      await Promise.all([
        Cake.countDocuments(),
        Customer.countDocuments(),
        Order.countDocuments(),
        Promotion.countDocuments({ active: true }),
        Review.countDocuments({ status: "approved" }),
        Order.find(),
        Cake.find(),
      ]);

    const revenue = orders
      .filter((order) => order.status !== "Cancelled")
      .reduce((sum, order) => sum + order.total, 0);

    const lowStock = cakes.filter((cake) => cake.stock <= 5).length;
    const pendingOrders = orders.filter((order) => order.status === "Pending").length;
    const slots = dailyPickupSlots(orders.filter((order) => order.status !== "Cancelled"));
    const nextFullDay = slots.find((slot) => slot.full);

    const ratingAgg = await Review.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    res.json({
      totals: {
        cakes: cakeCount,
        customers: customerCount,
        orders: orderCount,
        activePromotions: promoCount,
        reviews: reviewCount,
      },
      revenue,
      pendingOrders,
      lowStockCakes: lowStock,
      averageRating: ratingAgg[0] ? Math.round(ratingAgg[0].avg * 10) / 10 : 0,
      nextFullyBookedDate: nextFullDay?.date || null,
      pickupPressure: slots.map((slot) => ({
        date: slot.date,
        utilization: Math.round((slot.booked / slot.capacity) * 100),
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
