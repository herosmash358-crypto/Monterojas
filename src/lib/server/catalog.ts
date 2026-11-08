// =============================================================================
// Monterojas - Capa de datos del catálogo (server-only)
// Consultas Prisma + adaptadores hacia los tipos que consume la UI
// (src/lib/types). Solo debe importarse desde Server Components / API routes.
// Adaptado para MongoDB: sin @relation, las asociaciones se resuelven por ID
// en consultas por lotes para evitar N+1.
// =============================================================================

import { prisma } from '@/lib/prisma';
import type {
  Category,
  BlogPost,
  Product,
  Review,
} from '@/lib/types';

import type {
  Category as CategoryRow,
  Prisma,
  Product as ProductRow,
  Review as ReviewRow,
  ProductVariant as ProductVariantRow,
  ProductImage as ProductImageRow,
  User as UserRow,
} from '@prisma/client';

/* ------------------------------------------------------------------ */
/*  Parseo seguro de columnas JSON                                     */
/* ------------------------------------------------------------------ */

function parseJsonArray<T = string>(value: string | null | undefined, fallback: T[] = []): T[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/*  Adaptadores                                                        */
/* ------------------------------------------------------------------ */

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDesc: row.shortDescription ?? '',
    description: row.description ?? '',
    bannerImage: row.image ?? '',
    iconName: row.iconName ?? 'Coffee',
    subcategories: parseJsonArray<{ slug: string; name: string }>(row.subcategories),
  };
}

function mapReview(row: ReviewRow, userName: string): Review {
  const date = row.dateLabel ?? new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(row.createdAt);
  const title = date.charAt(0).toUpperCase() + date.slice(1);

  return {
    id: row.id,
    productId: row.productId,
    userName,
    rating: row.rating,
    date: title,
    title: row.title ?? '',
    comment: row.content ?? '',
    brewMethod: row.brewMethod ?? undefined,
    verified: row.isVerified,
    helpfulCount: row.helpfulCount,
  };
}

type ProductWithJoins = {
  product: ProductRow;
  variants: ProductVariantRow[];
  images: ProductImageRow[];
};

function mapProduct(
  row: ProductRow,
  variants: ProductVariantRow[],
  images: ProductImageRow[],
  rating: number,
  reviewCount: number
): Product {
  const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? row.shortDescription ?? '',
    sku: row.sku,
    categorySlug: row.categoryId ? (categorySlugCache.get(row.categoryId) ?? '') : '',
    subcategory: row.subcategory ?? undefined,
    price: variants[0]?.price ?? 0,
    originalPrice: row.originalPrice ?? undefined,
    rating,
    reviewCount,
    isNew: row.isNew,
    isBestseller: row.bestSeller,
    featured: row.featured,
    inStock: variants.some((v) => v.stock > 0),
    origin: row.origin ?? undefined,
    department: row.department ?? undefined,
    farm: row.farm ?? undefined,
    producer: row.producer ?? undefined,
    altitude: row.altitude ?? undefined,
    variety: row.variety ?? undefined,
    process: row.process ?? undefined,
    roastLevel: (row.roastLevel ?? undefined) as Product['roastLevel'],
    flavorNotes: parseJsonArray<string>(row.flavorNotes),
    cuppingScore: row.cuppingScore ?? undefined,
    brewMethodRecommended: row.brewMethodRecommended ?? undefined,
    availableGrinds: parseJsonArray<string>(row.availableGrinds, ['En grano']),
    certifications: parseJsonArray<string>(row.certifications),
    profile: {
      acidity: row.acidity,
      body: row.body,
      sweetness: row.sweetness,
      bitterness: row.bitterness,
    },
    description: row.description,
    story: row.story ?? '',
    images: sortedImages.map((img) => img.url),
    variants: variants.map((v) => ({
      id: v.id,
      weight: v.weightLabel,
      price: v.price,
      stock: v.stock,
      sku: v.sku,
    })),
    faqs: parseJsonArray<{ question: string; answer: string }>(row.faqs),
    relatedProductSlugs: parseJsonArray<string>(row.relatedProductSlugs),
  };
}

/* ------------------------------------------------------------------ */
/*  Cache interno de id→slug de categoría                              */
/* ------------------------------------------------------------------ */

const categorySlugCache = new Map<string, string>();

async function warmCategorySlugCache(): Promise<void> {
  if (categorySlugCache.size > 0) return;
  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
  categories.forEach((c) => categorySlugCache.set(c.id, c.slug));
}

/* ------------------------------------------------------------------ */
/*  Consultas públicas (server-only)                                   */
/* ------------------------------------------------------------------ */

/** Todas las categorías con productos activos */
export async function getCategories(): Promise<Category[]> {
  await warmCategorySlugCache();
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { categoryId: true },
  });
  const activeCategoryIds = new Set(
    products.map((p) => p.categoryId).filter((id): id is string => Boolean(id))
  );
  const allCategories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
  });
  return allCategories.filter((c) => activeCategoryIds.has(c.id)).map(mapCategory);
}

/** Una categoría por slug (o null) */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await prisma.category.findUnique({ where: { slug } });
  return row ? mapCategory(row) : null;
}

/** Todos los productos activos, con variantes/imágenes/reseñas */
export async function getProducts(): Promise<Product[]> {
  await warmCategorySlugCache();
  const productRows = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  });
  if (productRows.length === 0) return [];

  const productIds = productRows.map((p) => p.id);

  // Variants por lote
  const variants = await prisma.productVariant.findMany({
    where: { productId: { in: productIds } },
  });
  const variantsByProduct = new Map<string, ProductVariantRow[]>();
  for (const v of variants) {
    const arr = variantsByProduct.get(v.productId) ?? [];
    arr.push(v);
    variantsByProduct.set(v.productId, arr);
  }

  // Images por lote
  const images = await prisma.productImage.findMany({
    where: { productId: { in: productIds } },
  });
  const imagesByProduct = new Map<string, ProductImageRow[]>();
  for (const img of images) {
    const arr = imagesByProduct.get(img.productId) ?? [];
    arr.push(img);
    imagesByProduct.set(img.productId, arr);
  }

  // Reviews aprobadas por lote
  const reviews = await prisma.review.findMany({
    where: { productId: { in: productIds }, status: 'approved' },
  });
  const userIds = new Set(reviews.map((r) => r.userId));
  const users = await prisma.user.findMany({
    where: { id: { in: Array.from(userIds) } },
    select: { id: true, name: true },
  });
  const userNameById = new Map(users.map((u) => [u.id, u.name ?? 'Cliente Monterojas']));

  // Agrupar reviews por producto y calcular rating
  const reviewsByProduct = new Map<string, ReviewRow[]>();
  for (const r of reviews) {
    const arr = reviewsByProduct.get(r.productId) ?? [];
    arr.push(r);
    reviewsByProduct.set(r.productId, arr);
  }

  const ratingByProduct = new Map<string, { rating: number; count: number }>();
  reviewsByProduct.forEach((revs, pid) => {
    const avg = revs.reduce((acc, r) => acc + r.rating, 0) / revs.length;
    ratingByProduct.set(pid, { rating: Math.round(avg * 10) / 10, count: revs.length });
  });

  return productRows.map((row) => {
    const stats = ratingByProduct.get(row.id) ?? { rating: 0, count: 0 };
    return mapProduct(
      row,
      variantsByProduct.get(row.id) ?? [],
      imagesByProduct.get(row.id) ?? [],
      stats.rating,
      stats.count
    );
  });
}

/** Productos de una categoría (con filtro opcional de subcategoría) */
export async function getProductsByCategory(
  categorySlug: string,
  subcategory?: string
): Promise<Product[]> {
  const all = await getProducts();
  return all.filter(
    (p) => p.categorySlug === categorySlug && (!subcategory || p.subcategory === subcategory)
  );
}

/** Un producto completo por slug (con reseñas), para la ficha de detalle */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  await warmCategorySlugCache();
  const row = await prisma.product.findUnique({ where: { slug } });
  if (!row) return null;

  const [variants, images, reviews] = await Promise.all([
    prisma.productVariant.findMany({ where: { productId: row.id } }),
    prisma.productImage.findMany({ where: { productId: row.id } }),
    prisma.review.findMany({
      where: { productId: row.id, status: 'approved' },
    }),
  ]);

  const userIds = new Set(reviews.map((r) => r.userId));
  const users = await prisma.user.findMany({
    where: { id: { in: Array.from(userIds) } },
    select: { id: true, name: true },
  });
  const userNameById = new Map(users.map((u) => [u.id, u.name ?? 'Cliente Monterojas']));

  const rating =
    reviews.length > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  return mapProduct(row, variants, images, rating, reviews.length);
}

/** Reseñas persistidas de un producto (para secciones externas) */
export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { productId, status: 'approved' },
    orderBy: { createdAt: 'desc' },
  });
  const userIds = new Set(rows.map((r) => r.userId));
  const users = await prisma.user.findMany({
    where: { id: { in: Array.from(userIds) } },
    select: { id: true, name: true },
  });
  const userNameById = new Map(users.map((u) => [u.id, u.name ?? 'Cliente Monterojas']));

  return rows.map((row) => mapReview(row, userNameById.get(row.userId) ?? 'Cliente Monterojas'));
}

/** Productos relacionados de un producto (por lista de slugs) */
export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (slugs.length === 0) return [];
  const all = await getProducts();
  const slugsSet = new Set(slugs);
  return all.filter((p) => slugsSet.has(p.slug));
}

/** Todos los posts de blog publicados, ordenados por fecha descendente */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
  });
  return rows.map((row) => {
    const authorName = row.author ? String(row.author).split(' (')[0] : '';
    const authorRole = row.author
      ? String(row.author).replace(/^.*\((.*)\)$/, '$1')
      : '';
    const date = row.publishedAt
      ? new Intl.DateTimeFormat('es-CO', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(row.publishedAt)
      : '';
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt ?? '',
      readTime: '6 min de lectura',
      category: 'Guías de Preparación',
      date,
      image: row.image ?? '',
      author: { name: authorName, role: authorRole },
      content: parseJsonArray<string>(row.content),
    };
  });
}

/** Un post de blog por slug (o null) */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findUnique({ where: { slug } });
  if (!row) return null;
  const all = await getBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
