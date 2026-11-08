/**
 * Seed de la base de datos Monterojas (MongoDB).
 * Fuente de verdad: el catálogo enriquecido de src/lib/data
 * (26 productos, 7 categorías con subcategorías, reseñas y blog).
 */
import { PrismaClient } from '@prisma/client';
import { PRODUCTS } from '../src/lib/data/products';
import { CATEGORIES } from '../src/lib/data/categories';
import { INITIAL_REVIEWS } from '../src/lib/data/reviews';
import { BLOG_POSTS } from '../src/lib/data/blog';
import type { Review } from '../src/lib/types';

const prisma = new PrismaClient();

/** Convierte "250g" → 250; "Unidad"/"Pack..." → null con etiqueta */
function parseWeight(weight: string): { weight: number | null; weightLabel: string } {
  const grams = /^(\d+)\s*g$/i.exec(weight.trim());
  if (grams && grams[1]) {
    return { weight: Number(grams[1]), weightLabel: `${grams[1]}g` };
  }
  return { weight: null, weightLabel: weight.trim() };
}

async function main() {
  console.log('🌱 Iniciando seed de la base de datos Monterojas (MongoDB)...');

  // 1. Limpiar datos existentes (sin restricciones FK en MongoDB)
  await prisma.wishlistItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.user.deleteMany();

  // 2. Usuario de prueba (cuenta con dirección predeterminada)
  // Se crea el usuario primero, luego la dirección como documento separado
  const userCarlos = await prisma.user.create({
    data: {
      id: 'usr-carlos-1',
      name: 'Carlos Alberto Gómez',
      email: 'carlos@monterojas.co',
      password: 'password123',
      role: 'USER',
      flavorPreferences: JSON.stringify(['Panela', 'Caramelo', 'Jazmín', 'Cacao oscuro']),
    },
  });
  await prisma.address.create({
    data: {
      userId: userCarlos.id,
      label: 'Casa',
      name: 'Carlos Alberto Gómez',
      phone: '+57 310 495 8291',
      street: 'Carrera 43A # 18 Sur - 125 Apto 502',
      city: 'Medellín',
      state: 'Antioquia',
      zipCode: '050022',
      isDefault: true,
    },
  });
  console.log('✓ Usuario de prueba creado (carlos@monterojas.co).');

  // 2b. Usuario administrador para el panel admin
  await prisma.user.create({
    data: {
      id: 'usr-admin-1',
      name: 'Administrador Monterojas',
      email: 'admin@monterojas.co',
      password: 'admin123',
      role: 'ADMIN',
      flavorPreferences: JSON.stringify([]),
    },
  });
  console.log('✓ Usuario administrador creado (admin@monterojas.co / admin123).');

  // 3. Usuarios para las reseñas existentes (uno por nombre único)
  const reviewerUsers = new Map<string, string>();
  const reviewerCounter = new Map<string, number>();
  for (const reviews of Object.values(INITIAL_REVIEWS)) {
    for (const review of reviews) {
      if (reviewerUsers.has(review.userName)) continue;
      const seq = (reviewerCounter.get(review.userName.slice(0, 4)) ?? 0) + 1;
      reviewerCounter.set(review.userName.slice(0, 4), seq);
      const id = `usr-rev-${reviewerUsers.size + 1}`;
      await prisma.user.create({
        data: {
          id,
          name: review.userName,
          email: `resenia${reviewerUsers.size + 1}@monterojas.example`,
          password: 'password123',
          role: 'USER',
        },
      });
      reviewerUsers.set(review.userName, id);
    }
  }
  console.log(`✓ ${reviewerUsers.size} usuarios de reseñas creados.`);

  // 3b. Usuarios de comunidad para reseñas sintéticas
  const COMMUNITY_USERS = ['camila.restrepo', 'andres.ospina', 'valeria.morales', 'carlos.pena', 'julian.gomez', 'laura.martinez'];
  const communityIds: string[] = [];
  for (const slugName of COMMUNITY_USERS) {
    const id = `usr-com-${communityIds.length + 1}`;
    await prisma.user.create({
      data: {
        id,
        name: slugName
          .split('.')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        email: `${slugName}@monterojas.example`,
        password: 'password123',
        role: 'USER',
      },
    });
    communityIds.push(id);
  }
  console.log(`✓ ${COMMUNITY_USERS.length} usuarios de comunidad creados.`);

  // 4. Categorías (subcategorías como JSON; banner según datos estáticos)
  for (const cat of CATEGORIES) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        shortDescription: cat.shortDesc,
        iconName: cat.iconName,
        image: cat.bannerImage,
        subcategories: JSON.stringify(cat.subcategories),
        displayOrder: 0,
      },
    });
  }
  console.log(`✓ ${CATEGORIES.length} categorías creadas.`);

  // 5. Cupones
  await prisma.coupon.createMany({
    data: [
      { code: 'MONTEROJAS10', type: 'percent', value: 10, minOrder: 50000 },
      { code: 'BIENVENIDO', type: 'fixed', value: 10000, minOrder: 60000 },
      { code: 'ENVIOFREE', type: 'fixed', value: 12000, minOrder: 70000 },
    ],
  });
  console.log('✓ Cupones creados (MONTEROJAS10, BIENVENIDO, ENVIOFREE).');

  // 6. Productos con variantes e imágenes (documentos separados, sin @relation anidada)
  for (const product of PRODUCTS) {
    const categoryId = CATEGORIES.find((c) => c.slug === product.categorySlug)?.id;

    const createdProduct = await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        tagline: product.tagline,
        description: product.description,
        shortDescription: product.tagline,
        story: product.story,
        origin: product.origin ?? null,
        department: product.department ?? null,
        farm: product.farm ?? null,
        producer: product.producer ?? null,
        subcategory: product.subcategory ?? null,
        altitude: product.altitude ?? null,
        variety: product.variety ?? null,
        process: product.process ?? null,
        roastLevel: product.roastLevel ?? null,
        flavorNotes: product.flavorNotes ? JSON.stringify(product.flavorNotes) : null,
        cuppingScore: product.cuppingScore ?? null,
        brewMethodRecommended: product.brewMethodRecommended ?? null,
        availableGrinds: JSON.stringify(product.availableGrinds),
        faqs: JSON.stringify(product.faqs),
        relatedProductSlugs: JSON.stringify(product.relatedProductSlugs),
        certifications: JSON.stringify(product.certifications),
        originalPrice: product.originalPrice ?? null,
        acidity: product.profile.acidity,
        body: product.profile.body,
        sweetness: product.profile.sweetness,
        bitterness: product.profile.bitterness,
        featured: product.featured ?? false,
        bestSeller: product.isBestseller ?? false,
        isNew: product.isNew ?? false,
        active: product.inStock,
        categoryId: categoryId ?? null,
      },
    });

    // Variantes como documentos separados con productId
    for (const variant of product.variants) {
      await prisma.productVariant.create({
        data: {
          id: variant.id,
          productId: createdProduct.id,
          weight: parseWeight(variant.weight).weight,
          weightLabel: variant.weight,
          grind: product.availableGrinds[0] ?? 'En grano',
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
        },
      });
    }

    // Imágenes como documentos separados con productId
    for (let index = 0; index < product.images.length; index++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: product.images[index],
          alt: product.name,
          displayOrder: index + 1,
          isPrimary: index === 0,
        },
      });
    }
  }
  console.log(`✓ ${PRODUCTS.length} productos creados (con variantes e imágenes).`);

  // 7. Reseñas del catálogo estático (usar usuarios por nombre)
  let reviewCount = 0;
  for (const [productId, reviews] of Object.entries(INITIAL_REVIEWS)) {
    for (const review of reviews as Review[]) {
      if (!PRODUCTS.some((p) => p.id === productId)) continue; // reseña huérfana
      await prisma.review.create({
        data: {
          productId,
          userId: reviewerUsers.get(review.userName)!,
          rating: Math.round(review.rating),
          title: review.title,
          content: review.comment,
          brewMethod: review.brewMethod ?? null,
          isVerified: review.verified,
          helpfulCount: review.helpfulCount,
          status: 'approved',
          dateLabel: review.date ?? null,
        },
      });
      reviewCount++;
    }
  }
  console.log(`✓ ${reviewCount} reseñas escritas del catálogo creado.`);

  // 7b. Reseñas sintéticas de comunidad: mínimo 3 por producto
  const PRODUCT_REVIEW_SEED_OFFSETS = new Map(PRODUCTS.map((p, index) => [p.id, index * 3]));
  const SYNTHETIC_REVIEWS = [
    { rating: 5, title: 'Frescura inigualable y tostión perfecta', comment: 'La bolsa llegó con fecha de tostión reciente. En taza se siente exactamente la descripción de las notas de cata.', brewMethod: 'V60 (Hario)' },
    { rating: 5, title: 'Balances que sorprenden', comment: 'El dulzor y la acidez jugosa están extraordinarios, sin amargor quemado. Se volvió pedido habitual en casa.', brewMethod: 'Chemex' },
    { rating: 4, title: 'Muy buen balance aromático', comment: 'Recomiendo agua a 91°C para resaltar los azúcares naturales. Repetiré sin duda.', brewMethod: 'Aeropress' },
    { rating: 5, title: 'Excelente para comenzar la mañana', comment: 'El empaque con válvula unidireccional conserva los granos intactos. Calidad de exportación en cada taza.', brewMethod: 'Prensa Francesa' },
    { rating: 4, title: 'Agradabilísimo con leche', comment: 'Se lleva muy bien con leche vegetal en cortado sin perder su carácter.', brewMethod: 'Moka italiana' },
    { rating: 5, title: 'Notas que se quedan en la memoria', comment: 'Al abrir la bolsa la fragancia inunda el ambiente. La mejor inversión este año.', brewMethod: 'V60 Origami' },
    { rating: 4, title: 'Cumple y encima llegó rapidísimo', comment: 'Envío en 24 horas a Bogotá y el empaque sellado conservó el aroma intacto.', brewMethod: 'Cafetera de goteo' },
  ];

  for (const product of PRODUCTS) {
    const currentCount = await prisma.review.count({ where: { productId: product.id } });
    let toAdd = Math.max(0, 3 - currentCount);
    let offset = PRODUCT_REVIEW_SEED_OFFSETS.get(product.id) ?? 0;
    while (toAdd > 0) {
      const sample = SYNTHETIC_REVIEWS[offset % SYNTHETIC_REVIEWS.length];
      const reviewerId = communityIds[offset % communityIds.length];
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: reviewerId,
          rating: sample.rating,
          title: sample.title,
          content: sample.comment,
          brewMethod: sample.brewMethod,
          isVerified: true,
          helpfulCount: (offset * 3) % 14,
          status: 'approved',
        },
      });
      offset++;
      toAdd--;
    }
  }
  console.log(`✓ Reseñas sintéticas agregadas para completar mínimo 3 por producto.`);

  // 8. Blog
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: JSON.stringify(post.content),
        image: post.image,
        author: `${post.author.name} (${post.author.role})`,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✓ ${BLOG_POSTS.length} posts de blog creados.`);

  console.log('🎉 Seed (MongoDB) completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
