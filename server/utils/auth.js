import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import Customer from "../models/Customer.js";
import { createError } from "../middleware/errorHandler.js";

const sessions = new Map();

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

export function issueToken(customerId) {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, String(customerId));
  return token;
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

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const customerId = token ? sessions.get(token) : null;
    if (!customerId) {
      throw createError(401, "Please log in to continue.");
    }
    const customer = await Customer.findById(customerId);
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

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const customerId = token ? sessions.get(token) : null;
  if (!customerId) return next();
  Customer.findById(customerId)
    .then((customer) => {
      if (customer) req.customer = customer;
      next();
    })
    .catch(next);
}
