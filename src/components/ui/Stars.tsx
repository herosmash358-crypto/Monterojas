'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export type StarsSize = 'sm' | 'md' | 'lg';

export interface StarsProps {
  /** Calificación actual (0–5, soporta decimales p.ej. 3.5) */
  rating: number;
  /** Tamaño de las estrellas */
  size?: StarsSize;
  /** Habilita clic para seleccionar calificación */
  interactive?: boolean;
  /** Callback al seleccionar una calificación (solo si interactive=true) */
  onChange?: (rating: number) => void;
  /** Número total de estrellas */
  count?: number;
  /** Clases adicionales */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Tamaños de estrellas                                              */
/* ------------------------------------------------------------------ */

const sizeMap: Record<StarsSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
};

/* ------------------------------------------------------------------ */
/*  SVG estrella individual                                            */
/* ------------------------------------------------------------------ */

interface StarIconProps {
  /** 'full' | 'half' | 'empty' */
  fill: 'full' | 'half' | 'empty';
  size: StarsSize;
  className?: string;
}

const StarIcon: React.FC<StarIconProps> = ({ fill, size, className }) => {
  const id = React.useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn(sizeMap[size], className)}
      aria-hidden="true"
    >
      {fill === 'half' && (
        <defs>
          <linearGradient id={`half-${id}`}>
            <stop offset="50%" stopColor="#D49A2A" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={
          fill === 'full'
            ? '#D49A2A'
            : fill === 'half'
              ? `url(#half-${id})`
              : 'transparent'
        }
        stroke="#D49A2A"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  Componente principal                                               */
/* ------------------------------------------------------------------ */

export const Stars: React.FC<StarsProps> = ({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  count = 5,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating ?? rating;

  /** Determina el estado de relleno de cada estrella */
  const getFill = useCallback(
    (index: number): 'full' | 'half' | 'empty' => {
      const starNumber = index + 1;
      if (displayRating >= starNumber) return 'full';
      if (displayRating >= starNumber - 0.5) return 'half';
      return 'empty';
    },
    [displayRating],
  );

  /** Texto accesible */
  const ariaLabel = `Calificación: ${rating} de ${count} estrellas`;

  /* ---- Modo solo lectura ---- */
  if (!interactive) {
    return (
      <div
        role="img"
        aria-label={ariaLabel}
        className={cn('inline-flex items-center gap-0.5', className)}
      >
        {Array.from({ length: count }, (_, i) => (
          <StarIcon key={i} fill={getFill(i)} size={size} />
        ))}
      </div>
    );
  }

  /* ---- Modo interactivo ---- */
  return (
    <div
      role="radiogroup"
      aria-label="Seleccionar calificación"
      className={cn('inline-flex items-center gap-0.5', className)}
      onMouseLeave={() => setHoverRating(null)}
    >
      {Array.from({ length: count }, (_, i) => {
        const value = i + 1;
        const isSelected = rating === value;

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${value} estrella${value > 1 ? 's' : ''}`}
            onClick={() => onChange?.(value)}
            onMouseEnter={() => setHoverRating(value)}
            className={cn(
              'cursor-pointer rounded-sm p-0.5',
              'transition-transform duration-150 motion-reduce:transition-none',
              'hover:scale-110',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A2A] focus-visible:ring-offset-1',
            )}
          >
            <StarIcon fill={getFill(i)} size={size} />
          </button>
        );
      })}
    </div>
  );
};

Stars.displayName = 'Stars';
