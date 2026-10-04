import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Promo code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Code must be at least 3 characters"],
      maxlength: [20, "Code cannot exceed 20 characters"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ["percent", "fixed"],
        message: "Type must be percent or fixed",
      },
    },
    value: {
      type: Number,
      required: [true, "Value is required"],
      min: [1, "Value must be at least 1"],
      max: [10000, "Value cannot exceed 10000"],
    },
    minimum: {
      type: Number,
      required: true,
      min: [0, "Minimum cannot be negative"],
      default: 0,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: [40, "Label cannot exceed 40 characters"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Promotion", promotionSchema);
