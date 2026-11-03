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

## FASE 2: DATOS Y CATÁLOGO — HECHO ✅

- `prisma/seed.js` inicial (24 productos) reemplazado por `prisma/seed.ts` en Fase 3: siembra desde el catálogo enriquecido de `src/lib/data` (26 productos, 7 categorías) para que los slugs de DB y frontend coincidan exactamente (`cafes-especiales-microlotes`, `capsulas-monodosis`, etc.).
- `package.json`: scripts `db:push`, `db:generate`, `db:seed`; config `prisma.seed` → `tsx prisma/seed.ts`; `tsx` como devDependency.
- `prisma/schema.prisma`: extendido con campos UI (`tagline`, `story`, `department`, `producer`, `subcategory`, `availableGrinds`/`faqs`/`relatedProductSlugs` JSON, `originalPrice`, `weightLabel`, `dateLabel`, etc.).
- DB verificada: 26 productos, 81 reseñas (mín. 3 por producto, reales + sintéticas de comunidad), 22 usuarios, 7 categorías, 3 cupones, 4 posts de blog.
- Comandos: `npm run db:push` → `npm run db:seed`.

## FASE 3: CONECTAR FRONTEND A LA DB — HECHO ✅

- `src/lib/server/catalog.ts`: capa de datos server-only con adaptadores DB→UI (`mapCategory`, `mapReview`, `mapProduct`), caché `categorySlugCache`, y funciones `getCategories`, `getCategoryBySlug`, `getProducts`, `getProductsByCategory`, `getProductBySlug`, `getReviewsByProduct`, `getProductsBySlugs`.
- API routes dinámicas: `/api/categories`, `/api/products`, `/api/products/[slug]` (`dynamic = 'force-dynamic'`).
- `src/app/producto/[slug]/page.tsx`: rewirada a `getProductBySlug` + `generateStaticParams` desde DB + `getProductsBySlugs` para relacionados.
- `src/app/categorias/[slug]/page.tsx`: rewirada a `getCategoryBySlug` + `getProductsByCategory`; `CategoryCatalog` recibe prop `products` (ya no importa `PRODUCTS` estático).
- `npm run lint` OK, `npm run build` OK: 51 páginas (26 productos + 7 categorías SSG, 3 APIs dinámicas).
- Smoke test en servidor de producción: categorías (7), producto detalle, fichas de categoría y 404 de slug inexistente — todos correctos.

### Slugs (resueltos)

- La fuente de verdad es el catálogo estático de `src/lib/data`; la DB se siembra desde él, por tanto los slugs coinciden y el mega-menú enlaza rutas existentes.

## FASE 4: MIGRAR LECTURAS ESTÁTICAS A DB — HECHO ✅

- `src/app/page.tsx` (Home): convertido a Server Component; lee productos/categorías/blog de `catalog.ts` (`getProducts`, `getCategories`, `getBlogPosts`). El "Asistente Sensorial" extraído a `src/components/home/TasteAssistant.tsx` (cliente, recibe productos como prop).
- `src/app/buscar/page.tsx`: convertido a Server Component; filtra búsqueda por `q` en el servidor. `SearchContent` separado en `src/app/buscar/SearchContent.tsx` (cliente, recibe productos como prop).
- `src/components/common/Header.tsx`: recibe categorías del layout como prop `categories` (obtenidas con `getCategories()` en `layout.tsx`); deja de importar `CATEGORIES` estático.
- `src/components/common/SearchBar.tsx`: carga productos desde `GET /api/products` para el autocomplete en lugar de `PRODUCTS` estático.
- `src/app/producto/[slug]/page.tsx`: obtiene reseñas con `getReviewsByProduct(product.id)` y las pasa a `ProductReviews`.
- `src/components/product/ProductReviews.tsx`: acepta prop opcional `reviews` (de DB) con fallback al store local; `Review` importado de tipos.
- `src/lib/server/catalog.ts`: agregadas `getBlogPosts()` y `getBlogPostBySlug()` con mapeo de `content` (JSON→array) y `author`.
- `src/lib/types.ts`: agregada interfaz `BlogPost`.
- `src/app/layout.tsx`: async; obtiene categorías y las pasa a `<Header categories={categories} />`.
- `npm run lint` OK, `npm run build` OK (51 páginas). Smoke test: Home, Buscar, ficha de producto con reseñas de DB — todos correctos.

### Pendiente (Fase 5+)

## FASE 5: CHECKOUT Y ÓRDENES CONECTADOS A LA DB — HECHO ✅

- `src/app/api/orders/route.ts`: GET (listar órdenes) y POST (crear orden en transacción: valida stock, descuenta inventario de variantes, crea Order + OrderItems). Órdenes de invitado (userId null) soportadas.
- `src/lib/server/orders.ts`: `getServerOrders(userId?)` mapea órdenes de la DB a `OrderUI`.
- `src/lib/store.tsx`: `createOrder` es ahora async; llama a `POST /api/orders` y, si falla, falla al flujo localStorage original. `addReview` y `markReviewHelpful` ya llamaban a sus APIs (cierre Fase 4).
- `src/app/checkout/page.tsx`: `handlePlaceOrder` es async y usa `await createOrder(...)`.
- `src/app/cuenta/pedidos/page.tsx`: Server Component que lee órdenes de `getServerOrders()`.
- `src/components/cuenta/OrdersList.tsx`: componente cliente que renderiza el historial (número de orden, estado, fecha, guía, ítems, total, dirección).
- `npm run lint` OK, `npm run build` OK (55 páginas).
- Smoke test: orden de prueba creada, stock descontado (45→44), página de pedidos renderiza con datos de DB.

### Pendientes restantes (Fase 6+)

- `src/app/blog/page.tsx` y `blog/[slug]/page.tsx`: YA MIGRADOS (Fase 5 previa).
- `src/app/cuenta/favoritos/page.tsx`: YA MIGRADO (Fase 5 previa).
- `src/lib/store.tsx`: reseñas nuevas se persisten en DB vía API; el estado local sigue como fallback.
- `src/app/cuenta/direcciones/page.tsx`: aún lee direcciones del store/localStorage (modelo Address ya existe en schema).
- Autenticación real contra la DB (login/register actuales son simulados en localStorage).
- Integración con pasarela de pago real (Wompi/MercadoPago) — ahora es simulada.

## FASE 6-8 — PENDIENTE

- Ver plan completo en el mensaje del usuario.

## Todo en condiciones (pre-Fase 2) ✅

- Imágenes placeholder SVG generadas: 24 productos, 7 categorías, hero y 3 de blog en `public/images/`.
- `CardImage` (`ui/Card.tsx`) migrada a `next/image`: `npm run lint` sin warnings ni errores.
- Eliminados re-exports duplicados de `src/components/layout/` (Header/Footer/Logo viven en `src/components/common/`).
- Git instalado v2.56 (vía winget). Repositorio inicializado en `main` con identidad `monte_rojas_coffe`.
- Commit raíz `8576215`: Fase 0-1.5 completa (161 archivos). `.env`, `*.db` y `next-env.d.ts` excluidos correctamente.

## Bloqueos conocidos

- NINGUNO ACTIVO. El bloqueo de git quedó resuelto (instalado y configurado).
