import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import orderRouter from "./routes/order.routes";
import cartRouter from "./routes/cart.routes";
import {
  HandleErrorWithLogger,
  HandleUnCaughtException,
  httpLogger,
} from "./utils";

const app = express();

app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.use(orderRouter);
app.use(cartRouter);

app.use(
  "/",
  async (req: Request, res: Response, _: NextFunction): Promise<any> => {
    return res.status(200).json({
      message: "health is up",
    });
  }
);

app.use(HandleErrorWithLogger);
// app.use(HandleUnCaughtException);

export default app;
