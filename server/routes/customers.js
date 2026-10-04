import { Router } from "express";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import { createError, isValidObjectId } from "../middleware/errorHandler.js";
import { hashPassword, customerView } from "../utils/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ customers: customers.map(customerView) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const customer = await Customer.findById(req.params.id);
    if (!customer) throw createError(404, "Customer not found");
    const orderCount = await Order.countDocuments({ customer: customer._id });
    res.json({ customer: { ...customerView(customer), orderCount } });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone = "", password = "changeme1" } = req.body;
    const customer = await Customer.create({
      name,
      email,
      phone,
      passwordHash: hashPassword(password),
    });
    res.status(201).json({ customer: customerView(customer) });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.loyaltyPoints !== undefined) updates.loyaltyPoints = req.body.loyaltyPoints;
    if (req.body.role !== undefined) updates.role = req.body.role;

    const customer = await Customer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!customer) throw createError(404, "Customer not found");
    res.json({ customer: customerView(customer) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const openOrders = await Order.countDocuments({
      customer: req.params.id,
      status: { $nin: ["Completed", "Cancelled"] },
    });
    if (openOrders > 0) {
      throw createError(400, "Cannot delete a customer with open orders");
    }
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) throw createError(404, "Customer not found");
    res.json({ message: "Customer deleted", customer: customerView(customer) });
  } catch (error) {
    next(error);
  }
});

export default router;
