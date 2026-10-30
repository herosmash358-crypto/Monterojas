'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PRODUCTS } from '@/lib/data/products';
import { ProductCard } from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/" className="hover:text-espresso">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <Link href="/cuenta" className="hover:text-espresso">
          Mi Cuenta
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Lista de Deseos</span>
      </nav>

      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-alerta-error fill-current" /> Mis Cafés Favoritos
        </h1>
        <p className="text-xs text-tierra mt-1">
          {wishlistedProducts.length} cafés y accesorios guardados para tu próxima compra.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-lino shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-full bg-crema-dark mx-auto flex items-center justify-center text-tierra">
            <Heart className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="font-serif text-xl font-bold text-espresso">
            Aún no has agregado cafés a tus favoritos
          </h3>
          <p className="text-xs text-tierra max-w-sm mx-auto">
            Haz clic en el corazón de cualquier tarjeta de producto para guardarlo en tu lista.
          </p>
          <Link
            href="/categorias/cafe-en-grano"
            className="inline-flex items-center gap-2 bg-ocre text-espresso font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-ocre-hover"
          >
            Explorar Tienda <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
