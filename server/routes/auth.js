import { createHash, randomInt } from "node:crypto";
import { Router } from "express";
import Customer from "../models/Customer.js";
import PasswordReset from "../models/PasswordReset.js";
import Session from "../models/Session.js";
import { createError } from "../middleware/errorHandler.js";
import {
  customerView,
  hashPassword,
  issueToken,
  passwordMatches,
  requireAuth,
  revokeToken,
} from "../utils/auth.js";

const router = Router();

function hashResetCode(code) {
  return createHash("sha256").update(String(code)).digest("hex");
}

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
      token: await issueToken(customer._id),
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
      token: await issueToken(customer._id),
      user: customerView(customer),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw createError(400, "Please provide a valid email.");
    }

    const customer = await Customer.findOne({ email });
    let verificationCode = null;

    if (customer) {
      verificationCode = String(randomInt(100000, 1000000));
      await PasswordReset.deleteMany({ email });
      await PasswordReset.create({
        email,
        codeHash: hashResetCode(verificationCode),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });
    }

    res.json({
      message: "If an account exists, a verification code is ready. Enter it below to set a new password.",
      // Returned for local/demo use (no email provider). Real apps would only send this by email.
      verificationCode,
      expiresInMinutes: 15,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const code = String(req.body.code || "").trim();
    const password = String(req.body.password || "");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw createError(400, "Please provide a valid email.");
    }
    if (!/^\d{6}$/.test(code)) {
      throw createError(400, "Enter the 6-digit verification code.");
    }
    if (password.length < 6) {
      throw createError(400, "Password must be at least 6 characters.");
    }

    const customer = await Customer.findOne({ email });
    const reset = await PasswordReset.findOne({ email, codeHash: hashResetCode(code) });

    if (!customer || !reset || reset.expiresAt < new Date()) {
      throw createError(400, "Invalid or expired verification code.");
    }

    customer.passwordHash = hashPassword(password);
    await customer.save();
    await PasswordReset.deleteMany({ email });
    await Session.deleteMany({ customer: customer._id });

    res.json({ message: "Password updated. You can log in with your new password." });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", requireAuth, async (req, res, next) => {
  try {
    await revokeToken(req.token);
    res.json({ message: "Logged out." });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: customerView(req.customer) });
});

export default router;
