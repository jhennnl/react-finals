import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import Customer from "../models/Customer.js";
import Session from "../models/Session.js";
import { createError } from "../middleware/errorHandler.js";

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function passwordMatches(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

export async function issueToken(customerId) {
  const token = randomBytes(32).toString("hex");
  await Session.create({ token, customer: customerId });
  return token;
}

export async function revokeToken(token) {
  if (!token) return;
  await Session.deleteOne({ token });
}

export function customerView(customer) {
  return {
    id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone || "",
    loyaltyPoints: customer.loyaltyPoints ?? 0,
    role: customer.role,
  };
}

async function customerFromToken(token) {
  if (!token) return null;
  const session = await Session.findOne({ token });
  if (!session) return null;
  return Customer.findById(session.customer);
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const customer = await customerFromToken(token);
    if (!customer) {
      throw createError(401, "Please log in to continue.");
    }
    req.customer = customer;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (!req.customer) {
    return next(createError(401, "Please log in to continue."));
  }
  if (req.customer.role !== "admin") {
    return next(createError(403, "Admin access is required."));
  }
  next();
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return next();
  customerFromToken(token)
    .then((customer) => {
      if (customer) {
        req.customer = customer;
        req.token = token;
      }
      next();
    })
    .catch(next);
}
