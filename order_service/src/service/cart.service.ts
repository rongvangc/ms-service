import { CartLineItem } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cart.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { AuthorizeError, logger, NotFoundError } from "../utils";
import { GetProductDetails, GetStockDetails } from "../utils/broker";

export const CreateCart = async (
  input: CartRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  const product = await GetProductDetails(input.productId);

  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError("product is out of stock");
  }

  // find if the product is already in the cart
  const lineItems = await repo.findCartByProductId(
    input.customerId,
    input.productId
  );

  if (lineItems) {
    return repo.updateCart(
      lineItems.id,
      lineItems.qty + input.qty,
      input.customerId
    );
  }

  return await repo.createCart(input.customerId, {
    productId: product.id,
    price: product.price.toString(),
    qty: input.qty,
    itemName: product.name,
    variant: product.variant,
  } as CartLineItem);
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  // get customer cart data
  const cart = await repo.findCart(id);

  if (!cart) {
    throw new NotFoundError("cart not found");
  }

  // list out all line items in the cart
  const lineItems = cart.lineItems;

  if (!lineItems.length) {
    throw new NotFoundError("cart item not found");
  }

  // verify with inventory service if the product is still available
  const stockDetails = await GetStockDetails(
    lineItems.map((item) => item.productId)
  );

  if (Array.isArray(stockDetails)) {
    lineItems.forEach((lineItems) => {
      const stockItem = stockDetails.find(
        (stock) => stock.id === lineItems.productId
      );

      if (stockItem) {
        lineItems.availability = stockItem.stock;
      }
    });

    // update cart line item
    cart.lineItems = lineItems;
  }

  // return updated cart data with latest stock available

  return cart;
};

export const EditCart = async (
  input: CartEditRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorizedCart(input.id, input.customerId, repo);
  const data = await repo.updateCart(input.id, input.qty, input.customerId);
  return data;
};

export const DeleteCart = async (
  input: {
    id: number;
    customerId: number;
  },
  repo: CartRepositoryType
) => {
  const data = await repo.deleteCart(input.id, input.customerId);
  return data;
};

const AuthorizedCart = async (
  lineItemId: number,
  customerId: number,
  repo: CartRepositoryType
) => {
  const cart = await repo.findCart(customerId);

  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
  if (!lineItem) {
    throw new AuthorizeError("you are not authorized to edit this cart");
  }
};
