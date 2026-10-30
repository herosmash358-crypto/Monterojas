'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star, Sparkles, Award } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const isFav = wishlist.includes(product.id);

  const defaultVariant = product.variants[0];
  const defaultGrind = product.availableGrinds[0] || 'En grano';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultVariant.weight, defaultGrind, 1);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-craft border border-lino hover:border-tierra/40 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Media Container */}
      <Link href={`/producto/${product.slug}`} className="relative block aspect-square bg-crema overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="bg-bosque text-crema text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-ocre" /> Más Vendido
            </span>
          )}
          {product.isNew && (
            <span className="bg-ocre text-espresso text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Cosecha Nueva
            </span>
          )}
          {product.cuppingScore && product.cuppingScore >= 87 && (
            <span className="bg-espresso/90 text-ocre text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm flex items-center gap-1">
              <Award className="w-3 h-3" /> {product.cuppingScore} pts SCAA
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleFav}
          aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFav
              ? 'bg-alerta-error text-white scale-110 shadow-md'
              : 'bg-white/80 text-espresso/70 hover:bg-white hover:text-alerta-error shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Origin / Department Pill Bottom Left */}
        {product.department && (
          <div className="absolute bottom-3 left-3 z-10 bg-crema-light/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-tierra border border-lino shadow-sm">
            📍 {product.department}
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Roast */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-ocre font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-tierra/60 font-normal">({product.reviewCount})</span>
            </div>

            {product.roastLevel && (
              <span className="text-[11px] font-medium text-tierra bg-crema px-2 py-0.5 rounded-full">
                Tostión {product.roastLevel}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/producto/${product.slug}`} className="block group-hover:text-ocre transition-colors">
            <h3 className="font-serif font-bold text-base text-espresso line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-tierra/80 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>

          {/* Flavor Notes Chips */}
          {(product.flavorNotes?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {product.flavorNotes!.slice(0, 3).map((note, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-crema-light text-tierra border border-lino/60"
                >
                  {note}
                </span>
              ))}
              {product.flavorNotes!.length > 3 && (
                <span className="text-[10px] text-tierra/60 self-center">
                  +{product.flavorNotes!.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 mt-3 border-t border-lino flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-tierra/70 uppercase block font-semibold">
              Desde ({defaultVariant.weight})
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-bold text-espresso">
                ${product.price.toLocaleString('es-CO')}
              </span>
              <span className="text-[10px] text-tierra font-semibold">COP</span>
              {product.originalPrice && (
                <span className="text-xs text-tierra/50 line-through">
                  ${product.originalPrice.toLocaleString('es-CO')}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add Ocre Button */}
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 bg-ocre hover:bg-ocre-hover text-espresso text-xs font-bold px-3.5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
