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
- BLOQUEO: `git` no está instalado en este entorno, no se pudo hacer `git commit`. Se registra aquí; los cambios están en el working tree.

## FASE 1: SISTEMA DE DISEÑO Y LAYOUT — PENDIENTE

- Paleta y componentes UI ya existen en `src/components/ui/` (usa Espresso, Tierra, Crema, Lino, Ocre, Verde bosque, Oliva, Salvia) — no reescribir.
- Faltan: logo SVG wordmark, header con buscador, mega-menú categorías, iconos carrito/usuario, footer verde bosque, reemplazar página de bienvenida Next.js por inicio (hero, categorías, más vendidos, historia).

## FASE 2: DATOS Y CATÁLOGO — PENDIENTE

- `prisma/schema.prisma` ajustado para SQLite (enum `Role` → `String`, relación `OrderItem.variant` agregada).
- Faltan: seed con 24 productos, 3-8 reseñas/producto, usuario de prueba; `prisma/seed.ts` y script en `package.json`.

## FASE 3-8 — PENDIENTE

Ver plan completo en el mensaje del usuario.

## Bloqueos conocidos

- `git` no instalado: no se pueden hacer commits. Fase 0 completada sin commit.
- Imágenes de producto: `public/images/*` vacío. Ejecutar `scripts/generate-placeholders.js` o conseguir fotos reales.
