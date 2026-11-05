// =============================================================================
// Monterojas - Capa de datos de administración (server-only)
// =============================================================================

import { prisma } from '@/lib/prisma';

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
    include: {
      category: { select: { name: true } },
      variants: { select: { price: true, stock: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    categoryName: row.category?.name ?? null,
    price: row.variants[0]?.price ?? 0,
    stock: row.variants.reduce((acc, v) => acc + (v.stock ?? 0), 0),
    active: row.active,
    isBestseller: row.bestSeller,
    isNew: row.isNew,
    featured: row.featured,
    reviewCount: row._count.reviews,
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
  return prisma.product.create({
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
      variants: {
        create: {
          weight: null,
          weightLabel: input.weightLabel,
          grind: input.grind,
          price: input.price,
          stock: input.stock,
          sku: `${input.sku}-01`,
        },
      },
    },
    include: { category: { select: { name: true } } },
  });
}

export async function updateAdminProduct(
  id: string,
  data: Partial<CreateProductInput>
) {
  return prisma.product.update({
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
    include: { category: { select: { name: true } } },
  });
}

export async function deleteAdminProduct(id: string) {
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
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { displayOrder: 'asc' },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? null,
    productCount: row._count.products,
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
    include: {
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((row) => ({
    id: row.id,
    orderNumber: row.orderNumber,
    status: row.status,
    paymentStatus: row.paymentStatus,
    total: row.total,
    customerName: row.shippingName,
    customerEmail: row.shippingEmail,
    createdAt: row.createdAt,
    itemCount: row._count.items,
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
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    orderCount: row._count.orders,
    createdAt: row.createdAt,
  }));
}

export async function updateAdminUserRole(id: string, role: string) {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
}
