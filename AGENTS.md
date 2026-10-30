# Monterojas — AGENTS.md

Tienda de café de especialidad (colombiano). Stack: Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS 3.4, Prisma + SQLite, ESLint 8.

## Dónde viven las cosas (crítico)

- **App Next.js:** la raíz del repo. `package.json`, `next.config.mjs`, `src/app/`, etc. están en la raíz. Ejecutar todos los comandos `npm` **desde la raíz**, no dentro de una subcarpeta.
- **Esquema Prisma:** `prisma/schema.prisma` (SQLite, `DATABASE_URL` vía `env()`). Base de datos local: `dev.db` (gitignored).
- **Script de imágenes placeholder:** `scripts/generate-placeholders.js` → `node scripts/generate-placeholders.js` (desde la raíz; escribe en `public/images/{products,categories,hero,blog}`).
- **Assets de marca:** `public/` (`logo.svg`, `logo-compact.svg`, `favicon.svg`, `images/`).
- **Fuentes:** Geist vía `next/font/local`, en `src/app/fonts/`.
- **Código ya construido (no reescribir):**
  - UI: `src/components/ui/` (Button, Card, Input, Select, Modal, Badge, Breadcrumbs, Spinner, Stars, Slider) — ya usan la paleta de marca.
  - Contextos: `src/context/CartContext.tsx`, `src/context/WishlistContext.tsx`.
  - Hooks: `src/hooks/useCart.ts`, `src/hooks/useWishlist.ts`, `src/hooks/useSearch.ts`.
  - Lib: `src/lib/constants.ts`, `src/lib/prisma.ts` (singleton), `src/lib/utils.ts`.
  - Tipos: `src/types/index.ts`.

## Comandos (desde la raíz)

- `npm run dev` — dev server en `http://localhost:3000`
- `npm run build` — build de producción (salida `.next/`)
- `npm run start` — servidor de producción
- `npm run lint` — ESLint (`eslint-config-next`)
- `npx prisma generate` — generar Prisma Client
- `npx prisma db push` — sincronizar SQLite con el schema
- `node scripts/generate-placeholders.js` — generar imágenes placeholder SVG

Package manager: **npm** (`package-lock.json` presente).

## Sin tests / sin CI

No hay test runner (vitest/jest) instalado, ni script `test`, ni CI, ni pre-commit/lint-staged. Verificación = `npm run lint` + `npm run build`.

## Convenciones / restricciones (no cambiar)

- **Mantener la paleta y el stack.** Tailwind usa CSS vars `--background` / `--foreground` (`src/app/globals.css`). Colores de marca ya definidos en los componentes UI (Espresso `#2B1B12`, Tierra `#5A3A24`, Crema `#F6EEE0`, Lino `#EADCC4`, Ocre `#D49A2A`, Verde bosque `#2F4A36`). No añadir frameworks de color ni rediseñar tokens.
- App Router: páginas bajo `src/app/**`. Path alias `@/*` → `./src/*`.
- TypeScript `strict: true`, `noEmit: true`, `isolatedModules: true`, jsx `preserve`.
- `.env` y `*.db` están en `.gitignore` (no commitear).
- `next-env.d.ts` es generado/gitignored; no commitear build output (`.next/`, `out/`).

## Estado del proyecto (Fase 0 completada)

- **Hecho:** Estructura ordenada en raíz; `.env` con `DATABASE_URL="file:./dev.db"`; Prisma instalado y schema validado (ajustado para SQLite: `role` como `String`, relación `OrderItem.variant`); `dev.db` creado y sincronizado; `npm run build` pasa.
- **Pendiente (Fase 1 en adelante):** `src/app/page.tsx` aún muestra la bienvenida por defecto de Next.js; faltan logo, header, mega-menú, footer, página de inicio con hero/categorías/más vendidos/historia; imágenes placeholder no generadas; sin seed de datos.
- **Bloqueo:** `git` no instalado en este entorno → no se pudo hacer `git commit` al finalizar Fase 0. Los cambios están en el working tree.

Siguiente fase sugerida: FASE 1 (sistema de diseño y layout).
