import { defineConfig } from "drizzle-kit";
import { DB_URL } from "./src/config";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL as string,
  },
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
});
