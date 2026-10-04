import { Router } from "express";
import Customer from "../models/Customer.js";
import { createError } from "../middleware/errorHandler.js";
import { customerView, requireAuth } from "../utils/auth.js";

const router = Router();

router.put("/me", requireAuth, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (String(name || "").trim().length < 2 || String(phone || "").trim().length < 7) {
      throw createError(400, "Please provide a name and valid phone number.");
    }
    req.customer.name = String(name).trim();
    req.customer.phone = String(phone).trim();
    await req.customer.save();
    res.json({ user: customerView(req.customer) });
  } catch (error) {
    next(error);
  }
});

export default router;
