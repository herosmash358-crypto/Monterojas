import React from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export type BadgeVariant = 'default' | 'success' | 'accent' | 'dark';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Variante de color */
  variant?: BadgeVariant;
  children: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Estilos por variante                                              */
/* ------------------------------------------------------------------ */

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#EADCC4] text-[#5A3A24]',
  success: 'bg-[#A9B796] text-[#2F4A36]',
  accent: 'bg-[#D49A2A] text-[#2B1B12]',
  dark: 'bg-[#2B1B12] text-[#F6EEE0]',
};

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children,
  ...rest
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5',
        'text-xs font-semibold font-body leading-none',
        'transition-colors duration-150 motion-reduce:transition-none',
        variantStyles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
