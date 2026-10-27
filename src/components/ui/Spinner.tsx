import React from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /** Tamaño del spinner */
  size?: SpinnerSize;
  /** Clases adicionales */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Tamaños                                                           */
/* ------------------------------------------------------------------ */

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
}) => {
  return (
    <span role="status" className={cn('inline-flex items-center justify-center', className)}>
      <span
        className={cn(
          'animate-spin rounded-full',
          'border-[#D49A2A] border-t-transparent',
          'motion-reduce:animate-[spin_1.5s_linear_infinite]',
          sizeStyles[size],
        )}
      />
      <span className="sr-only">Cargando…</span>
    </span>
  );
};

Spinner.displayName = 'Spinner';
