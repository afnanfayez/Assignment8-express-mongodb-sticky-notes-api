import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler/index.js";
import {
  createNoteController,
  updateNoteController,
  replaceNoteController,
  updateAllTitlesController,
  deleteNoteController,
  paginateNotesController,
  getNoteController,
  noteByContentController,
  notesWithUserController,
  aggregateNotesController,
  deleteAllNotesController
} from "./note.controller.js";

const router = Router();

router.get("/paginate-sort", asyncHandler(paginateNotesController));
router.get("/note-by-content", asyncHandler(noteByContentController));
router.get("/note-with-user", asyncHandler(notesWithUserController));
router.get("/aggregate", asyncHandler(aggregateNotesController));
router.patch("/all", asyncHandler(updateAllTitlesController));
router.delete("/", asyncHandler(deleteAllNotesController));
router.post("/", asyncHandler(createNoteController));
router.put("/replace/:noteId", asyncHandler(replaceNoteController));
router.patch("/:noteId", asyncHandler(updateNoteController));
router.delete("/:noteId", asyncHandler(deleteNoteController));
router.get("/:id", asyncHandler(getNoteController));

export default router;
