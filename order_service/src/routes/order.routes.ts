import express, { NextFunction, Request, Response } from "express";
import { MessageBroke } from "../utils/broker";
import { OrderEvents } from "../types";
import { RequestAuthorizer } from "../middleware/authMiddleware";
import * as service from "../service/order.service";
import { orderRepository } from "../repository/order.repository";
import { cartRepositoryType } from "../repository/cart.repository";
import { OrderStatus } from "../types/order.types";

const orderRouter = express.Router();
const repo = orderRepository;
const cartRepo = cartRepositoryType;

orderRouter.post(
  "/orders",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user;
    if (!user) {
      next(new Error("user not found"));
      return;
    }
    const response = await service.CreateOrder(user.id, repo, cartRepo);
    return res.status(201).json(response);
  }
);

orderRouter.get(
  "/orders:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user;
    if (!user) {
      next(new Error("user not found"));
      return;
    }
    const response = await service.GetOrders(user.id, repo);
    return res.status(200).json(response);
  }
);

// only going to call from microservice
orderRouter.patch(
  "/orderS/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // security check for microservice calls only
    const id = parseInt(req.body.id);
    const status = req.body.status as OrderStatus;
    const response = await service.UpdateOrder(id, status, repo);
    return res.status(200).json(response);
  }
);

orderRouter.delete(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user;
    if (!user) {
      next(new Error("user not found"));
      return;
    }
    const orderId = parseInt(req.params.id);
    const status = req.body.status;
    const response = await service.DeleteOrder(orderId, status);
    return res.status(200).json(response);
  }
);

export default orderRouter;
