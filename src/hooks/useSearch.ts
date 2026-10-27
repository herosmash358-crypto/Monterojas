'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fuzzyMatch } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image?: string;
  price?: number;
  category?: string;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  recentSearches: string[];
  clearRecent: () => void;
  saveSearch: (term: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Constantes                                                         */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'monterojas_recent_searches';
const MAX_RECENT = 5;
const DEBOUNCE_MS = 300;

/**
 * Catálogo estático para búsqueda local (sustituir por API en producción).
 * Se usa para dar sugerencias mientras no haya endpoint.
 */
const STATIC_CATALOG: SearchResult[] = [
  { id: '1', name: 'Café Huila Supremo', slug: 'cafe-huila-supremo', category: 'Cafés de Origen', price: 32_000 },
  { id: '2', name: 'Café Nariño Excelso', slug: 'cafe-narino-excelso', category: 'Cafés de Origen', price: 35_000 },
  { id: '3', name: 'Café Cauca Especial', slug: 'cafe-cauca-especial', category: 'Cafés Especiales', price: 38_000 },
  { id: '4', name: 'Café Santander Orgánico', slug: 'cafe-santander-organico', category: 'Cafés de Origen', price: 36_000 },
  { id: '5', name: 'Café Sierra Nevada', slug: 'cafe-sierra-nevada', category: 'Cafés de Origen', price: 34_000 },
  { id: '6', name: 'Café Antioquia Tradicional', slug: 'cafe-antioquia-tradicional', category: 'Cafés de Origen', price: 30_000 },
  { id: '7', name: 'Café Molido Clásico', slug: 'cafe-molido-clasico', category: 'Café Molido', price: 22_000 },
  { id: '8', name: 'Café en Grano Tostado Medio', slug: 'cafe-grano-tostado-medio', category: 'Café en Grano', price: 28_000 },
  { id: '9', name: 'Cápsulas Espresso Intenso', slug: 'capsulas-espresso-intenso', category: 'Cápsulas y Monodosis', price: 25_000 },
  { id: '10', name: 'Prensa Francesa 350ml', slug: 'prensa-francesa-350ml', category: 'Accesorios y Métodos', price: 45_000 },
  { id: '11', name: 'Kit Barista Principiante', slug: 'kit-barista-principiante', category: 'Kits y Regalos', price: 120_000 },
  { id: '12', name: 'Chemex 6 Tazas', slug: 'chemex-6-tazas', category: 'Accesorios y Métodos', price: 180_000 },
  { id: '13', name: 'V60 Hario Cerámica', slug: 'v60-hario-ceramica', category: 'Accesorios y Métodos', price: 65_000 },
  { id: '14', name: 'Molino Manual de Café', slug: 'molino-manual-cafe', category: 'Accesorios y Métodos', price: 95_000 },
  { id: '15', name: 'Café Geisha Edición Limitada', slug: 'cafe-geisha-edicion-limitada', category: 'Cafés Especiales', price: 85_000 },
];

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * Hook de búsqueda con debounce, fuzzy matching y búsquedas recientes.
 *
 * Gestiona el estado de búsqueda, resultados, indicador de carga
 * y persistencia de términos recientes en localStorage.
 */
export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Cargar búsquedas recientes al montar ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setRecentSearches(JSON.parse(raw) as string[]);
      }
    } catch {
      // localStorage no disponible
    }
  }, []);

  /* ---- Búsqueda con debounce ---- */
  useEffect(() => {
    // Limpiar resultados si la consulta está vacía
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Cancelar debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      // Búsqueda local con fuzzy matching
      const trimmed = query.trim().toLowerCase();
      const matched = STATIC_CATALOG.filter(
        (product) =>
          fuzzyMatch(trimmed, product.name.toLowerCase()) ||
          (product.category &&
            fuzzyMatch(trimmed, product.category.toLowerCase())),
      );

      setResults(matched);
      setIsLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  /* ---- Guardar un término en búsquedas recientes ---- */
  const saveSearch = useCallback((term: string) => {
    if (!term.trim()) return;

    setRecentSearches((prev) => {
      const cleaned = term.trim();
      const filtered = prev.filter(
        (s) => s.toLowerCase() !== cleaned.toLowerCase(),
      );
      const updated = [cleaned, ...filtered].slice(0, MAX_RECENT);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage no disponible
      }

      return updated;
    });
  }, []);

  /* ---- Limpiar búsquedas recientes ---- */
  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage no disponible
    }
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    recentSearches,
    clearRecent,
    saveSearch,
  };
}
