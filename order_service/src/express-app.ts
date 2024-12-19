import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import cartRouter from "./routes/cart.routes";
import orderRouter from "./routes/order.routes";
import { HandleErrorWithLogger, httpLogger } from "./utils";
import { MessageBroke } from "./utils/broker/message.broker";
import { Consumer, Producer } from "kafkajs";

const ExpressApp = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);

  // 1st step: connect to the producer and consumer
  const producer = await MessageBroke.connectProducer<Producer>();
  producer.on("producer.connect", () => {
    console.log("producer connected");
  });

  const consumer = await MessageBroke.connectConsumer<Consumer>();
  consumer.on("consumer.connect", () => {
    console.log("consumer connected");
  });

  // 2st step: subscribe to end the topic or publish new message
  await MessageBroke.subscribe((message) => {
    console.log("Consumer received the message");
    console.log("Message received", message);
  }, "OrderEvents");

  app.use(orderRouter);
  app.use(cartRouter);

  app.use(
    "/",
    async (req: Request, res: Response, _: NextFunction): Promise<any> => {
      return res.status(200).json({
        message: "health is up",
      });
    }
  );

  app.use(HandleErrorWithLogger);

  return app;
};

// app.use(HandleUnCaughtException);

export default ExpressApp;
