'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  MapPin,
  Coffee,
  Flame,
  Box,
  Wrench,
  Gift,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/data/categories';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cart, openCart, wishlist, user } = useStore();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState(CATEGORIES[2].id); // Default Cafés de Origen
  const [scrolled, setScrolled] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryTab) || CATEGORIES[0];

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'cafe-en-grano':
        return <Coffee className="w-4 h-4 text-tierra" />;
      case 'cafe-molido':
        return <Sparkles className="w-4 h-4 text-tierra" />;
      case 'cafes-de-origen':
        return <MapPin className="w-4 h-4 text-bosque" />;
      case 'cafes-especiales-microlotes':
        return <Flame className="w-4 h-4 text-ocre-dark" />;
      case 'capsulas-monodosis':
        return <Box className="w-4 h-4 text-tierra" />;
      case 'accesorios-y-metodos':
        return <Wrench className="w-4 h-4 text-tierra" />;
      case 'kits-y-regalos':
        return <Gift className="w-4 h-4 text-ocre-dark" />;
      default:
        return <Coffee className="w-4 h-4 text-tierra" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-crema/95 backdrop-blur-md border-b border-lino transition-all">
      {/* Top Banner */}
      <div className="bg-bosque text-crema text-[11px] md:text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-ocre" />
        <span>
          Tostión artesanal fresca cada semana · <strong>Envío gratis en Colombia</strong> por compras desde $90.000 COP
        </span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-espresso hover:text-ocre transition-colors"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Logo />

          {/* Search Bar - Center Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-6">
            <SearchBar />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist */}
            <Link
              href="/cuenta/favoritos"
              className="relative p-2.5 text-espresso hover:text-ocre transition-colors rounded-full hover:bg-lino/50"
              title="Mis Favoritos"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-ocre text-espresso text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/cuenta"
              className="p-2.5 text-espresso hover:text-ocre transition-colors rounded-full hover:bg-lino/50 hidden sm:flex items-center gap-1.5 text-xs font-medium"
              title="Mi Cuenta"
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline">{user ? user.name.split(' ')[0] : 'Ingresar'}</span>
            </Link>

            {/* Cart Button with Ocre Badge */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-ocre hover:bg-ocre-hover text-espresso font-semibold px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all text-xs sm:text-sm"
              aria-label="Ver carrito"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">Carrito</span>
              {totalCartCount > 0 && (
                <span className="bg-espresso text-crema text-xs px-2 py-0.5 rounded-full font-bold">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links & Mega-Menu Bar */}
        <nav className="hidden lg:flex items-center justify-between border-t border-lino/60 py-2.5 text-xs font-semibold uppercase tracking-wider text-espresso">
          <div className="flex items-center gap-6">
            {/* Mega-menu trigger button */}
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              className="inline-flex items-center gap-1.5 text-espresso hover:text-ocre transition-colors py-1 group"
            >
              <span className="font-bold">Todas las Categorías</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-ocre' : ''}`} />
            </button>

            {CATEGORIES.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className={`py-1 hover:text-ocre transition-colors ${
                  pathname === `/categorias/${cat.slug}` ? 'text-ocre font-bold border-b-2 border-ocre' : ''
                }`}
              >
                {cat.name}
              </Link>
            ))}

            <Link
              href="/categorias/kits-y-regalos"
              className="py-1 text-ocre-dark hover:text-ocre flex items-center gap-1 font-bold"
            >
              <Gift className="w-3.5 h-3.5 text-ocre" /> Kits & Suscripciones
            </Link>
          </div>

          <div className="flex items-center gap-4 lowercase font-medium text-tierra">
            <Link href="/blog" className="hover:text-espresso flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-bosque" /> Guías de Barista
            </Link>
            <Link href="/nuestra-historia" className="hover:text-espresso">
              Origen & Historia
            </Link>
          </div>
        </nav>
      </div>

      {/* Mega-Menu Dropdown Panel */}
      {isMegaMenuOpen && (
        <div
          onMouseLeave={() => setIsMegaMenuOpen(false)}
          className="hidden lg:block absolute top-full left-0 right-0 bg-white border-b border-lino shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="max-w-7xl mx-auto p-8 grid grid-cols-12 gap-8">
            {/* Left list of 7 categories */}
            <div className="col-span-4 border-r border-lino pr-6 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tierra/70 px-3 py-1 block">
                Explorar Catálogo
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveCategoryTab(cat.id)}
                  onClick={() => setIsMegaMenuOpen(false)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-sm transition-all ${
                    activeCategoryTab === cat.id
                      ? 'bg-crema text-espresso font-bold shadow-sm'
                      : 'text-tierra hover:bg-crema-light hover:text-espresso'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {getCategoryIcon(cat.slug)}
                    <span>{cat.name}</span>
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${activeCategoryTab === cat.id ? 'text-ocre translate-x-1' : 'opacity-0'}`} />
                </button>
              ))}
            </div>

            {/* Middle: Subcategories for hovered category */}
            <div className="col-span-4 space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-espresso flex items-center gap-2">
                  {activeCategory.name}
                </h3>
                <p className="text-xs text-tierra mt-1 leading-relaxed">
                  {activeCategory.shortDesc}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-tierra/70 block mb-2">
                  Subcategorías & Regiones
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {activeCategory.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/categorias/${activeCategory.slug}?sub=${sub.slug}`}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="p-2.5 rounded-lg border border-lino/60 hover:border-ocre hover:bg-crema transition-colors text-xs font-medium text-espresso flex items-center justify-between group"
                    >
                      <span>{sub.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-tierra/40 group-hover:text-ocre group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/categorias/${activeCategory.slug}`}
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-ocre hover:text-ocre-dark"
                >
                  Ver toda la categoría {activeCategory.name} &rarr;
                </Link>
              </div>
            </div>

            {/* Right: Category Spotlight Card */}
            <div className="col-span-4 relative rounded-2xl overflow-hidden bg-espresso text-crema p-6 flex flex-col justify-end min-h-[280px]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{ backgroundImage: `url(${activeCategory.bannerImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/60 to-transparent" />
              
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ocre bg-espresso/80 px-2 py-0.5 rounded-full inline-block">
                  Destacado del Mes
                </span>
                <h4 className="font-serif text-xl font-bold text-crema">
                  {activeCategory.name}
                </h4>
                <p className="text-xs text-crema/80 line-clamp-2">
                  {activeCategory.description}
                </p>
                <Link
                  href={`/categorias/${activeCategory.slug}`}
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="inline-flex items-center gap-2 bg-ocre text-espresso font-bold text-xs px-4 py-2 rounded-full hover:bg-ocre-hover transition-colors mt-2"
                >
                  Explorar Catálogo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-crema flex flex-col shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-lino">
              <Logo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-tierra hover:bg-lino"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="my-4">
              <SearchBar onSearchSubmit={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Categories Links */}
            <div className="space-y-1 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tierra/70 block mb-2">
                Categorías de Café
              </span>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categorias/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-lino text-espresso text-sm font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    {getCategoryIcon(cat.slug)}
                    <span>{cat.name}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-tierra/50" />
                </Link>
              ))}

              <div className="pt-4 border-t border-lino mt-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-tierra/70 block mb-2">
                  Más en Monterojas
                </span>
                <Link
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 text-espresso text-sm font-medium hover:bg-lino rounded-xl"
                >
                  <BookOpen className="w-4 h-4 text-bosque" /> Guías & Blog de Café
                </Link>
                <Link
                  href="/nuestra-historia"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 text-espresso text-sm font-medium hover:bg-lino rounded-xl"
                >
                  <MapPin className="w-4 h-4 text-bosque" /> Nuestra Historia
                </Link>
                <Link
                  href="/cuenta"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 text-espresso text-sm font-medium hover:bg-lino rounded-xl"
                >
                  <User className="w-4 h-4 text-tierra" /> Mi Cuenta & Pedidos
                </Link>
              </div>
            </div>

            {/* Mobile Footer info */}
            <div className="pt-6 border-t border-lino text-xs text-tierra/80">
              <p className="font-semibold text-espresso">Monterojas Café de Colombia</p>
              <p className="mt-1">Tostado con alma de montaña en Medellín</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
