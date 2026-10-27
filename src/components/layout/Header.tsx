'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CartContext, useCart } from '@/context/CartContext';
import { WishlistContext, useWishlist } from '@/context/WishlistContext';
import { useSearch } from '@/hooks/useSearch';
import { CATEGORIES } from '@/lib/constants';

/* ------------------------------------------------------------------ */
/*  Categorías del mega-menú (estáticas hasta la Fase 2: seed/DB)     */
/* ------------------------------------------------------------------ */

const MEGA_MENU: Array<{
  label: string;
  href: string;
  description: string;
}> = [
  {
    label: 'Café en grano',
    href: '/tienda?categoria=grano',
    description: 'Granos tostados, listos para moler en casa.',
  },
  {
    label: 'Café molido',
    href: '/tienda?categoria=molido',
    description: 'Moliendas para cada método de preparación.',
  },
  {
    label: 'Cafés de origen',
    href: '/tienda?categoria=origen',
    description: 'Huila, Nariño, Cauca, Santander y más.',
  },
  {
    label: 'Cafés especiales',
    href: '/tienda?categoria=especiales',
    description: 'Micro-lotes y cafés de puntuación alta.',
  },
  {
    label: 'Cápsulas y monodosis',
    href: '/tienda?categoria=capsulas',
    description: 'Compatibles con los sistemas más usados.',
  },
  {
    label: 'Accesorios y métodos',
    href: '/tienda?categoria=accesorios',
    description: 'V60, Chemex, prensas francesas y molinos.',
  },
  {
    label: 'Kits y regalos',
    href: '/tienda?categoria=kits',
    description: 'Packs listos para regalar o estrenar.',
  },
];

/* ------------------------------------------------------------------ */
/*  Iconos SVG                                                        */
/* ------------------------------------------------------------------ */

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M3 1a1 1 0 001 1h1a1 1 0 110 2H3a1 1 0 00-1 1H1a1 1 0 00-1 1v1a1 1 0 001 1h2.586l-.707 7.071A1 1 0 003.414 17H17a1 1 0 00.707-1.707L14.586 13H3a1 1 0 00-1 1v1a1 1 0 001 1h10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 100-2h-2.414l.707-7.071A1 1 0 0015.414 3H17a1 1 0 001-1V2a1 1 0 00-1-1H4a1 1 0 00-1 1z"
      clipRule="evenodd"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Header                                                            */
/* ------------------------------------------------------------------ */

export const Header: React.FC = () => {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { query, setQuery, results, isLoading, saveSearch } = useSearch();

  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Cerrar mega-menú y menú usuario al hacer clic fuera */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        saveSearch(query);
        setSearchOpen(false);
      }
    },
    [query, saveSearch],
  );

  return (
    <div
      ref={wrapperRef}
      className="sticky top-0 z-40 border-b border-[#5A3A24]/20 bg-[#F6EEE0]/80 backdrop-blur-md"
    >
      <div className="px-4 md:px-6">
        {/* Barra superior: logo, buscador, acciones */}
        <div className="flex items-center justify-between h-16 md:h-20 gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo size="md" />
          </Link>

          {/* Buscador visible */}
          <div className="hidden md:flex-1 md:max-w-[520px]">
            <form
              onSubmit={handleSearchSubmit}
              className="relative"
              aria-label="Buscar productos"
            >
              <Input
                ref={searchInputRef}
                placeholder="Busca café, origen o método…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                startIcon={<SearchIcon />}
                className="pl-10"
              />
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A3A24]/60 hover:text-[#5A3A24] transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <CloseIcon />
                </button>
              )}
              {isLoading && <span className="absolute right-10 top-1/2 -translate-y-1/2 text-[#D49A2A]"><Spinner size="sm" /></span>}
            </form>
            {query.trim() && (
              <div
                className="absolute left-0 right-0 mt-1 z-30 rounded-xl bg-[#F6EEE0] border border-[#5A3A24]/20 shadow-lg font-body text-[#2B1B12]"
              >
                {results.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[#5A3A24]/60">
                    No encontramos coincidencias
                  </div>
                ) : (
                  <ul role="listbox" aria-label="Resultados de búsqueda">
                    {results.slice(0, 6).map((result) => (
                      <li key={result.id}>
                        <button
                          onClick={() => {
                            saveSearch(result.name);
                            setQuery('');
                            setSearchOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-[#EADCC4]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A2A] focus-visible:rounded-sm"
                        >
                          <div className="font-medium">{result.name}</div>
                          <div className="text-xs text-[#5A3A24]/50">
                            {result.category}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMegaOpen((prev) => !prev)}
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
              className="hidden md:flex"
            >
              Categorías
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              aria-expanded={userMenuOpen}
              aria-label="Cuenta de usuario"
              className="relative"
            >
              <UserIcon />
              <span className="sr-only">Cuenta</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-expanded={searchOpen}
              aria-label="Carrito de compras"
              className="relative"
            >
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D49A2A] text-[#2B1B12] text-xs font-bold shadow-sm">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Carrito ({itemCount})</span>
            </Button>
          </div>
        </div>

        {/* Mega-menú de categorías (desktop) */}
        {megaOpen && (
          <nav
            id="mega-menu"
            className="absolute left-0 right-0 mt-2 z-30"
            aria-label="Mega-menú de categorías"
          >
            <div className="rounded-xl border border-[#5A3A24]/20 bg-[#F6EEE0] shadow-2xl shadow-[#2B1B12]/10 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-body">
                {MEGA_MENU.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="group"
                  >
                    <div className="flex flex-col gap-2 p-3 rounded-lg hover:bg-[#EADCC4]/50 transition-colors">
                      <span className="font-semibold text-[#2B1B12] group-hover:text-[#5A3A24] transition-colors">
                        {cat.label}
                      </span>
                      <span className="text-sm text-[#5A3A24]/60">
                        {cat.description}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* Menú usuario (desplegable) */}
        {userMenuOpen && (
          <div className="absolute right-0 mt-2 z-30 w-48 rounded-xl border border-[#5A3A24]/20 bg-[#F6EEE0] shadow-2xl shadow-[#2B1B12]/10 p-3 font-body text-[#2B1B12]">
            <Link
              href="/cuenta"
              className="block px-4 py-2 text-sm rounded-lg hover:bg-[#EADCC4]/50 transition-colors"
            >
              Mi cuenta
            </Link>
            <Link
              href="/pedidos"
              className="block px-4 py-2 text-sm rounded-lg hover:bg-[#EADCC4]/50 transition-colors"
            >
              Mis pedidos
            </Link>
            <hr className="my-2 border-[#5A3A24]/10" />
            <Link
              href="/iniciar-sesion"
              className="block px-4 py-2 text-sm rounded-lg hover:bg-[#EADCC4]/50 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="block px-4 py-2 text-sm rounded-lg hover:bg-[#EADCC4]/50 transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
