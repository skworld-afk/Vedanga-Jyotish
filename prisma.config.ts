import * as dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local first, then fallback to .env (Next.js standard behavior)
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "./packages/db/prisma/schema.prisma",
  migrations: {
    path: "./packages/db/prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),   // ← Use DIRECT_URL here
  },
});