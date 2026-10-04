import { Router } from "express";
import Customer from "../models/Customer.js";
import { createError } from "../middleware/errorHandler.js";
import {
  customerView,
  hashPassword,
  issueToken,
  passwordMatches,
  requireAuth,
} from "../utils/auth.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalized = String(email || "").trim().toLowerCase();

    if (String(name || "").trim().length < 2) {
      throw createError(400, "Please provide a name of at least 2 characters.");
    }
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      throw createError(400, "Please provide a valid email.");
    }
    if (String(password || "").length < 6) {
      throw createError(400, "Password must be at least 6 characters.");
    }

    const existing = await Customer.findOne({ email: normalized });
    if (existing) throw createError(409, "An account already exists for this email.");

    const customer = await Customer.create({
      name: String(name).trim(),
      email: normalized,
      phone: "",
      passwordHash: hashPassword(password),
    });

    res.status(201).json({
      token: issueToken(customer._id),
      user: customerView(customer),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({
      email: String(email || "").trim().toLowerCase(),
    });
    if (!customer || !passwordMatches(String(password || ""), customer.passwordHash)) {
      throw createError(401, "Email or password is incorrect.");
    }
    res.json({
      token: issueToken(customer._id),
      user: customerView(customer),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res) => {
  res.json({ message: "If an account exists, reset instructions have been sent." });
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: customerView(req.customer) });
});

export default router;
