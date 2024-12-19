import express, { NextFunction, Request, Response } from "express";
import { MessageBroke } from "../utils/broker";
import { OrderEvents } from "../types";

const orderRouter = express.Router();

orderRouter.post(
  "/order",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // order create logic

    // 3rd step: publish the message
    await MessageBroke.publish({
      topic: "OrderEvents",
      headers: { token: req.headers.authorization },
      event: OrderEvents.CREATE_ORDER,
      message: {
        orderId: 1,
        items: [
          {
            productId: 1,
            quantity: 1,
          },
          {
            productId: 2,
            quantity: 2,
          },
        ],
      },
    });
    return res.status(201).json("123");
  }
);

orderRouter.get(
  "/order",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(201).json("123");
  }
);

orderRouter.delete(
  "/order/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return res.status(201).json("123");
  }
);

export default orderRouter;
