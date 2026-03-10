import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
});

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: 'jacare-studio' },
    update: {},
    create: {
      name: 'Jacare Studio',
      slug: 'jacare-studio',
    },
  });

  console.log('Organization created:', org.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
