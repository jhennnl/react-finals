import mongoose from "mongoose";

const cakeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, "Slug must be at least 2 characters"],
      maxlength: [80, "Slug cannot exceed 80 characters"],
    },
    name: {
      type: String,
      required: [true, "Cake name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [100, "Base price must be at least 100"],
      max: [20000, "Base price cannot exceed 20000"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Fruity", "Classic", "Specialty", "Chocolate", "Celebration", "Y2K"],
        message: "Invalid category",
      },
    },
    tone: {
      type: String,
      enum: ["pink", "yellow", "green", "lilac", "blue", "rose"],
      default: "pink",
    },
    imageFile: {
      type: String,
      default: "strawberry-cloud.png",
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      max: [500, "Stock cannot exceed 500"],
      default: 20,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cake", cakeSchema);
