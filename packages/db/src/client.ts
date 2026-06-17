console.log("=== USING PACKAGES/DB CLIENT.TS ===");

import { PrismaClient } from "@prisma/client";

declare const process: { env: { NODE_ENV: string } };

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}