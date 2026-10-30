'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, SearchX } from 'lucide-react';
import { Category } from '@/lib/types';
import { PRODUCTS } from '@/lib/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar, FilterState } from '@/components/catalog/FilterSidebar';

const DEFAULT_FILTERS: FilterState = {
  subcategory: '',
  minPrice: 25000,
  maxPrice: 400000,
  roastLevel: [],
  process: [],
  flavorNotes: [],
  minScore: 0,
  minRating: 0,
  onlyInStock: false,
  certifications: [],
};

type SortOption = 'relevance' | 'bestsellers' | 'price-asc' | 'price-desc' | 'rating';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'bestsellers', label: 'Más vendidos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor calificados' },
];

interface CategoryCatalogProps {
  category: Category;
}

export function CategoryCatalog({ category }: CategoryCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subFromQuery = searchParams.get('sub') || '';

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    subcategory: subFromQuery,
  });
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Keep sidebar selection in sync with ?sub= in the URL
  useEffect(() => {
    setFilters((prev) => ({ ...prev, subcategory: subFromQuery }));
  }, [subFromQuery]);

  const handleSubcategorySelect = useCallback(
    (subSlug: string) => {
      setFilters((prev) => ({ ...prev, subcategory: subSlug }));
      const newParams = new URLSearchParams(searchParams.toString());
      if (subSlug) {
        newParams.set('sub', subSlug);
      } else {
        newParams.delete('sub');
      }
      const qs = newParams.toString();
      router.replace(qs ? `/categorias/${category.slug}?${qs}` : `/categorias/${category.slug}`, {
        scroll: false,
      });
    },
    [category.slug, router, searchParams]
  );

  const resetAllFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, subcategory: subFromQuery });
  };

  const categoryProducts = useMemo(
    () => PRODUCTS.filter((p) => p.categorySlug === category.slug),
    [category.slug]
  );

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      if (filters.subcategory && product.subcategory !== filters.subcategory) return false;
      if (product.price > filters.maxPrice) return false;

      if (filters.roastLevel.length > 0) {
        if (!product.roastLevel || !filters.roastLevel.includes(product.roastLevel)) return false;
      }

      if (filters.process.length > 0) {
        if (!product.process || !filters.process.includes(product.process)) return false;
      }

      if (filters.flavorNotes.length > 0) {
        const hasNote = filters.flavorNotes.some((n) =>
          product.flavorNotes?.some((pn) => pn.toLowerCase().includes(n.toLowerCase()))
        );
        if (!hasNote) return false;
      }

      if (filters.minScore > 0) {
        if (!product.cuppingScore || product.cuppingScore < filters.minScore) return false;
      }

      if (filters.minRating > 0) {
        if (product.rating < filters.minRating) return false;
      }

      if (filters.onlyInStock && !product.inStock) return false;

      if (filters.certifications.length > 0) {
        const hasCert = filters.certifications.some((c) =>
          product.certifications.some((pc) => pc.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasCert) return false;
      }

      return true;
    });
  }, [categoryProducts, filters]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'bestsellers':
        return list.sort(
          (a, b) =>
            (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.rating - a.rating
        );
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'relevance':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  const activeFilterCount =
    filters.roastLevel.length +
    filters.process.length +
    filters.flavorNotes.length +
    filters.certifications.length +
    (filters.minScore > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.onlyInStock ? 1 : 0) +
    (filters.subcategory ? 1 : 0);

  const sidebar = (
    <FilterSidebar
      category={category}
      filters={filters}
      setFilters={(action) => setFilters(action)}
      totalProductsCount={sortedProducts.length}
      resetAllFilters={resetAllFilters}
    />
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:sticky lg:top-44">{sidebar}</div>

      {/* Results column */}
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lino pb-4">
          <p className="text-sm text-tierra">
            <span className="font-serif font-bold text-lg text-espresso">{sortedProducts.length}</span>{' '}
            {sortedProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-espresso border border-lino rounded-full px-4 py-2 hover:border-ocre transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="bg-ocre text-espresso px-1.5 py-0.5 rounded-full text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <label className="sr-only" htmlFor="sort-by">
              Ordenar productos
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs font-semibold text-espresso bg-white border border-lino rounded-full px-4 py-2 focus:outline-none focus:border-ocre cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active subcategory chip */}
        {filters.subcategory && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-tierra">Filtrando por:</span>
            <button
              onClick={() => handleSubcategorySelect('')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-espresso bg-ocre/20 border border-ocre/40 px-3 py-1.5 rounded-full hover:bg-ocre/30 transition-colors"
            >
              {category.subcategories.find((s) => s.slug === filters.subcategory)?.name || filters.subcategory}
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Grid */}
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6 bg-white border border-dashed border-lino rounded-craft">
            <SearchX className="w-10 h-10 text-lino-dark mb-4" />
            <h3 className="font-serif text-xl font-bold text-espresso">
              No encontramos cafés con estos filtros
            </h3>
            <p className="text-sm text-tierra mt-2 max-w-sm">
              Prueba ajustando o quitando algunos filtros para descubrir más tazas.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-6 text-xs font-bold uppercase tracking-wider bg-ocre text-espresso px-6 py-3 rounded-full hover:bg-ocre-hover transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {sortedProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 3} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-crema shadow-2xl overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 border-b border-lino mb-4">
              <span className="font-serif font-bold text-lg text-espresso">Filtros</span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 rounded-full text-tierra hover:bg-lino"
                aria-label="Cerrar filtros"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              category={category}
              filters={filters}
              setFilters={(action) => setFilters(action)}
              totalProductsCount={sortedProducts.length}
              isMobileDrawer
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
              resetAllFilters={resetAllFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
