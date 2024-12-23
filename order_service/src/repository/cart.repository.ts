import { eq } from "drizzle-orm";
import { DB } from "../db/db.connection";
import { Cart, CartLineItem, cartLineItems, carts } from "../db/schema";
import { NotFoundError } from "../utils";
import { CartWithLineItems } from "../dto/cart.dto";

// declare repository type
export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
  findCart: (id: number) => Promise<CartWithLineItems>;
  updateCart: (
    id: number,
    qty: number,
    customerId: number
  ) => Promise<CartLineItem>;
  deleteCart: (id: number, customerId: number) => Promise<Boolean>;
  clearCartData: (id: number) => Promise<Boolean>;
  findCartByProductId: (
    customerId: number,
    productId: number
  ) => Promise<CartLineItem>;
};

const createCart = async (
  customerId: number,
  { itemName, price, productId, qty, variant }: CartLineItem
): Promise<number> => {
  const result = await DB.insert(carts)
    .values({
      customerId,
    })
    .returning()
    .onConflictDoUpdate({
      target: carts.customerId,
      set: { updatedAt: new Date() },
    });

  const [{ id }] = result;

  if (id > 0) {
    await DB.insert(cartLineItems)
      .values({
        cartId: id,
        productId,
        itemName,
        price,
        qty,
        variant,
      })
      .returning();
  }

  return id;
};

const findCart = async (id: number): Promise<CartWithLineItems> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, operators) => {
      return operators.eq(carts.customerId, id);
    },
    with: {
      lineItems: true,
    },
  });

  if (!cart) {
    throw new NotFoundError("cart not found");
  }

  return cart;
};

const updateCart = async (id: number, qty: number): Promise<CartLineItem> => {
  const [cartLineItem] = await DB.update(cartLineItems)
    .set({
      qty,
    })
    .where(eq(cartLineItems.id, id))
    .returning();

  return cartLineItem;
};

const deleteCart = async (id: number): Promise<Boolean> => {
  await DB.delete(cartLineItems).where(eq(cartLineItems.id, id)).returning();

  return true;
};

const clearCartData = async (id: number): Promise<Boolean> => {
  await DB.delete(carts).where(eq(carts.id, id)).returning();
  return true;
};

const findCartByProductId = async (
  customerId: number,
  productId: number
): Promise<CartLineItem> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, operators) => {
      return operators.eq(carts.customerId, customerId);
    },
    with: {
      lineItems: true,
    },
  });

  const lineItem = cart?.lineItems.find((item) => item.productId === productId);

  return lineItem as CartLineItem;
};

export const cartRepositoryType: CartRepositoryType = {
  createCart,
  updateCart,
  findCart,
  deleteCart,
  clearCartData,
  findCartByProductId,
};
