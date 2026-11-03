'use client';

import React, { useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/lib/types';
import { Flame } from 'lucide-react';

interface TasteAssistantProps {
  products: Product[];
}

export function TasteAssistant({ products }: TasteAssistantProps) {
  const [selectedTaste, setSelectedTaste] = useState<'balance' | 'frutal' | 'intenso' | 'microlote'>('balance');

  const getTasteRecommendedProducts = () => {
    switch (selectedTaste) {
      case 'frutal':
        return products.filter(
          (p) =>
            p.department === 'Nariño' ||
            p.flavorNotes?.some((n) => n.includes('Mandarina') || n.includes('Durazno') || n.includes('Jazmín'))
        ).slice(0, 3);
      case 'intenso':
        return products
          .filter((p) => p.roastLevel === 'Medio-Oscuro' || p.categorySlug === 'capsulas-monodosis')
          .slice(0, 3);
      case 'microlote':
        return products.filter((p) => p.categorySlug === 'cafes-especiales-microlotes').slice(0, 3);
      case 'balance':
      default:
        return products
          .filter((p) => p.department === 'Huila' || p.department === 'Antioquia')
          .slice(0, 3);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-crema-dark p-6 sm:p-10 border border-lino shadow-soft">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-bosque">
            Guía de Selección Barista
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso mt-1">
            ¿Cómo te gusta tomar tu café en las mañanas?
          </h2>
          <p className="text-xs sm:text-sm text-tierra mt-2">
            Selecciona tu inclinación sensorial predilecta y te mostraremos los lotes calibrados para tu paladar:
          </p>

          {/* Selector tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { id: 'balance', label: 'Equilibrado & Dulce (Huila / Antioquia)' },
              { id: 'frutal', label: 'Floral, Cítrico & Brillante (Nariño)' },
              { id: 'intenso', label: 'Achocolatado & Fuerte (Santander)' },
              { id: 'microlote', label: 'Exótico & Complejo (Geisha / Honey)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTaste(tab.id as any)}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                  selectedTaste === tab.id
                    ? 'bg-ocre text-espresso shadow-sm font-bold'
                    : 'bg-white text-espresso hover:bg-lino border border-lino'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {getTasteRecommendedProducts().map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
