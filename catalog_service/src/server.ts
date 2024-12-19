import app from "./express-app";
import { logger } from "./utils";

const PORT = process.env.PORT || 8000;

export const StartServer = async () => {
  app.listen(PORT, () => {
    logger.info("Server running on port:", PORT);
  });

  process.on("uncaughtException", async (err) => {
    logger.error(err);
    process.exit(1);
  });
};

StartServer().then(() => logger.info("Server is up"));
