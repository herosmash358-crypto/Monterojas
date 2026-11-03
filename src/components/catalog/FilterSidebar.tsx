'use client';

import React from 'react';
import { X, RotateCcw, SlidersHorizontal, Check, Star } from 'lucide-react';
import { Category, RoastLevel, ProcessType } from '@/lib/types';

export interface FilterState {
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  roastLevel: string[];
  process: string[];
  flavorNotes: string[];
  minScore: number;
  minRating: number;
  onlyInStock: boolean;
  certifications: string[];
}

interface FilterSidebarProps {
  category?: Category;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalProductsCount: number;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
  resetAllFilters: () => void;
}

const ROAST_OPTIONS: RoastLevel[] = ['Claro', 'Medio', 'Medio-Oscuro', 'Oscuro'];
const PROCESS_OPTIONS: ProcessType[] = ['Lavado', 'Honey', 'Natural', 'Anaeróbico'];
const FLAVOR_OPTIONS = ['Panela', 'Chocolate', 'Caramelo', 'Jazmín', 'Mandarina', 'Durazno', 'Mora', 'Avellana'];
const CERTIFICATION_OPTIONS = ['Orgánico Certificado', 'Comercio Justo', 'Denominación de Origen Colombia', 'Rainforest Alliance'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  category,
  filters,
  setFilters,
  totalProductsCount,
  isMobileDrawer = false,
  onCloseMobile,
  resetAllFilters,
}) => {
  const toggleArrayItem = (key: 'roastLevel' | 'process' | 'flavorNotes' | 'certifications', item: string) => {
    setFilters((prev) => {
      const list = prev[key];
      const exists = list.includes(item);
      return {
        ...prev,
        [key]: exists ? list.filter((i) => i !== item) : [...list, item],
      };
    });
  };

  return (
    <aside className="w-full space-y-6 text-espresso text-sm">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-lino">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-tierra" />
          <h3 className="font-serif font-bold text-base text-espresso">Filtros</h3>
          <span className="text-xs bg-crema-dark px-2 py-0.5 rounded-full text-tierra font-semibold">
            {totalProductsCount}
          </span>
        </div>
        <button
          onClick={resetAllFilters}
          className="text-xs text-tierra/70 hover:text-alerta-error flex items-center gap-1 transition-colors"
          title="Restablecer todos los filtros"
        >
          <RotateCcw className="w-3 h-3" /> Limpiar todo
        </button>
      </div>

      {/* Subcategories (if in a specific category) */}
      {category && category.subcategories.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-tierra">
            Subcategoría / Origen
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, subcategory: '' }))}
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                filters.subcategory === ''
                  ? 'bg-crema-dark font-bold text-espresso'
                  : 'text-tierra hover:bg-crema'
              }`}
            >
              Todas las subcategorías
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    subcategory: prev.subcategory === sub.slug ? '' : sub.slug,
                  }))
                }
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                  filters.subcategory === sub.slug
                    ? 'bg-crema-dark font-bold text-espresso'
                    : 'text-tierra hover:bg-crema'
                }`}
              >
                <span>{sub.name}</span>
                {filters.subcategory === sub.slug && <Check className="w-3.5 h-3.5 text-ocre" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Slider */}
      <div className="space-y-2 pt-2 border-t border-lino">
        <div className="flex justify-between items-center text-xs">
          <h4 className="font-bold uppercase tracking-wider text-tierra">Precio Máximo</h4>
          <span className="font-bold text-espresso">
            ${filters.maxPrice.toLocaleString('es-CO')} COP
          </span>
        </div>
        <input
          type="range"
          min={25000}
          max={400000}
          step={5000}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-ocre cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-tierra/70">
          <span>$25.000</span>
          <span>$400.000</span>
        </div>
      </div>

      {/* Nivel de Tostión */}
      <div className="space-y-2 pt-2 border-t border-lino">
        <h4 className="text-xs font-bold uppercase tracking-wider text-tierra">
          Nivel de Tostión
        </h4>
        <div className="space-y-1.5">
          {ROAST_OPTIONS.map((roast) => {
            const isChecked = filters.roastLevel.includes(roast);
            return (
              <label
                key={roast}
                className="flex items-center gap-2.5 text-xs text-tierra hover:text-espresso cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayItem('roastLevel', roast)}
                  className="rounded text-ocre focus:ring-ocre accent-ocre w-4 h-4"
                />
                <span className={isChecked ? 'font-bold text-espresso' : ''}>Tostión {roast}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Proceso de Beneficio */}
      <div className="space-y-2 pt-2 border-t border-lino">
        <h4 className="text-xs font-bold uppercase tracking-wider text-tierra">
          Proceso de Beneficio
        </h4>
        <div className="space-y-1.5">
          {PROCESS_OPTIONS.map((proc) => {
            const isChecked = filters.process.includes(proc);
            return (
              <label
                key={proc}
                className="flex items-center gap-2.5 text-xs text-tierra hover:text-espresso cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayItem('process', proc)}
                  className="rounded text-ocre focus:ring-ocre accent-ocre w-4 h-4"
                />
                <span className={isChecked ? 'font-bold text-espresso' : ''}>{proc}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Notas de Sabor (Chips) */}
      <div className="space-y-2 pt-2 border-t border-lino">
        <h4 className="text-xs font-bold uppercase tracking-wider text-tierra">
          Notas de Sabor
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {FLAVOR_OPTIONS.map((note) => {
            const isSelected = filters.flavorNotes.includes(note);
            return (
              <button
                key={note}
                type="button"
                onClick={() => toggleArrayItem('flavorNotes', note)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-salvia text-bosque-dark border-bosque font-bold shadow-sm'
                    : 'bg-crema-light text-tierra border-lino hover:border-tierra'
                }`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

      {/* Puntaje de Cata SCAA Mínimo */}
      <div className="space-y-2 pt-2 border-t border-lino">
        <div className="flex justify-between items-center text-xs">
          <h4 className="font-bold uppercase tracking-wider text-tierra">Puntaje SCAA Mínimo</h4>
          <span className="font-bold text-espresso">
            {filters.minScore > 0 ? `${filters.minScore}+ pts` : 'Cualquiera'}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[0, 85, 87, 88].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, minScore: score }))}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                filters.minScore === score
                  ? 'bg-ocre text-espresso font-bold border-ocre'
                  : 'bg-crema-light text-tierra border-lino hover:bg-lino'
              }`}
            >
              {score === 0 ? 'Todos' : `${score}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Calificación de Reseñas */}
      <div className="space-y-2 pt-2 border-t border-lino">
        <h4 className="text-xs font-bold uppercase tracking-wider text-tierra">
          Calificación Mínima
        </h4>
        <div className="space-y-1">
          {[4.5, 4.0, 0].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, minRating: star }))}
              className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                filters.minRating === star ? 'bg-crema-dark font-bold text-espresso' : 'hover:bg-crema text-tierra'
              }`}
            >
              <div className="flex items-center gap-1">
                {star > 0 ? (
                  <>
                    <Star className="w-3.5 h-3.5 text-ocre fill-ocre" />
                    <span>{star} estrellas o más</span>
                  </>
                ) : (
                  <span>Todas las calificaciones</span>
                )}
              </div>
              {filters.minRating === star && <Check className="w-3.5 h-3.5 text-ocre" />}
            </button>
          ))}
        </div>
      </div>

      {/* Certificaciones */}
      <div className="space-y-2 pt-2 border-t border-lino">
        <h4 className="text-xs font-bold uppercase tracking-wider text-tierra">
          Certificaciones
        </h4>
        <div className="space-y-1.5">
          {CERTIFICATION_OPTIONS.map((cert) => {
            const isChecked = filters.certifications.includes(cert);
            return (
              <label
                key={cert}
                className="flex items-center gap-2.5 text-xs text-tierra hover:text-espresso cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayItem('certifications', cert)}
                  className="rounded text-ocre focus:ring-ocre accent-ocre w-4 h-4"
                />
                <span className={isChecked ? 'font-bold text-espresso' : ''}>{cert}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="pt-2 border-t border-lino">
        <label className="flex items-center gap-2.5 text-xs text-tierra hover:text-espresso cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyInStock}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, onlyInStock: e.target.checked }))
            }
            className="rounded text-ocre focus:ring-ocre accent-ocre w-4 h-4"
          />
          <span className="font-medium">Solo productos en stock disponible</span>
        </label>
      </div>

      {/* Mobile Drawer Close Button */}
      {isMobileDrawer && (
        <div className="pt-4 border-t border-lino">
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full bg-ocre text-espresso font-bold py-3 rounded-full text-center text-xs uppercase tracking-wider"
          >
            Ver {totalProductsCount} Resultados
          </button>
        </div>
      )}
    </aside>
  );
};
