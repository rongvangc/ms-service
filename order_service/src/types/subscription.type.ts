export enum OrderEvent {
  CREATE_ORDER = "CREATE_ORDER",
  CANCEL_ORDER = "CANCEL_ORDER",
}

export type TOPIC_TYPE = "OrderEvent" | "CatalogEvent";

export interface MessageType {
  header?: Record<string, string>;
  event: OrderEvent;
  data: Record<string, string>;
}
