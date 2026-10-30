'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export interface SliderProps {
  /** Valor mínimo del rango */
  min: number;
  /** Valor máximo del rango */
  max: number;
  /** Valor actual del rango [mínimo seleccionado, máximo seleccionado] */
  value: [number, number];
  /** Callback al cambiar el rango */
  onChange: (value: [number, number]) => void;
  /** Incremento por paso */
  step?: number;
  /** Función para formatear la etiqueta de valor (p.ej. COP) */
  formatLabel?: (value: number) => string;
  /** Clases adicionales */
  className?: string;
  /** Etiqueta accesible */
  ariaLabel?: string;
}

/* ------------------------------------------------------------------ */
/*  Formateador por defecto (pesos colombianos)                        */
/* ------------------------------------------------------------------ */

const defaultFormat = (value: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1000,
  formatLabel = defaultFormat,
  className,
  ariaLabel = 'Rango de precios',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);

  // Valores internos sincronizados
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  // Sincronizar prop → estado local
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /** Convierte una posición X del mouse/touch a un valor del slider */
  const positionToValue = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + percent * (max - min);
      // Redondear al step más cercano
      return Math.round(raw / step) * step;
    },
    [min, max, step],
  );

  /** Actualiza el valor mientras se arrastra */
  const handleMove = useCallback(
    (clientX: number) => {
      if (!dragging) return;

      const newVal = positionToValue(clientX);
      setLocalValue((prev) => {
        if (dragging === 'min') {
          const clamped = Math.min(newVal, prev[1] - step);
          return [Math.max(min, clamped), prev[1]];
        } else {
          const clamped = Math.max(newVal, prev[0] + step);
          return [prev[0], Math.min(max, clamped)];
        }
      });
    },
    [dragging, positionToValue, min, max, step],
  );

  /** Finaliza el arrastre y notifica al padre */
  const handleEnd = useCallback(() => {
    if (dragging) {
      setDragging(null);
      onChange(localValue);
    }
  }, [dragging, localValue, onChange]);

  /* ---- Listeners globales de mouse/touch ---- */
  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onUp = () => handleEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, handleMove, handleEnd]);

  /* ---- Porcentajes para posición visual ---- */
  const range = max - min || 1;
  const minPercent = ((localValue[0] - min) / range) * 100;
  const maxPercent = ((localValue[1] - min) / range) * 100;

  /** Manejo de teclado para accesibilidad */
  const handleKeyDown = (
    handle: 'min' | 'max',
    e: React.KeyboardEvent,
  ) => {
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
    else if (e.key === 'Home') {
      delta = handle === 'min' ? min - localValue[0] : localValue[0] + step - localValue[1];
    } else if (e.key === 'End') {
      delta = handle === 'max' ? max - localValue[1] : localValue[1] - step - localValue[0];
    } else return;

    e.preventDefault();

    setLocalValue((prev) => {
      let next: [number, number];
      if (handle === 'min') {
        const newMin = Math.max(min, Math.min(prev[1] - step, prev[0] + delta));
        next = [newMin, prev[1]];
      } else {
        const newMax = Math.min(max, Math.max(prev[0] + step, prev[1] + delta));
        next = [prev[0], newMax];
      }
      onChange(next);
      return next;
    });
  };

  return (
    <div
      className={cn('flex flex-col gap-3 font-body', className)}
      aria-label={ariaLabel}
    >
      {/* Etiquetas de valores seleccionados */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[#2B1B12]">
          {formatLabel(localValue[0])}
        </span>
        <span className="text-[#5A3A24]/50">—</span>
        <span className="font-semibold text-[#2B1B12]">
          {formatLabel(localValue[1])}
        </span>
      </div>

      {/* Pista del slider */}
      <div
        ref={trackRef}
        className="relative h-2 w-full cursor-pointer rounded-full bg-[#EADCC4]"
        onMouseDown={(e) => {
          // Determinar qué handle está más cerca
          const clickVal = positionToValue(e.clientX);
          const distMin = Math.abs(clickVal - localValue[0]);
          const distMax = Math.abs(clickVal - localValue[1]);
          setDragging(distMin <= distMax ? 'min' : 'max');
        }}
      >
        {/* Rango activo */}
        <div
          className="absolute top-0 h-full rounded-full bg-[#D49A2A]"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Handle mínimo */}
        <button
          type="button"
          role="slider"
          aria-label="Precio mínimo"
          aria-valuemin={min}
          aria-valuemax={localValue[1] - step}
          aria-valuenow={localValue[0]}
          aria-valuetext={formatLabel(localValue[0])}
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown('min', e)}
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging('min');
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setDragging('min');
          }}
          className={cn(
            'absolute top-1/2 -translate-x-1/2 -translate-y-1/2',
            'h-5 w-5 rounded-full border-2 border-[#D49A2A] bg-[#F6EEE0]',
            'shadow-md cursor-grab active:cursor-grabbing',
            'transition-shadow duration-150 motion-reduce:transition-none',
            'hover:shadow-lg hover:shadow-[#D49A2A]/30',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A2A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EEE0]',
          )}
          style={{ left: `${minPercent}%` }}
        />

        {/* Handle máximo */}
        <button
          type="button"
          role="slider"
          aria-label="Precio máximo"
          aria-valuemin={localValue[0] + step}
          aria-valuemax={max}
          aria-valuenow={localValue[1]}
          aria-valuetext={formatLabel(localValue[1])}
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown('max', e)}
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging('max');
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setDragging('max');
          }}
          className={cn(
            'absolute top-1/2 -translate-x-1/2 -translate-y-1/2',
            'h-5 w-5 rounded-full border-2 border-[#D49A2A] bg-[#F6EEE0]',
            'shadow-md cursor-grab active:cursor-grabbing',
            'transition-shadow duration-150 motion-reduce:transition-none',
            'hover:shadow-lg hover:shadow-[#D49A2A]/30',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A2A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EEE0]',
          )}
          style={{ left: `${maxPercent}%` }}
        />
      </div>

      {/* Etiquetas min/max del rango total */}
      <div className="flex items-center justify-between text-xs text-[#5A3A24]/50">
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>
    </div>
  );
};

Slider.displayName = 'Slider';
