import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { DB_URL } from "../config";
import * as schema from "./schema";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: DB_URL,
});

export const DB: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
