import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cart.dto";

const repo = repository.cartRepositoryType;
const cartRouter = express.Router();

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // jwt
  const isValidUser = true;

  if (!isValidUser) {
    return res.status(403).json({ error: "authorization error" });
  }

  next();
};

cartRouter.use(authMiddleware);

cartRouter.post(
  "/cart",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const error = ValidateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema
      );

      if (error) {
        return res.status(404).json({ error });
      }

      const response = await service.CreateCart(req.body, repo);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json(error);
    }
  }
);

cartRouter.get(
  "/cart",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const response = await service.GetCart(req.body.customerId, repo);
    return res.status(200).json(response);
  }
);

cartRouter.delete(
  "/cart/:lineItemId",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const lineItemId = +req.params.lineItemId;
    const response = await service.DeleteCart(lineItemId, repo);
    return res.status(200).json(response);
  }
);

cartRouter.patch(
  "/cart/:lineItemId",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const lineItemId = +req.params.lineItemId;

    const response = await service.EditCart(
      {
        id: lineItemId,
        qty: req.body.qty,
      },
      repo
    );
    return res.status(200).json(response);
  }
);

export default cartRouter;
