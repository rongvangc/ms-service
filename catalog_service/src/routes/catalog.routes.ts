import express, { NextFunction, Request, Response } from "express";
import { CatalogService } from "../services/catalog.service";
import { CatalogRepository } from "../repository/catalog.repository";
import { CreateProductRequest, UpdateProductRequest } from "../dto/product.dto";
import { RequestValidator } from "../utils/requestValidator";

const catalogRouter = express.Router();

export const catalogService = new CatalogService(new CatalogRepository());

catalogRouter.post(
  "/products",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { errors, input } = await RequestValidator(
        CreateProductRequest,
        req.body
      );

      if (errors) return res.status(400).json(errors);

      const data = await catalogService.createProduct(input);
      return res.status(201).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

catalogRouter.patch(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { errors, input } = await RequestValidator(
        UpdateProductRequest,
        req.body
      );

      const id = parseInt(req.params.id) || 0;

      if (errors) return res.status(400).json(errors);

      const data = await catalogService.updateProduct({ id, ...input } as any);
      return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

catalogRouter.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { limit, offset } = req.query;

    try {
      const data = await catalogService.getProducts(+limit!, +offset!);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

catalogRouter.get(
  "/product/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const id = parseInt(req.params.id) || 0;

    try {
      const data = await catalogService.getProduct(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

catalogRouter.delete(
  "/product/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const id = parseInt(req.params.id) || 0;

    try {
      const data = await catalogService.deleteProduct(id);
      return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

export default catalogRouter;
