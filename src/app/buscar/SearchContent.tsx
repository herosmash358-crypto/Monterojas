'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  ChevronRight,
  SlidersHorizontal,
  X,
  Sparkles,
  Coffee,
  ArrowUpDown,
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar, FilterState } from '@/components/catalog/FilterSidebar';
import { Product } from '@/lib/types';

interface SearchContentProps {
  products: Product[];
  initialQuery: string;
}

export function SearchContent({ products: allProducts, initialQuery }: SearchContentProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || initialQuery || '';

  const [filters, setFilters] = useState<FilterState>({
    subcategory: '',
    minPrice: 0,
    maxPrice: 400000,
    roastLevel: [],
    process: [],
    flavorNotes: [],
    minScore: 0,
    minRating: 0,
    onlyInStock: false,
    certifications: [],
  });

  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'bestsellers' | 'rating'>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const resetAllFilters = () => {
    setFilters({
      subcategory: '',
      minPrice: 0,
      maxPrice: 400000,
      roastLevel: [],
      process: [],
      flavorNotes: [],
      minScore: 0,
      minRating: 0,
      onlyInStock: false,
      certifications: [],
    });
  };

  // Base products matching search query (pre-filtered by server)
  const queryMatchedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProducts;

    return allProducts.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.origin?.toLowerCase().includes(q) ||
        p.department?.toLowerCase().includes(q) ||
        p.farm?.toLowerCase().includes(q) ||
        p.variety?.toLowerCase().includes(q) ||
        p.categorySlug.toLowerCase().includes(q) ||
        p.flavorNotes?.some((n) => n.toLowerCase().includes(q))
      );
    });
  }, [query, allProducts]);

  // Apply active filters on top of search query
  const filteredProducts = useMemo(() => {
    return queryMatchedProducts.filter((product) => {
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
  }, [queryMatchedProducts, filters]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'bestsellers':
        return list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'relevance':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="space-y-8 pb-20">
      {/* Breadcrumbs */}
      <div className="bg-crema-dark/50 border-b border-lino/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-tierra">
            <Link href="/" className="hover:text-espresso">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span>Búsqueda</span>
            {query && (
              <>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                <span className="font-bold text-espresso">&quot;{query}&quot;</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-crema-dark p-6 sm:p-8 rounded-3xl border border-lino">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-tierra flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-ocre" /> Resultados del Catálogo
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
              {query ? `Resultados para: "${query}"` : 'Todos los Cafés y Métodos'}
            </h1>
            <p className="text-xs text-tierra">
              {sortedProducts.length === 1
                ? 'Se encontró 1 lote compatible'
                : `Se encontraron ${sortedProducts.length} lotes y accesorios disponibles`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-lino shadow-soft">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                totalProductsCount={sortedProducts.length}
                resetAllFilters={resetAllFilters}
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-lino shadow-soft">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 bg-crema-dark text-espresso font-semibold text-xs px-4 py-2.5 rounded-xl border border-lino hover:bg-lino transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-ocre" />
                <span>Filtros</span>
              </button>

              <div className="text-xs text-tierra">
                Mostrando <strong className="text-espresso font-bold">{sortedProducts.length}</strong> productos
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <ArrowUpDown className="w-3.5 h-3.5 text-tierra/70" />
                <label htmlFor="sortSearchSelect" className="text-xs text-tierra whitespace-nowrap">
                  Ordenar:
                </label>
                <select
                  id="sortSearchSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-crema-light border border-lino rounded-xl px-3 py-1.5 text-xs font-semibold text-espresso focus:border-ocre outline-none cursor-pointer"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="bestsellers">Más Vendidos</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Calificados</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-lino p-12 text-center shadow-soft space-y-4">
                <div className="w-16 h-16 rounded-full bg-crema-dark mx-auto flex items-center justify-center text-tierra">
                  <Coffee className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso">
                  No encontramos coincidencias para &quot;{query}&quot;
                </h3>
                <p className="text-xs sm:text-sm text-tierra max-w-md mx-auto leading-relaxed">
                  Verifica que no haya errores ortográficos, o busca por una región (ej. <strong>Huila</strong>, <strong>Nariño</strong>) o método (ej. <strong>V60</strong>, <strong>Prensa</strong>).
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  {['Geisha', 'Huila', 'Cápsulas', 'V60 Hario', 'Descafeinado'].map((sug) => (
                    <Link
                      key={sug}
                      href={`/buscar?q=${encodeURIComponent(sug)}`}
                      className="px-3 py-1 bg-crema rounded-full text-xs text-tierra font-medium border border-lino hover:border-ocre hover:text-ocre transition-colors"
                    >
                      {sug}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-espresso/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-crema p-6 shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-lino mb-4">
                <h3 className="font-serif font-bold text-lg text-espresso">Filtros de Búsqueda</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-tierra hover:bg-lino"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                totalProductsCount={sortedProducts.length}
                isMobileDrawer={true}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
                resetAllFilters={resetAllFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
