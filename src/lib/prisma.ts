// =============================================================================
// Monterojas - Cliente Prisma Singleton
// Manejo del cliente de base de datos para Next.js
// =============================================================================
//
// En desarrollo, Next.js limpia el caché de módulos de Node.js en cada
// recarga en caliente (hot reload). Esto causa que se creen múltiples
// instancias del cliente Prisma, lo cual puede agotar las conexiones
// de la base de datos.
//
// Este módulo garantiza que solo exista una instancia del cliente Prisma
// durante toda la vida de la aplicación, almacenándola en globalThis.
// =============================================================================

import { PrismaClient } from "@prisma/client";

// Declarar la propiedad global para TypeScript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Instancia singleton del cliente Prisma.
 *
 * - En desarrollo: reutiliza la instancia almacenada en globalThis
 *   para evitar múltiples conexiones durante hot reload.
 * - En producción: crea una nueva instancia que persiste durante
 *   la vida del proceso.
 *
 * @example
 * import { prisma } from "@/lib/prisma";
 *
 * const products = await prisma.product.findMany();
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// En desarrollo, guardar la instancia en globalThis para reutilizarla
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
