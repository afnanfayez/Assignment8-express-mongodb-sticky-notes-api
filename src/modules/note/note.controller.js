import mongoose from "mongoose";
import { response, serializeApi } from "../../common/response/index.js";
import {
  isValidId,
  createNote,
  updateNote,
  replaceNote,
  updateAllTitles,
  deleteNote,
  paginateNotes,
  getOwnedNote,
  findNoteByContent,
  notesWithUser,
  aggregateNotes,
  deleteAllNotes
} from "./note.service.js";

function requireUserId(req, res) {
  const userId = req.query.userId;
  if (!userId || !isValidId(userId)) {
    response({ res, status: 400, message: "A valid userId query parameter is required" });
    return null;
  }
  return userId;
}

function ownerFailure(res, result) {
  if (result.missing) return response({ res, status: 404, message: "Note not found" });
  if (result.owner === false) return response({ res, status: 403, message: "You are not the owner" });
  return null;
}

export async function createNoteController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  const result = await createNote(userId, req.body || {});
  if (result.userMissing) return response({ res, status: 404, message: "User not found" });
  return response({ res, status: 201, message: "Note created" });
}

export async function updateNoteController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  if (!isValidId(req.params.noteId)) return response({ res, status: 400, message: "Invalid note ID" });
  const result = await updateNote(req.params.noteId, userId, req.body || {});
  const failure = ownerFailure(res, result);
  if (failure) return failure;
  if (result.empty) return response({ res, status: 400, message: "Provide a title or content to update" });
  return response({ res, message: "updated", data: result.note, dataKey: "note" });
}

export async function replaceNoteController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  if (!isValidId(req.params.noteId)) return response({ res, status: 400, message: "Invalid note ID" });
  const result = await replaceNote(req.params.noteId, userId, req.body || {});
  const failure = ownerFailure(res, result);
  if (failure) return failure;
  return res.status(200).json(serializeApi(result.note));
}

export async function updateAllTitlesController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  if (typeof req.body?.title !== "string" || req.body.title.trim() === "") {
    return response({ res, status: 400, message: "A non-empty title is required" });
  }
  const result = await updateAllTitles(userId, req.body?.title);
  if (!result.matchedCount) return response({ res, status: 404, message: "No notes found" });
  return response({ res, message: "All notes updated" });
}

export async function deleteNoteController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  if (!isValidId(req.params.noteId)) return response({ res, status: 400, message: "Invalid note ID" });
  const result = await deleteNote(req.params.noteId, userId);
  const failure = ownerFailure(res, result);
  if (failure) return failure;
  return response({ res, message: "deleted", data: result.note, dataKey: "note" });
}

export async function paginateNotesController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    return response({ res, status: 400, message: "page must be positive and limit must be between 1 and 100" });
  }
  const notes = await paginateNotes(userId, page, limit);
  return res.status(200).json(serializeApi(notes));
}

export async function getNoteController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  if (!isValidId(req.params.id)) return response({ res, status: 400, message: "Invalid note ID" });
  const result = await getOwnedNote(req.params.id, userId);
  const failure = ownerFailure(res, result);
  if (failure) return failure;
  return res.status(200).json(serializeApi(result.note));
}

export async function noteByContentController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  if (req.query.content === undefined) return response({ res, status: 400, message: "content query parameter is required" });
  const note = await findNoteByContent(userId, req.query.content);
  if (!note) return response({ res, status: 404, message: "No note found" });
  return res.status(200).json(serializeApi(note));
}

export async function notesWithUserController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  const notes = await notesWithUser(userId);
  return res.status(200).json(serializeApi(notes));
}

export async function aggregateNotesController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  if (req.query.title !== undefined && typeof req.query.title !== "string") {
    return response({ res, status: 400, message: "title must be a string" });
  }
  const notes = await aggregateNotes(userId, req.query.title);
  return res.status(200).json(serializeApi(notes));
}

export async function deleteAllNotesController(req, res) {
  const userId = requireUserId(req, res);
  if (!userId) return;
  await deleteAllNotes(userId);
  return response({ res, message: "Deleted" });
}
