import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products';
import { CATEGORIES } from '@/lib/data/categories';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: ProductPageProps) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — Monterojas Café`,
    description: product.tagline,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) {
    notFound();
  }

  const category = CATEGORIES.find((c) => c.slug === product.categorySlug);
  const relatedProducts = product.relatedProductSlugs
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-24">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-tierra flex-wrap">
        <Link href="/" className="hover:text-espresso">Inicio</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        {category && (
          <>
            <Link href={`/categorias/${category.slug}`} className="hover:text-espresso">
              {category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </>
        )}
        <span aria-current="page" className="font-bold text-espresso truncate">
          {product.name}
        </span>
      </nav>

      <ProductDetail product={product} />

      {/* Reviews */}
      <ProductReviews product={product} />

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-espresso">
              También te puede encantar
            </h2>
            {category && (
              <Link
                href={`/categorias/${category.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-ocre hover:text-ocre-dark transition-colors"
              >
                Ver categoría →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
