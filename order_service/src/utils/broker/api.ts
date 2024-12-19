import axios from "axios";
import { Product } from "../../dto/product.dto";
import { NotFoundError } from "../error";
import { logger } from "../logger";

const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:8000";

export const GetProductDetails = async (productId: number) => {
  try {
    const response = await axios.get(
      `${CATALOG_BASE_URL}/product/${productId}`
    );
    const product = response.data as Product;

    return product;
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("product not found");
  }
};
