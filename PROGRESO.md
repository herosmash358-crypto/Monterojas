# PROGRESO.md — Monterojas

Estado del proyecto: tienda de café de especialidad (colombiano).
Stack: Next.js 14 (App Router), React 18, TypeScript 5, Tailwind 3.4, Prisma + SQLite, npm.

## Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Crear/sincronizar base de datos SQLite (dev.db)
npx prisma db push

# Servidor de desarrollo (http://localhost:3000)
npm run dev

# Verificación (lint + build)
npm run lint
npm run build

# Generar imágenes placeholder SVG
node scripts/generate-placeholders.js
```

## FASE 0: ORDENAR LA ESTRUCTURA — HECHO ✅

- Contenido de `monterojas-temp/` movido a la raíz (`package.json`, `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `.eslintrc.json`, `.gitignore`, `next-env.d.ts`, `package-lock.json`, `README.md`).
- `src/app/` fusionado bajo `src/` (junto a `components/`, `context/`, `hooks/`, `lib/`, `types/`, `ui/`).
- Carpeta `monterojas-temp/` eliminada.
- `.env` creado con `DATABASE_URL="file:./dev.db"`.
- `.gitignore` actualizado: se agregaron `.env` y `*.db`.
- `npm install` ejecutado.
- `prisma@5` agregado como devDependency (no estaba en el proyecto).
- `npx prisma generate` ejecutado (Prisma Client generado).
- `npx prisma db push` ejecutado (SQLite `dev.db` creado y sincronizado).
- `npm run build` pasa correctamente.
- COMMIT: registro inicial pendiente hasta instalar git (ver Bloqueos conocidos).

## FASE 1: SISTEMA DE DISEÑO Y LAYOUT — HECHO ✅

- Header con buscador, mega-menú de 7 categorías con spotlight, menú móvil, banner superior (`src/components/common/Header.tsx`).
- Footer verde bosque con newsletter, enlaces y método de pago (`src/components/common/Footer.tsx`).
- Logo wordmark SVG (montaña + grano de café) (`src/components/common/Logo.tsx`).
- Drawer de carrito global (`src/components/cart/CartDrawer.tsx`).
- Store global con carrito, wishlist, cupones, login, pedidos y reseñas persistidos en localStorage (`src/lib/store.tsx`).
- Página de inicio con hero, selector por gusto, bestsellers, micro-lotes, categorías, historia y blog (`src/app/page.tsx`).
- Datos de catálogo: 26 productos, 7 categorías, reseñas y blog (`src/lib/data/`).
- Páginas estáticas: buscar, carrito, checkout, contacto, cuenta (+favoritos/pedidos/direcciones), envios, faq, nuestra-historia, terminos, blog [+slug].

## FASE 1.5: RUTAS DINÁMICAS FALTANTES — HECHO ✅

- `/producto/[slug]`: detalle con galería, selección de variante/molienda, perfil sensorial (`FlavorProfileWidget`), certificaciones, specs, FAQ acordeón, reseñas (distribución + formulario + votar útil) y productos relacionados. SSG con `generateStaticParams` (26 páginas).
  - Nuevos componentes: `ProductDetail.tsx`, `ProductReviews.tsx`.
- `/categorias/[slug]`: banner con descripción, sidebar de filtros (subcategoría, precio, tostión, proceso, notas, puntaje SCAA, rating, certificaciones, stock), orden y drawer móvil. Sync con `?sub=` del mega-menú. SSG (7 páginas).
  - Nuevo componente: `CategoryCatalog.tsx`.
- `/confirmacion/[id]`: pedido confirmado con resumen, totales, dirección, guía de rastreo y estado vacío si no existe.
- Tipos: `flavorNotes` ahora opcional en `Product` (accesorios no tienen notas de cata); consumidores actualizados (`ProductCard`, `SearchBar`, `page.tsx`, `buscar/page.tsx`) con acceso null-safe.
- `npm run lint` OK (solo warning conocido de `<img>` en UI/Card.tsx). `npm run build` OK: 51 páginas.

## FASE 2: DATOS Y CATÁLOGO — PENDIENTE

- `prisma/schema.prisma` ajustado para SQLite (enum `Role` → `String`, relación `OrderItem.variant` agregada).
- Faltan: seed con 24 productos, 3-8 reseñas/producto, usuario de prueba; `prisma/seed.ts` y script en `package.json`.

## FASE 3-8 — PENDIENTE

Ver plan completo en el mensaje del usuario.

## Todo en condiciones (pre-Fase 2) ✅

- Imágenes placeholder SVG generadas: 24 productos, 7 categorías, hero y 3 de blog en `public/images/`.
- `CardImage` (`ui/Card.tsx`) migrada a `next/image`: `npm run lint` sin warnings ni errores.
- Eliminados re-exports duplicados de `src/components/layout/` (Header/Footer/Logo viven en `src/components/common/`).
- Git instalado v2.56 (vía winget). Repositorio inicializado en `main` con identidad `monte_rojas_coffe`.
- Commit raíz `8576215`: Fase 0-1.5 completa (161 archivos). `.env`, `*.db` y `next-env.d.ts` excluidos correctamente.

## Bloqueos conocidos

- NINGUNO ACTIVO. El bloqueo de git quedó resuelto (instalado y configurado).
