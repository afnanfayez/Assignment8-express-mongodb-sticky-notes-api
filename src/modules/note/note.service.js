import mongoose from "mongoose";
import { Note } from "../../database/model/notes.model.js";
import { User } from "../../database/model/users.model.js";

export const isValidId = (id) => mongoose.isValidObjectId(id);

export async function confirmOwner(noteId, userId) {
  const note = await Note.findById(noteId);
  if (!note) return { missing: true };
  if (note.userId.toString() !== userId) return { owner: false };
  return { owner: true, note };
}

export async function createNote(userId, data) {
  const user = await User.findById(userId);
  if (!user) return { userMissing: true };
  const note = await Note.create({ title: data.title, content: data.content, userId });
  return { note };
}

export async function updateNote(noteId, userId, data) {
  const check = await confirmOwner(noteId, userId);
  if (!check.owner) return check;
  const changes = {};
  if (Object.hasOwn(data, "title")) changes.title = data.title;
  if (Object.hasOwn(data, "content")) changes.content = data.content;
  if (!Object.keys(changes).length) return { empty: true };
  const note = await Note.findOneAndUpdate({ _id: noteId, userId }, changes, {
    new: true,
    runValidators: true
  });
  return { note };
}

export async function replaceNote(noteId, userId, data) {
  const check = await confirmOwner(noteId, userId);
  if (!check.owner) return check;
  const note = await Note.findOneAndReplace(
    { _id: noteId, userId },
    { title: data.title, content: data.content, userId },
    { new: true, runValidators: true }
  );
  return { note };
}

export async function updateAllTitles(userId, title) {
  return Note.updateMany({ userId }, { $set: { title } }, { runValidators: true });
}

export async function deleteNote(noteId, userId) {
  const check = await confirmOwner(noteId, userId);
  if (!check.owner) return check;
  const note = await Note.findOneAndDelete({ _id: noteId, userId });
  return { note };
}

export function paginateNotes(userId, page, limit) {
  const skip = (page - 1) * limit;
  return Note.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
}

export async function getOwnedNote(noteId, userId) {
  const check = await confirmOwner(noteId, userId);
  return check.owner ? { note: check.note } : check;
}

export function findNoteByContent(userId, content) {
  return Note.findOne({ userId, content });
}

export function notesWithUser(userId) {
  return Note.find({ userId })
    .select("title userId createdAt")
    .populate({ path: "userId", select: "email -_id" });
}

export function aggregateNotes(userId, title) {
  const match = { userId: new mongoose.Types.ObjectId(userId) };
  if (title !== undefined) match.title = title;
  return Note.aggregate([
    { $match: match },
    {
      $lookup: {
        from: User.collection.name,
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        id: "$_id",
        title: 1,
        content: 1,
        userId: 1,
        createdAt: 1,
        updatedAt: 1,
        user: { name: "$user.name", email: "$user.email" }
      }
    }
  ]);
}

export function deleteAllNotes(userId) {
  return Note.deleteMany({ userId });
}
