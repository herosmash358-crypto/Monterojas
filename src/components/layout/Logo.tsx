'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  /** Tamaño del logo: pequeño (header), mediano o grande (hero/footer) */
  size?: 'sm' | 'md' | 'lg';
  /** Clases adicionales */
  className?: string;
}

/**
 * Logo wordmark de Monterojas.
 * Letra 'O' estilizada como detalle de grano de café / montaña.
 */
export const Logo: React.FC<LogoProps> = ({ size = 'md', className }) => {
  const sizeStyles: Record<string, string> = {
    sm: 'text-xl font-bold tracking-tight',
    md: 'text-2xl font-bold tracking-tight',
    lg: 'text-3xl md:text-4xl font-bold tracking-tight',
  };

  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 font-heading',
        'text-[#2B1B12]',
        sizeStyles[size],
        className,
      )}
      aria-label="Monterojas — Café de origen colombiano"
    >
      {/* Detalle de grano de café (montaña simplificada) */}
      <svg
        width={size === 'lg' ? 36 : size === 'md' ? 30 : 24}
        height={size === 'lg' ? 36 : size === 'md' ? 30 : 24}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16 2 C9.373 2 4 7.373 4 14 C4 18.5 8.5 22 14 22 C16.5 22 20 19.5 20 16 C20 12.5 17.5 9.5 16 9 C14.5 9.5 12 12.5 12 16 C12 19.5 15.5 22 18 22 C20.5 22 23 18.5 23 14 C23 7.373 17.627 2 16 2 Z"
          fill="#5A3A24"
        />
        <path
          d="M16 6 C12.686 6 10 8.686 10 12 C10 15.314 12.686 18 16 18 C19.314 18 22 15.314 22 12 C22 8.686 19.314 6 16 6 Z"
          fill="#D49A2A"
        />
        <path
          d="M16 10 C14.343 10 13 11.343 13 13 C13 14.657 14.343 16 16 16 C17.657 16 19 14.657 19 13 C19 11.343 17.657 10 16 10 Z"
          fill="#2B1B12"
        />
      </svg>
      <span>Monterojas</span>
    </Link>
  );
};
