import { prisma } from "../db.js";

/**
 * Compliant database helper using the mandated Prisma Client persistence layer.
 */
export async function findUserWithPrisma(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}
