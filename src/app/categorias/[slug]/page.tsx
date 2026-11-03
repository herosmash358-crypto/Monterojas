import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
  getCategoryBySlug,
  getCategories,
  getProductsByCategory,
} from '@/lib/server/catalog';
import { CategoryCatalog } from '@/components/catalog/CategoryCatalog';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: `${category.name} — Monterojas Café`,
    description: category.shortDesc,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory(category.slug);

  return (
    <div className="pb-24">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src={category.bannerImage}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-espresso/20" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-crema/80 mb-3">
            <Link href="/" className="hover:text-ocre transition-colors">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span aria-current="page" className="font-bold text-crema truncate">
              {category.name}
            </span>
          </nav>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-crema drop-shadow">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-crema/90 max-w-2xl leading-relaxed">
              {category.description}
            </p>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-ocre bg-espresso/70 backdrop-blur-sm px-3 py-1 rounded-full mt-1">
              {categoryProducts.length} {categoryProducts.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 pb-8">
          {category.subcategories.map((sub) => (
            <span
              key={sub.slug}
              className="text-[11px] font-medium text-tierra bg-white border border-lino px-3 py-1.5 rounded-full"
            >
              {sub.name}
            </span>
          ))}
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-lino/50 rounded-craft animate-pulse" />
              ))}
            </div>
          }
        >
          <CategoryCatalog category={category} products={categoryProducts} />
        </Suspense>
      </div>
    </div>
  );
}
