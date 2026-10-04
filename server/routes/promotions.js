import { Router } from "express";
import Promotion from "../models/Promotion.js";
import { createError, isValidObjectId } from "../middleware/errorHandler.js";

const router = Router();

function formatPromo(promo) {
  return {
    id: promo.code.toLowerCase(),
    _id: promo._id,
    code: promo.code,
    title: promo.title,
    description: promo.description,
    type: promo.type,
    value: promo.value,
    minimum: promo.minimum,
    label: promo.label,
    active: promo.active,
    expiresAt: promo.expiresAt,
    createdAt: promo.createdAt,
    updatedAt: promo.updatedAt,
  };
}

function isExpired(promo) {
  return Boolean(promo.expiresAt && new Date(promo.expiresAt) < new Date());
}

router.post("/validate", async (req, res, next) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) throw createError(400, "Promo code is required");

    const promo = await Promotion.findOne({ code: String(code).toUpperCase() });
    if (!promo || !promo.active || isExpired(promo)) {
      throw createError(404, "Promo code not found or inactive");
    }
    if (Number(subtotal) < promo.minimum) {
      throw createError(400, `Minimum subtotal of ₱${promo.minimum} required for this promo`);
    }

    const discount =
      promo.type === "percent"
        ? Math.round((Number(subtotal) * promo.value) / 100)
        : promo.value;

    res.json({
      valid: true,
      discount,
      totalAfterDiscount: Math.max(0, Number(subtotal) - discount),
      promotion: formatPromo(promo),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.active === "true") filter.active = true;
    if (req.query.active === "false") filter.active = false;
    const promotions = await Promotion.find(filter).sort({ createdAt: -1 });
    res.json({
      promotions: promotions.map((promo) => ({
        ...formatPromo(promo),
        expired: isExpired(promo),
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let promo = null;
    if (isValidObjectId(req.params.id)) {
      promo = await Promotion.findById(req.params.id);
    }
    if (!promo) {
      promo = await Promotion.findOne({ code: String(req.params.id).toUpperCase() });
    }
    if (!promo) throw createError(404, "Promotion not found");
    res.json({ promotion: { ...formatPromo(promo), expired: isExpired(promo) } });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const promo = await Promotion.create(req.body);
    res.status(201).json({ promotion: formatPromo(promo) });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!promo) throw createError(404, "Promotion not found");
    res.json({ promotion: formatPromo(promo) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw createError(400, "Invalid id");
    const promo = await Promotion.findByIdAndDelete(req.params.id);
    if (!promo) throw createError(404, "Promotion not found");
    res.json({ message: "Promotion deleted", promotion: formatPromo(promo) });
  } catch (error) {
    next(error);
  }
});

export default router;
