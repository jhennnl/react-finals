import { Router } from "express";
import Cake from "../models/Cake.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Promotion from "../models/Promotion.js";
import { createError, isValidObjectId } from "../middleware/errorHandler.js";
import { requireAdmin, requireAuth } from "../utils/auth.js";
import {
  calculateQuote,
  canTransition,
  dailyPickupSlots,
} from "../utils/pricing.js";

const router = Router();

function formatOrder(order) {
  return {
    id: order.orderCode,
    _id: order._id,
    orderCode: order.orderCode,
    customer: order.customer,
    cake: order.cake,
    cakeId: order.cakeSlug,
    cakeName: order.cakeName,
    size: order.size,
    flavor: order.flavor,
    filling: order.filling,
    design: order.design,
    addOns: order.addOns,
    promoCode: order.promoCode,
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    pickupDate: order.pickupDate,
    specialInstructions: order.specialInstructions,
    status: order.status,
    configuration: {
      cakeId: order.cakeSlug,
      size: order.size?.name,
      flavor: order.flavor?.name,
      filling: order.filling?.name,
      design: order.design?.name,
      addOns: (order.addOns || []).map((item) => item.name),
      promoCode: order.promoCode,
      pickupDate: order.pickupDate,
      specialInstructions: order.specialInstructions,
    },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

function nextOrderCode() {
  return `CC-${String(Date.now()).slice(-6)}`;
}

router.get("/stats/summary", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find();
    const byStatus = {};
    let revenue = 0;
    let discountGiven = 0;
    for (const order of orders) {
      byStatus[order.status] = (byStatus[order.status] || 0) + 1;
      if (order.status !== "Cancelled") {
        revenue += order.total;
        discountGiven += order.discount;
      }
    }
    const completed = orders.filter((order) => order.status === "Completed");
    const averageOrderValue =
      completed.length === 0
        ? 0
        : Math.round(completed.reduce((sum, order) => sum + order.total, 0) / completed.length);

    res.json({
      totalOrders: orders.length,
      revenue,
      discountGiven,
      averageOrderValue,
      byStatus,
      overduePickups: orders.filter((order) => {
        if (["Completed", "Cancelled"].includes(order.status)) return false;
        return order.pickupDate < new Date().toISOString().slice(0, 10);
      }).map(formatOrder),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/quote", async (req, res, next) => {
  try {
    const { cakeId, size, flavor, filling, design, addOns = [], promoCode } = req.body;
    const cake = await Cake.findOne({
      $or: [{ slug: cakeId }, ...(isValidObjectId(cakeId) ? [{ _id: cakeId }] : [])],
    });
    if (!cake) throw createError(404, "Cake not found");
    if (cake.stock <= 0) throw createError(400, "This cake is currently out of stock");

    const promo = promoCode
      ? await Promotion.findOne({ code: String(promoCode).toUpperCase() })
      : null;

    const quote = calculateQuote({
      cake,
      size,
      flavor,
      filling,
      design,
      addOns,
      promo,
    });

    res.json({
      cakeId: cake.slug,
      cakeName: cake.name,
      ...quote,
      promoApplied: Boolean(quote.promoCode),
      promoMessage: quote.promoCode
        ? `Promo ${quote.promoCode} applied`
        : promoCode
          ? "Promo code is invalid, expired, or below minimum spend"
          : null,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.customer._id }).sort({ createdAt: -1 });
    res.json({ orders: orders.map(formatOrder) });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { status, customerId, from, to } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (customerId) {
      if (!isValidObjectId(customerId)) throw createError(400, "Invalid customer id");
      filter.customer = customerId;
    }
    if (from || to) {
      filter.pickupDate = {};
      if (from) filter.pickupDate.$gte = from;
      if (to) filter.pickupDate.$lte = to;
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ orders: orders.map(formatOrder) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    let order = null;
    if (isValidObjectId(req.params.id)) {
      order = await Order.findById(req.params.id);
    }
    if (!order) {
      order = await Order.findOne({ orderCode: req.params.id });
    }
    if (!order || (String(order.customer) !== String(req.customer._id) && req.customer.role !== "admin")) {
      throw createError(404, "Order not found");
    }
    res.json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const body = req.body;
    const configuration = body.configuration || body;
    const cakeId = configuration.cakeId || body.cakeId;
    const cake = await Cake.findOne({
      $or: [{ slug: cakeId }, ...(isValidObjectId(cakeId) ? [{ _id: cakeId }] : [])],
    });
    if (!cake) throw createError(404, "Cake not found");
    if (!cake.active) throw createError(400, "This cake is not available for ordering");
    if (cake.stock <= 0) throw createError(400, "This cake is currently out of stock");

    const pickupDate = body.pickupDate || configuration.pickupDate;
    if (!pickupDate) throw createError(400, "Pickup date is required");

    const activeOrders = await Order.find({ status: { $ne: "Cancelled" } });
    const slots = dailyPickupSlots(activeOrders);
    const slot = slots.find((item) => item.date === pickupDate);
    if (!slot) throw createError(400, "Pickup date is outside the bookable window");
    if (slot.full) {
      throw createError(409, "That pickup date is no longer available. Please choose another date.");
    }

    const promo = configuration.promoCode
      ? await Promotion.findOne({ code: String(configuration.promoCode).toUpperCase() })
      : null;

    const quote = calculateQuote({
      cake,
      size: configuration.size,
      flavor: configuration.flavor,
      filling: configuration.filling,
      design: configuration.design,
      addOns: configuration.addOns || [],
      promo,
    });

    const order = await Order.create({
      orderCode: nextOrderCode(),
      customer: req.customer._id,
      cake: cake._id,
      cakeSlug: cake.slug,
      cakeName: cake.name,
      ...quote,
      pickupDate,
      specialInstructions: String(body.specialInstructions || configuration.specialInstructions || "").slice(0, 250),
      status: "Pending",
    });

    cake.stock = Math.max(0, cake.stock - 1);
    await cake.save();

    req.customer.loyaltyPoints += Math.floor(order.total / 100);
    await req.customer.save();

    res.status(201).json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const order = isValidObjectId(req.params.id)
      ? await Order.findById(req.params.id)
      : await Order.findOne({ orderCode: req.params.id });
    if (!order) throw createError(404, "Order not found");

    if (req.body.specialInstructions !== undefined) {
      order.specialInstructions = String(req.body.specialInstructions).slice(0, 250);
    }
    if (req.body.pickupDate !== undefined) {
      const activeOrders = await Order.find({
        status: { $ne: "Cancelled" },
        _id: { $ne: order._id },
      });
      const slots = dailyPickupSlots(activeOrders);
      const slot = slots.find((item) => item.date === req.body.pickupDate);
      if (!slot || slot.full) {
        throw createError(400, "Selected pickup date is unavailable");
      }
      order.pickupDate = req.body.pickupDate;
    }
    if (req.body.status !== undefined) {
      if (!canTransition(order.status, req.body.status) && req.body.status !== order.status) {
        throw createError(400, `Cannot change status from ${order.status} to ${req.body.status}`);
      }
      order.status = req.body.status;
    }

    await order.save();
    res.json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) throw createError(400, "Status is required");

    const order = isValidObjectId(req.params.id)
      ? await Order.findById(req.params.id)
      : await Order.findOne({ orderCode: req.params.id });
    if (!order) throw createError(404, "Order not found");

    if (!canTransition(order.status, status)) {
      throw createError(400, `Cannot change status from ${order.status} to ${status}`);
    }

    order.status = status;
    await order.save();
    res.json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const order = isValidObjectId(req.params.id)
      ? await Order.findById(req.params.id)
      : await Order.findOne({ orderCode: req.params.id });
    if (!order || String(order.customer) !== String(req.customer._id)) {
      throw createError(404, "Order not found");
    }
    if (!["Pending", "Confirmed"].includes(order.status)) {
      throw createError(400, "This order is already in production and can no longer be cancelled online.");
    }

    order.status = "Cancelled";
    await order.save();

    const cake = await Cake.findById(order.cake);
    if (cake) {
      cake.stock += 1;
      await cake.save();
    }

    res.json({ order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const order = isValidObjectId(req.params.id)
      ? await Order.findById(req.params.id)
      : await Order.findOne({ orderCode: req.params.id });
    if (!order) throw createError(404, "Order not found");
    if (!["Cancelled", "Completed"].includes(order.status)) {
      throw createError(400, "Only cancelled or completed orders can be deleted");
    }
    await order.deleteOne();
    res.json({ message: "Order deleted", order: formatOrder(order) });
  } catch (error) {
    next(error);
  }
});

export default router;
