import type { Config } from "drizzle-kit";

const prodConfig: Config = {
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
};

const devConfig: Config = {
  driver: "turso",
  dbCredentials: {
    url: "file:precis-dev.db",
  },
};

export default {
  ...(process.env.NODE_ENV === "production" ? prodConfig : devConfig),
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  verbose: true,
} satisfies Config;
