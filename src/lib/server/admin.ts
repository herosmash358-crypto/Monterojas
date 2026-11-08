// =============================================================================
// Monterojas - Capa de datos de administración (server-only)
// Adaptado para MongoDB: sin @relation, las asociaciones se resuelven por ID
// =============================================================================

import { prisma } from '@/lib/prisma';
import type {
  ProductVariant as ProductVariantRow,
  ProductImage as ProductImageRow,
  Review as ReviewRow,
  WishlistItem as WishlistItemRow,
  OrderItem as OrderItemRow,
  Order as OrderRow,
  User as UserRow,
  Category as CategoryRow,
} from '@prisma/client';

/* ------------------------------------------------------------------ */
/*  Dashboard                                                         */
/* ------------------------------------------------------------------ */

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  totalRevenue: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalProducts,
    totalCategories,
    totalOrders,
    totalUsers,
    pendingOrders,
    revenueResult,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: 'pendiente' } }),
    prisma.order.aggregate({
      where: { paymentStatus: 'aprobado' },
      _sum: { total: true },
    }),
  ]);

  return {
    totalProducts,
    totalCategories,
    totalOrders,
    totalUsers,
    pendingOrders,
    totalRevenue: revenueResult._sum.total ?? 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Productos (admin)                                                 */
/* ------------------------------------------------------------------ */

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categoryName: string | null;
  price: number;
  stock: number;
  active: boolean;
  isBestseller: boolean;
  isNew: boolean;
  featured: boolean;
  reviewCount: number;
  createdAt: Date;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  if (rows.length === 0) return [];

  const productIds = rows.map((p) => p.id);

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

  // Conteos de reseñas por producto
  const reviewCounts = await prisma.review.groupBy({
    by: ['productId'],
    where: { productId: { in: productIds } },
    _count: { productId: true },
  });
  const reviewCountByProduct = new Map(
    reviewCounts.map((rc) => [rc.productId, rc._count.productId])
  );

  // Nombres de categoría por ID
  const categoryIds = new Set(
    rows.map((r) => r.categoryId).filter((id): id is string => Boolean(id))
  );
  const categories = await prisma.category.findMany({
    where: { id: { in: Array.from(categoryIds) } },
    select: { id: true, name: true },
  });
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    categoryName: row.categoryId ? categoryNameById.get(row.categoryId) ?? null : null,
    price: variantsByProduct.get(row.id)?.[0]?.price ?? 0,
    stock: variantsByProduct.get(row.id)?.reduce((acc, v) => acc + (v.stock ?? 0), 0) ?? 0,
    active: row.active,
    isBestseller: row.bestSeller,
    isNew: row.isNew,
    featured: row.featured,
    reviewCount: reviewCountByProduct.get(row.id) ?? 0,
    createdAt: row.createdAt,
  }));
}

export interface CreateProductInput {
  name: string;
  slug: string;
  sku: string;
  description: string;
  tagline?: string;
  categoryId?: string;
  price: number;
  stock: number;
  weightLabel: string;
  grind: string;
  active?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  featured?: boolean;
}

export async function createAdminProduct(input: CreateProductInput) {
  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      sku: input.sku,
      description: input.description,
      tagline: input.tagline ?? null,
      categoryId: input.categoryId ?? null,
      active: input.active ?? true,
      bestSeller: input.isBestseller ?? false,
      isNew: input.isNew ?? false,
      featured: input.featured ?? false,
    },
  });

  // Crear variante inicial como documento separado (sin @relation anidada)
  await prisma.productVariant.create({
    data: {
      productId: product.id,
      weight: null,
      weightLabel: input.weightLabel,
      grind: input.grind,
      price: input.price,
      stock: input.stock,
      sku: `${input.sku}-01`,
    },
  });

  let categoryName: string | null = null;
  if (input.categoryId) {
    const cat = await prisma.category.findUnique({
      where: { id: input.categoryId },
      select: { name: true },
    });
    categoryName = cat?.name ?? null;
  }

  return {
    ...product,
    categoryName,
  };
}

export async function updateAdminProduct(
  id: string,
  data: Partial<CreateProductInput>
) {
  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.tagline !== undefined && { tagline: data.tagline }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.active !== undefined && { active: data.active }),
      ...(data.isBestseller !== undefined && { bestSeller: data.isBestseller }),
      ...(data.isNew !== undefined && { isNew: data.isNew }),
      ...(data.featured !== undefined && { featured: data.featured }),
    },
  });

  let categoryName: string | null = null;
  if (updated.categoryId) {
    const cat = await prisma.category.findUnique({
      where: { id: updated.categoryId },
      select: { name: true },
    });
    categoryName = cat?.name ?? null;
  }

  return {
    ...updated,
    categoryName,
  };
}

export async function deleteAdminProduct(id: string) {
  // Sin @relation con onDelete: Cascade, hay que borrar documentos relacionados manualmente
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.review.deleteMany({ where: { productId: id } });
  await prisma.wishlistItem.deleteMany({ where: { productId: id } });
  return prisma.product.delete({ where: { id } });
}

/* ------------------------------------------------------------------ */
/*  Categorías (admin)                                                */
/* ------------------------------------------------------------------ */

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  productCount: number;
  displayOrder: number;
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const rows = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  // Conteos de productos por categoría (solo las que tienen categoryId)
  const categoryIds = rows.map((c) => c.id).filter(Boolean) as string[];
  const productCounts = await prisma.product.groupBy({
    by: ['categoryId'],
    where: { categoryId: { in: categoryIds } },
    _count: { categoryId: true },
  });
  const countByCategoryId = new Map(
    productCounts.map((pc) => [pc.categoryId, pc._count.categoryId])
  );

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? null,
    productCount: countByCategoryId.get(row.id) ?? 0,
    displayOrder: row.displayOrder,
  }));
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
}

export async function createAdminCategory(input: CreateCategoryInput) {
  return prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      displayOrder: input.displayOrder ?? 0,
    },
  });
}

export async function updateAdminCategory(
  id: string,
  data: Partial<CreateCategoryInput>
) {
  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
  });
}

export async function deleteAdminCategory(id: string) {
  // Desvincular productos de esta categoría antes de borrarla
  await prisma.product.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });
  return prisma.category.delete({ where: { id } });
}

/* ------------------------------------------------------------------ */
/*  Órdenes (admin)                                                   */
/* ------------------------------------------------------------------ */

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  itemCount: number;
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });
  if (rows.length === 0) return [];

  const orderIds = rows.map((o) => o.id);

  const itemCounts = await prisma.orderItem.groupBy({
    by: ['orderId'],
    where: { orderId: { in: orderIds } },
    _count: { orderId: true },
  });
  const countByOrderId = new Map(
    itemCounts.map((ic) => [ic.orderId, ic._count.orderId])
  );

  return rows.map((row) => ({
    id: row.id,
    orderNumber: row.orderNumber,
    status: row.status,
    paymentStatus: row.paymentStatus,
    total: row.total,
    customerName: row.shippingName,
    customerEmail: row.shippingEmail,
    createdAt: row.createdAt,
    itemCount: countByOrderId.get(row.id) ?? 0,
  }));
}

export async function updateAdminOrderStatus(
  id: string,
  status: string
) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

/* ------------------------------------------------------------------ */
/*  Usuarios (admin)                                                  */
/* ------------------------------------------------------------------ */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  orderCount: number;
  createdAt: Date;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  if (rows.length === 0) return [];

  const userIds = rows.map((u) => u.id);

  const orderCounts = await prisma.order.groupBy({
    by: ['userId'],
    where: { userId: { in: userIds } },
    _count: { userId: true },
  });
  const countByUserId = new Map(
    orderCounts.map((oc) => [oc.userId, oc._count.userId])
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    orderCount: countByUserId.get(row.id) ?? 0,
    createdAt: row.createdAt,
  }));
}

export async function updateAdminUserRole(id: string, role: string) {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
}
