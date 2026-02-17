import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;

// Task id :- 7aabf7cc-4808-4390-9d2e-89e440cf8672
// Task id :- 42e7cdf5-b370-4e74-b8ce-bf0ed08cef8f
// Task id :- 3cd6a97f-d180-4488-9ebb-9476e5d4cdb3