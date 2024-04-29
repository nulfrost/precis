import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import * as schema from "../src/drizzle/schema";

// For production we'll use Turso
const sqlite = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});
const db = drizzle(sqlite, { schema });

export type User = typeof schema.users.$inferInsert;

export * from "drizzle-orm";
export { db, schema };
