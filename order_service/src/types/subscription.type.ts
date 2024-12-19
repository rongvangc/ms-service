export enum OrderEvents {
  CREATE_ORDER = "CREATE_ORDER",
  CANCEL_ORDER = "CANCEL_ORDER",
}

export type TOPIC_TYPE = "OrderEvents" | "CatalogEvents";

export interface MessageType {
  headers?: Record<string, any>;
  event: OrderEvents;
  data: Record<string, any>;
}
