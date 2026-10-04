import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
    },
    cake: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cake",
      required: [true, "Cake is required"],
    },
    cakeSlug: { type: String, required: true, trim: true },
    cakeName: { type: String, required: true, trim: true },
    size: { type: optionSchema, required: true },
    flavor: { type: optionSchema, required: true },
    filling: { type: optionSchema, required: true },
    design: { type: optionSchema, required: true },
    addOns: { type: [optionSchema], default: [] },
    promoCode: { type: String, default: "", trim: true, uppercase: true },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
    pickupDate: {
      type: String,
      required: [true, "Pickup date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Pickup date must be YYYY-MM-DD"],
    },
    specialInstructions: {
      type: String,
      default: "",
      maxlength: [250, "Special instructions cannot exceed 250 characters"],
    },
    status: {
      type: String,
      enum: {
        values: [
          "Pending",
          "Confirmed",
          "In Production",
          "Ready for Pickup",
          "Completed",
          "Cancelled",
        ],
        message: "Invalid order status",
      },
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
