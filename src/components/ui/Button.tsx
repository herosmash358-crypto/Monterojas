'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón */
  variant?: ButtonVariant;
  /** Tamaño del botón */
  size?: ButtonSize;
  /** Muestra un spinner y deshabilita interacciones */
  loading?: boolean;
  /** Ocupa todo el ancho disponible */
  fullWidth?: boolean;
  /** Ícono renderizado antes del texto */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Estilos por variante                                              */
/* ------------------------------------------------------------------ */

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#D49A2A] text-[#2B1B12] hover:bg-[#B8821C] active:bg-[#A0710F] shadow-sm',
  secondary:
    'bg-[#2F4A36] text-white hover:bg-[#243B2B] active:bg-[#1B2D21] shadow-sm',
  outline:
    'border-2 border-[#5A3A24] text-[#5A3A24] bg-transparent hover:bg-[#5A3A24]/10 active:bg-[#5A3A24]/20',
  ghost:
    'bg-transparent text-[#5A3A24] hover:bg-[#5A3A24]/10 active:bg-[#5A3A24]/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-base rounded-lg gap-2',
  lg: 'px-7 py-3.5 text-lg rounded-xl gap-2.5',
};

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      icon,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          // Base
          'inline-flex items-center justify-center font-body font-semibold',
          'transition-all duration-200 motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A2A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EEE0]',
          'select-none whitespace-nowrap',
          // Variante y tamaño
          variantStyles[variant],
          sizeStyles[size],
          // Ancho completo
          fullWidth && 'w-full',
          // Deshabilitado
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...rest}
      >
        {/* Spinner de carga */}
        {loading && (
          <Spinner
            size="sm"
            className={cn(
              variant === 'primary' && 'text-[#2B1B12]',
              variant === 'secondary' && 'text-white',
              variant === 'outline' && 'text-[#5A3A24]',
              variant === 'ghost' && 'text-[#5A3A24]',
            )}
          />
        )}

        {/* Ícono */}
        {!loading && icon && (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Contenido */}
        {children && <span>{children}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
