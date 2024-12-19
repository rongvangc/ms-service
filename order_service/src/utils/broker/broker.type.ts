import { MessageType, OrderEvents, TOPIC_TYPE } from "../../types";

export interface PublishType {
  headers: Record<string, any>;
  topic: TOPIC_TYPE;
  event: OrderEvents;
  message: Record<string, any>;
}

export type MessageHandler = (input: MessageType) => any;

export type MessageBrokeType = {
  // producer
  connectProducer: <T>() => Promise<T>;
  disconnectProducer: () => Promise<void>;
  publish: (data: PublishType) => Promise<boolean>;

  // comsumer
  connectConsumer: <T>() => Promise<T>;
  disconnectConsumer: () => Promise<void>;
  subscribe: <T>(
    messageHandler: MessageHandler,
    topic: TOPIC_TYPE
  ) => Promise<void>;
};
