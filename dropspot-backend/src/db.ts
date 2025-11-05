import { PrismaClient, Role } from "@prisma/client";

export const prisma = new PrismaClient();
export const prismaType = {
    Role: Role,
};
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});