import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, min: 18, max: 60 }
  },
  { collection: "users" }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
