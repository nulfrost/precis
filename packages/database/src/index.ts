import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../src/drizzle/schema";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export type User = typeof schema.users.$inferInsert;
const db = drizzle(client, { schema });
export { db, schema };
export * from "drizzle-orm";
