import mongoose from "mongoose";

export function notFound(req, res, next) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error?.code === 11000) {
    return res.status(409).json({ message: "Email already exists" });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  if (error instanceof mongoose.Error.CastError || error?.name === "BSONError") {
    return res.status(400).json({ message: "Invalid ID or field value" });
  }

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must contain valid JSON" });
  }

  if (error?.name === "MongoServerSelectionError" || error?.name === "MongooseServerSelectionError") {
    return res.status(503).json({ message: "Database is unavailable" });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
