import { OrderLineItemType, OrderWithLineItems } from "../dto/order.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { OrderRepositoryType } from "../repository/order.repository";
import { OrderStatus } from "../types/order.types";

export const CreateOrder = async (
  userId: number,
  repo: OrderRepositoryType,
  cartRepo: CartRepositoryType
) => {
  // find cart by customer id
  const cart = await cartRepo.findCart(userId);

  if (!cart) {
    throw new Error("cart not found");
  }

  // calculate total order amount
  let cartTotal = 0;
  let orderLineItems: OrderLineItemType[] = [];

  // create orderline items from cart items
  cart.lineItems.forEach((item) => {
    cartTotal += item.qty * +item.price;
    orderLineItems.push({
      productId: item.productId,
      itemName: item.itemName,
      qty: item.qty,
      price: item.price,
    } as OrderLineItemType);
  });

  const orderNumber = Math.floor(Math.random() * 1000000);

  // create order line items
  const orderInput: OrderWithLineItems = {
    orderNumber: Math.floor(Math.random() * 1000000),
    txnId: null,
    customerId: userId,
    amount: cartTotal.toString(),
    orderItems: orderLineItems,
    status: OrderStatus.PENDING,
  };

  const order = await repo.createOrder(orderInput);
  await cartRepo.clearCartData(userId);
  console.log("Order", order);

  // fire a message to subscription service [catalog service] to update stock
  // await repo.publish

  // return the success message
  return {
    message: "order created successfully",
    orderNumber,
  };
};

export const UpdateOrder = async (
  orderId: number,
  status: OrderStatus,
  repo: OrderRepositoryType
) => {
  await repo.updateOrder(orderId, status);

  // fire a message to subscription service [catalog service] to update stock

  // TODO: handle kafka calls
  if (status === OrderStatus.CANCELLED) {
  }

  return {
    message: "order created successfully",
  };
};

export const GetOrder = async (orderId: number, repo: OrderRepositoryType) => {
  const order = repo.findOrder(orderId);
  if (!order) {
    throw new Error("order not found");
  }
  return {};
};

export const GetOrders = async (userId: number, repo: OrderRepositoryType) => {
  const orders = await repo.findOrdersByCustomerId(userId);
  if (!Array.isArray(orders)) {
    throw new Error("order not found");
  }

  return orders;
};

export const DeleteOrder = async (
  orderId: number,
  repo: OrderRepositoryType
) => {
  await repo.deleteOrder(orderId);
  return true;
};

export const HandleSubscription = async (message: any) => {
  return {};
};
