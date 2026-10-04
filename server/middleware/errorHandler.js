import mongoose from "mongoose";

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((entry) => entry.message)
      .join("; ");
    return res.status(400).json({ message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path || "id"}` });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(400).json({ message: `Duplicate value for ${field}` });
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message || "Request failed" });
  }

  res.status(500).json({ message: err.message || "Internal server error" });
}

export function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
