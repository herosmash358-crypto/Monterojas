const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const [products, categories, reviews, users] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.review.count(),
    prisma.user.count(),
  ]);
  console.log({ products, categories, reviews, users });
}

main().catch(console.error).finally(() => prisma.$disconnect());
