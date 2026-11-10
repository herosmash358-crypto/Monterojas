'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  Check,
  ChevronDown,
  Truck,
  Leaf,
  Flame,
  Award,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Product, WeightOption, GrindType } from '@/lib/types';
import { CATEGORIES } from '@/lib/data/categories';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/product/StarRating';
import { FlavorProfileWidget } from '@/components/product/FlavorBar';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const GRIND_HELP: Record<string, string> = {
  'En grano': 'Grano entero, muélalo justo antes de preparar.',
  'Gruesa (Prensa francesa)': 'Para Prensa Francesa y métodos de inmersión.',
  'Media (V60 / Filtro)': 'Para V60, Chemex, Cafetera de goteo y Kalita.',
  'Fina (Espresso / Moka)': 'Para máquinas espresso y cafetera Moka italiana.',
};

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const isFav = wishlist.includes(product.id);

  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(product.variants[0].weight);
  const [selectedGrind, setSelectedGrind] = useState<GrindType>(product.availableGrinds[0] || 'En grano');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showGrindHelp, setShowGrindHelp] = useState(false);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.weight === selectedWeight) || product.variants[0],
    [product.variants, selectedWeight]
  );

  const isCoffee = product.categorySlug !== 'accesorios-y-metodos' && product.categorySlug !== 'kits-y-regalos';
  const categoryName = CATEGORIES.find((c) => c.slug === product.categorySlug)?.name || product.categorySlug;

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, selectedGrind, quantity);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
      {/* ============================ GALLERY ============================ */}
      <div className="space-y-4">
        <div className="relative aspect-video sm:aspect-square rounded-craft overflow-hidden bg-crema border border-lino shadow-card">
          <Image
            src={product.images[activeImage]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isBestseller && (
              <span className="bg-bosque text-crema text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-ocre" /> Más Vendido
              </span>
            )}
            {product.isNew && (
              <span className="bg-ocre text-espresso text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                Cosecha Nueva
              </span>
            )}
            {product.cuppingScore && (
              <span className="bg-espresso/90 text-ocre text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <Award className="w-3 h-3" /> {product.cuppingScore.toFixed(1)} pts SCAA
              </span>
            )}
          </div>
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            className={cn(
              'absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all',
              isFav
                ? 'bg-alerta-error text-white shadow-md'
                : 'bg-white/85 text-espresso/70 hover:bg-white hover:text-alerta-error shadow-sm'
            )}
          >
            <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
          </button>
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'relative w-12 h-12 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all',
                  activeImage === i ? 'border-ocre shadow-sm' : 'border-lino opacity-70 hover:opacity-100'
                )}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <Image src={img} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ============================ INFO ============================ */}
      <div className="space-y-6">
        {/* Category + rating */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Link
              href={`/categorias/${product.categorySlug}`}
              className="text-ocre-dark font-bold uppercase tracking-wider hover:text-ocre transition-colors"
            >
              {categoryName}
            </Link>
            {product.cuppingScore && product.cuppingScore >= 87 && (
              <Badge variant="accent">Edición Especial</Badge>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso leading-tight">
            {product.name}
          </h1>
          <p className="text-tierra text-sm italic">{product.tagline}</p>

          <div className="flex items-center gap-3 pt-1">
            <StarRating rating={product.rating} />
            <span className="text-sm font-bold text-espresso">{product.rating.toFixed(1)}</span>
            <a href="#resenas" className="text-xs text-tierra hover:text-ocre underline underline-offset-2">
              {product.reviewCount} reseñas verificadas
            </a>
          </div>
        </div>

        {/* Origin pills (coffee only) */}
        {isCoffee && (product.origin || product.department) && (
          <div className="flex flex-wrap gap-2">
            {product.origin && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-tierra bg-crema-light border border-lino px-3 py-1.5 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-bosque" /> {product.origin}
              </span>
            )}
            {product.altitude && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-tierra bg-crema-light border border-lino px-3 py-1.5 rounded-full">
                <Flame className="w-3.5 h-3.5 text-ocre-dark" /> {product.altitude}
              </span>
            )}
            {product.variety && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-tierra bg-crema-light border border-lino px-3 py-1.5 rounded-full">
                <Leaf className="w-3.5 h-3.5 text-bosque" /> {product.variety}
              </span>
            )}
          </div>
        )}

        {/* Flavor notes (coffee only) */}
        {(product.flavorNotes?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-tierra/70">
              Notas de cata
            </span>
            <div className="flex flex-wrap gap-2">
              {product.flavorNotes!.map((note, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-crema-light text-tierra border border-lino"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 border-y border-lino py-4">
          <span className="font-serif text-3xl font-bold text-espresso">
            ${selectedVariant.price.toLocaleString('es-CO')}
          </span>
          <span className="text-xs text-tierra font-semibold">COP</span>
          {product.originalPrice && (
            <span className="text-sm text-tierra/50 line-through">
              ${product.originalPrice.toLocaleString('es-CO')}
            </span>
          )}
          {product.originalPrice && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-alerta-error/10 text-alerta-error px-2 py-0.5 rounded-full">
              Ahorra {Math.round((1 - selectedVariant.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Weight / variant selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-tierra/70">
              Presentación
            </span>
            <span className="text-[11px] text-tierra/70">
              SKU: {selectedVariant.sku}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedWeight(v.weight)}
                className={cn(
                  'p-3 rounded-xl border-2 text-left transition-all',
                  selectedWeight === v.weight
                    ? 'border-ocre bg-crema shadow-sm'
                    : 'border-lino hover:border-tierra/40 bg-white'
                )}
              >
                <span className="block text-xs font-bold text-espresso">{v.weight}</span>
                <span className="block text-xs text-tierra mt-0.5">
                  ${v.price.toLocaleString('es-CO')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grind selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-tierra/70">
              Molienda
            </span>
            <button
              onClick={() => setShowGrindHelp(!showGrindHelp)}
              className="text-[11px] text-ocre-dark font-semibold hover:text-ocre underline underline-offset-2"
            >
              ¿Cuál elegir?
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.availableGrinds.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrind(g)}
                className={cn(
                  'p-3 rounded-xl border-2 text-left text-xs transition-all flex items-center justify-between',
                  selectedGrind === g
                    ? 'border-ocre bg-crema shadow-sm font-bold text-espresso'
                    : 'border-lino hover:border-tierra/40 bg-white text-tierra'
                )}
              >
                <span>{g}</span>
                {selectedGrind === g && <Check className="w-3.5 h-3.5 text-ocre-dark" />}
              </button>
            ))}
          </div>
          {showGrindHelp && (
            <p className="text-[11px] text-tierra bg-crema-light border border-lino rounded-lg px-3 py-2 mt-1">
              {GRIND_HELP[selectedGrind]}
            </p>
          )}
        </div>

        {/* Quantity + Add to cart */}
        <div className="flex items-stretch gap-3">
          <div className="flex items-center border-2 border-lino rounded-xl bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 h-full py-2 text-tierra hover:text-espresso transition-colors"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="w-10 text-center font-bold text-espresso">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="px-4 h-full py-2 text-tierra hover:text-espresso transition-colors"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={selectedVariant.stock < 1}
          >
            <ShoppingBag className="w-5 h-5" />
            {selectedVariant.stock < 1 ? 'Agotado' : 'Agregar al Carrito'}
          </Button>
        </div>

        {/* Shipping & stock */}
        <div className="space-y-2 text-xs text-tierra">
          <p className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-bosque" />
            Envío gratis desde $90.000 · Llega en 1-3 días hábiles a toda Colombia
          </p>
          <p className="flex items-center gap-2">
            <Check className="w-4 h-4 text-alerta-exito" />
            {selectedVariant.stock > 0
              ? `Stock disponible: ${selectedVariant.stock} unidades`
              : 'Temporalmente agotado'}
          </p>
        </div>

        {/* Sensory profile (from data, always present) */}
        <FlavorProfileWidget profile={product.profile} />

        {/* Certifications */}
        {product.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.certifications.map((cert, i) => (
              <span
                key={i}
                className="text-[11px] font-medium text-bosque bg-salvia/30 border border-salvia/60 px-3 py-1.5 rounded-full"
              >
                ✓ {cert}
              </span>
            ))}
          </div>
        )}

        {/* Description + story */}
        <div className="space-y-3 pt-2">
          <h2 className="font-serif text-lg font-bold text-espresso">Sobre este café</h2>
          <p className="text-sm text-tierra leading-relaxed">{product.description}</p>
          <p className="text-sm text-tierra/80 leading-relaxed italic border-l-4 border-ocre pl-4">
            {product.story}
          </p>
        </div>

        {/* Specs table (coffee only) */}
        {isCoffee && (product.process || product.roastLevel || product.cuppingScore) && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border border-lino rounded-2xl p-4 bg-white">
            {product.process && (
              <>
                <dt className="text-tierra/70 font-medium">Proceso</dt>
                <dd className="text-espresso font-semibold text-right">{product.process}</dd>
              </>
            )}
            {product.roastLevel && (
              <>
                <dt className="text-tierra/70 font-medium">Nivel de tostión</dt>
                <dd className="text-espresso font-semibold text-right">{product.roastLevel}</dd>
              </>
            )}
            {product.farm && (
              <>
                <dt className="text-tierra/70 font-medium">Finca</dt>
                <dd className="text-espresso font-semibold text-right">{product.farm}</dd>
              </>
            )}
            {product.cuppingScore && (
              <>
                <dt className="text-tierra/70 font-medium">Puntaje de cata</dt>
                <dd className="text-espresso font-semibold text-right">{product.cuppingScore.toFixed(1)} / 100</dd>
              </>
            )}
            {product.brewMethodRecommended && (
              <>
                <dt className="text-tierra/70 font-medium">Método recomendado</dt>
                <dd className="text-espresso font-semibold text-right">{product.brewMethodRecommended}</dd>
              </>
            )}
          </dl>
        )}

        {/* FAQ accordion */}
        {product.faqs.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-espresso">Preguntas frecuentes</h2>
            {product.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-lino rounded-xl bg-white overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none p-4 text-sm font-semibold text-espresso hover:bg-crema-light/60 transition-colors">
                  {faq.question}
                  <ChevronDown className="w-4 h-4 text-tierra transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-4 pb-4 text-sm text-tierra leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
