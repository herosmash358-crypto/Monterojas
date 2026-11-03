'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface SearchBarProps {
  onSearchSubmit?: () => void;
  className?: string;
  isMobileModal?: boolean;
}

const POPULAR_SEARCHES = ['Geisha', 'Huila Suave', 'V60 Hario', 'Cápsulas compostables', 'Descafeinado caña', 'Prensa Francesa'];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchSubmit,
  className = '',
  isMobileModal = false,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar productos para el autocomplete desde la API
    let cancelled = false;
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.products) {
          setProducts(data.products);
          setProductsLoaded(true);
        }
      })
      .catch(() => setProductsLoaded(true));
    return () => { cancelled = true; };

    // Cargar búsquedas recientes
    try {
      const saved = localStorage.getItem('monterojas_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved as string).slice(0, 5));
      }
    } catch (e) {}
  }, []);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    const updated = [clean, ...recentSearches.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('monterojas_recent_searches', JSON.stringify(updated));
    } catch (e) {}
  };

  const removeRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((t) => t !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem('monterojas_recent_searches', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecentSearch(term);
    setIsOpen(false);
    if (onSearchSubmit) onSearchSubmit();
    router.push(`/buscar?q=${encodeURIComponent(term.trim())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  // Live matching products (tolerant search)
  const matches = query.trim().length >= 2 && productsLoaded
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.origin?.toLowerCase().includes(q) ||
          p.department?.toLowerCase().includes(q) ||
          p.variety?.toLowerCase().includes(q) ||
          p.categorySlug.toLowerCase().includes(q) ||
          p.flavorNotes?.some((n) => n.toLowerCase().includes(q))
        );
      }).slice(0, 4)
    : [];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar café por origen, varietal, notas o método..."
          className="w-full bg-crema-light/90 hover:bg-crema-light focus:bg-white text-espresso placeholder-espresso/60 text-sm rounded-full pl-10 pr-10 py-2.5 border border-lino focus:border-ocre focus:ring-2 focus:ring-ocre/20 transition-all outline-none"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tierra/70" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-espresso/40 hover:text-espresso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Autocomplete / Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-elevated border border-lino p-4 z-50 text-espresso text-sm animate-in fade-in-50 zoom-in-95">
          {/* Live Matching Products */}
          {matches.length > 0 && (
            <div className="mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-tierra/70 mb-2 block">
                Productos sugeridos
              </span>
              <div className="space-y-2">
                {matches.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/producto/${prod.slug}`}
                    onClick={() => {
                      saveRecentSearch(prod.name);
                      setIsOpen(false);
                      if (onSearchSubmit) onSearchSubmit();
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-crema transition-colors group"
                  >
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-lino flex-shrink-0">
                      <Image
                        src={prod.images[0]}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-espresso truncate group-hover:text-ocre transition-colors">
                        {prod.name}
                      </p>
                      <p className="text-xs text-tierra/80 truncate">
                        {prod.origin || prod.tagline} · ${(prod.price).toLocaleString('es-CO')} COP
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-tierra/50 group-hover:text-ocre group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-tierra/70 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Búsquedas recientes
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('monterojas_recent_searches');
                  }}
                  className="text-[11px] text-tierra/60 hover:text-error transition-colors"
                >
                  Borrar todo
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSearch(term)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crema text-xs text-espresso hover:bg-lino transition-colors"
                  >
                    <span>{term}</span>
                    <span
                      onClick={(e) => removeRecent(term, e)}
                      className="text-espresso/40 hover:text-espresso"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Suggestions */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-tierra/70 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ocre" /> Tendencias populares
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSearch(tag)}
                  className="px-3 py-1 rounded-full bg-crema-light border border-lino text-xs text-tierra font-medium hover:border-ocre hover:text-ocre transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Press enter to see all */}
          {query.trim().length > 0 && (
            <div className="mt-3 pt-3 border-t border-lino text-center">
              <button
                type="button"
                onClick={() => handleSearch(query)}
                className="text-xs font-semibold text-ocre hover:underline flex items-center justify-center gap-1.5 w-full"
              >
                Ver todos los resultados para &quot;{query}&quot; <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
