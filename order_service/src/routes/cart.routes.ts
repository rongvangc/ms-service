import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cart.dto";
import { RequestAuthorizer } from "../middleware/authMiddleware";

const repo = repository.cartRepositoryType;
const cartRouter = express.Router();

cartRouter.post(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.user;

      if (!user?.id) {
        next(new Error("user not found"));
      }

      const error = ValidateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema
      );

      if (error) {
        return res.status(404).json({ error });
      }

      const input: CartRequestInput = req.body;

      const response = await service.CreateCart(
        {
          ...input,
          customerId: user!.id,
        },
        repo
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json(error);
    }
  }
);

cartRouter.get(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.user;

      if (!user?.id) {
        next(new Error("user not found"));
      }

      const response = await service.GetCart(user!.id, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

cartRouter.delete(
  "/cart/:lineItemId",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.user;

      if (!user?.id) {
        next(new Error("user not found"));
      }

      const lineItemId = +req.params.lineItemId;
      const response = await service.DeleteCart(
        { id: lineItemId, customerId: user!.id },
        repo
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

cartRouter.patch(
  "/cart/:lineItemId",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.user;

      if (!user?.id) {
        next(new Error("user not found"));
      }

      const lineItemId = +req.params.lineItemId;

      const response = await service.EditCart(
        {
          id: lineItemId,
          qty: req.body.qty,
          customerId: user!.id,
        },
        repo
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default cartRouter;
