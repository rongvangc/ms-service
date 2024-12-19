import { MessageBrokeType, MessageHandler } from "./broker.type";

export const MessageBroke: MessageBrokeType = {
  connectProducer: function <T>(): Promise<T> {
    throw new Error("Function not implemented.");
  },
  disconnectProducer: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  publish: function (data: unknown): Promise<boolean> {
    throw new Error("Function not implemented.");
  },
  connectConsumer: function <T>(): Promise<T> {
    throw new Error("Function not implemented.");
  },
  disconnectConsumer: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  subcribe: function <T>(
    messageHandler: MessageHandler,
    topic: string
  ): Promise<void> {
    throw new Error("Function not implemented.");
  },
};
