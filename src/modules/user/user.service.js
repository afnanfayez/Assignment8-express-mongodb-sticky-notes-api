import mongoose from "mongoose";
import { User } from "../../database/model/users.model.js";

const editableFields = ["name", "email", "phone", "age"];

export function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

export async function signup(userData) {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) return { exists: true };
  await User.create(userData);
  return { exists: false };
}

export async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user || user.password !== password) return null;
  return user;
}

export async function updateUser(id, input) {
  const changes = {};
  for (const field of editableFields) {
    if (Object.hasOwn(input, field)) changes[field] = input[field];
  }
  if (Object.keys(changes).length === 0) return { empty: true };

  if (changes.email) {
    const otherUser = await User.findOne({ email: changes.email, _id: { $ne: id } });
    if (otherUser) return { exists: true };
  }

  const user = await User.findOneAndUpdate({ _id: id }, changes, {
    new: true,
    runValidators: true
  });
  return { user };
}

export function getUser(id) {
  return User.findById(id).select("name email phone age");
}

export function deleteUser(id) {
  return User.findOneAndDelete({ _id: id });
}
