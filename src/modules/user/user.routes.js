import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler/index.js";
import {
  signupController,
  loginController,
  updateUserController,
  getUserController,
  deleteUserController
} from "./user.controller.js";

const router = Router();

router.post("/signup", asyncHandler(signupController));
router.post("/login", asyncHandler(loginController));
router.patch("/:id", asyncHandler(updateUserController));
router.patch("/", asyncHandler(updateUserController));
router.get("/", asyncHandler(getUserController));
router.delete("/", asyncHandler(deleteUserController));

export default router;
