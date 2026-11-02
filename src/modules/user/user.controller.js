import { response, serializeApi } from "../../common/response/index.js";
import { isValidId, signup, login, updateUser, getUser, deleteUser } from "./user.service.js";

export async function signupController(req, res) {
  const result = await signup(req.body || {});
  if (result.exists) return response({ res, status: 409, message: "Email already exists" });
  return response({ res, status: 201, message: "User added successfully" });
}

export async function loginController(req, res) {
  const user = await login(req.body?.email, req.body?.password);
  if (!user) return response({ res, status: 401, message: "Invalid email or password" });
  return response({ res, message: "Login successful", data: { id: user.id, name: user.name, email: user.email } });
}

export async function updateUserController(req, res) {
  // The PDF's route includes :id while its text mentions a query ID; support both forms.
  const id = req.params.id || req.query.id;
  if (!id || !isValidId(id)) return response({ res, status: 400, message: "A valid user ID is required" });
  const result = await updateUser(id, req.body || {});
  if (result.exists) return response({ res, status: 409, message: "Email already exists" });
  if (result.empty) return response({ res, status: 400, message: "No editable user fields were supplied" });
  if (!result.user) return response({ res, status: 404, message: "User not found" });
  return response({ res, message: "User updated" });
}

export async function getUserController(req, res) {
  const id = req.query.id;
  if (!id || !isValidId(id)) return response({ res, status: 400, message: "A valid id query parameter is required" });
  const user = await getUser(id);
  if (!user) return response({ res, status: 404, message: "User not found" });
  return res.status(200).json(serializeApi(user));
}

export async function deleteUserController(req, res) {
  const id = req.query.id;
  if (!id || !isValidId(id)) return response({ res, status: 400, message: "A valid id query parameter is required" });
  const user = await deleteUser(id);
  if (!user) return response({ res, status: 404, message: "User not found" });
  return response({ res, message: "User deleted" });
}
