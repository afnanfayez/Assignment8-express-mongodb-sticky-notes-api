import mongoose from "mongoose";
import { config } from "../config/config.js";

export async function dbConnect() {
  try {
    await mongoose.connect(config.dbUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}
