import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = '123456'
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            fullName: 'Test User',
            password: hashedPassword,
        },
    })

    console.log('✅ Seed completed: test@example.com / 123456')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })