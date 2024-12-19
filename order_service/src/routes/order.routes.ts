import express, { NextFunction, Request, Response } from "express";

const orderRouter = express.Router();

orderRouter.post(
  "/order",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
