import { eq } from "drizzle-orm";
import { DB } from "../db/db.connection";
import { Cart, CartLineItem, cartLineItems, carts } from "../db/schema";
import { NotFoundError } from "../utils";

// declare repository type
export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
  findCart: (id: number) => Promise<Cart>;
  updateCart: (id: number, qty: number) => Promise<CartLineItem>;
  deleteCart: (id: number) => Promise<Boolean>;
  clearCartData: (id: number) => Promise<Boolean>;
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
    await DB.insert(cartLineItems).values({
      cartId: id,
      productId,
      itemName,
      price,
      qty,
      variant,
    }).returning();
  }

  return id;
};

const findCart = async (id: number): Promise<Cart> => {
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

export const cartRepositoryType: CartRepositoryType = {
  createCart,
  updateCart,
  findCart,
  deleteCart,
  clearCartData,
};
