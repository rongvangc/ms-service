import express from "express";
import catalogRouter from "./routes/catalog.routes";
import {
  httpLogger,
  HandleErrorWithLogger,
  HandleUnCaughtException,
} from "./utils";

const app = express();
app.use(express.json());
app.use(httpLogger);

app.use("/", catalogRouter);

app.use(HandleErrorWithLogger);
// app.use(HandleUnCaughtException);

export default app;
