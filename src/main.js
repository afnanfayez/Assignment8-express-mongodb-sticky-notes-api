import express from "express";
import { config } from "./config/config.js";
import { dbConnect } from "./database/connection.js";
import { userRouter } from "./modules/user/index.js";
import { noteRouter } from "./modules/note/index.js";
import { errorHandler, notFound } from "./common/middleware/index.js";

const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use("/notes", noteRouter);
app.use(notFound);
app.use(errorHandler);

try {
  await dbConnect();
  app.listen(config.port, () => {
    console.log(`Sticky Notes API is running at http://localhost:${config.port}`);
  });
} catch {
  process.exitCode = 1;
}
