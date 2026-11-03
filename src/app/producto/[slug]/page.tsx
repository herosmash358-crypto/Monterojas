import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
  getCategoryBySlug,
  getProductBySlug,
  getProducts,
  getProductsBySlugs,
} from '@/lib/server/catalog';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — Monterojas Café`,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const [category, relatedProducts] = await Promise.all([
    product.categorySlug ? getCategoryBySlug(product.categorySlug) : Promise.resolve(null),
    getProductsBySlugs(product.relatedProductSlugs),
  ]);

  const related = relatedProducts.slice(0, 4);

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
      {related.length > 0 && (
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
            {related.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
