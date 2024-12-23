import axios from "axios";
import { Product } from "../../dto/product.dto";
import { AuthorizeError, NotFoundError } from "../error";
import { logger } from "../logger";
import { User } from "../../models/user.model";

const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:8000";

const AUTH_SERVICE_URL = "http://localhost:9001";

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

export const GetStockDetails = async (ids: number[]) => {
  try {
    const response = await axios.post(`${CATALOG_BASE_URL}/products/stock`, {
      ids,
    });
    return response.data as Product[];
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("product not found");
  }
};

export const ValidateUser = async (token: string) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/validate`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status !== 200) {
      throw new AuthorizeError("user not authorized");
    }
    return response.data as User;
  } catch (error) {
    logger.error(error);
    throw new AuthorizeError("user not authorized");
  }
};
