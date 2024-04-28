import type { Config } from "drizzle-kit";
export default {
  driver: "turso",
  schema: "./src/drizzle/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
  out: "./src/drizzle/migrations",
  verbose: true,
} satisfies Config;
