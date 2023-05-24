import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Insira os dados de teste no banco de dados
    const user1 = await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@example.com',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'Bob',
        email: 'bob@example.com',
      },
    });

    console.log('Seeding successful:', [user1, user2]);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();