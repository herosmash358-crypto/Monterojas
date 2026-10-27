import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export interface BreadcrumbItem {
  /** Texto visible del enlace */
  label: string;
  /** URL destino (omitir en el último elemento) */
  href?: string;
}

export interface BreadcrumbsProps {
  /** Lista de elementos del breadcrumb */
  items: BreadcrumbItem[];
  /** Clases adicionales */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Componente separador                                              */
/* ------------------------------------------------------------------ */

const Separator: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="mx-2 h-4 w-4 shrink-0 text-[#5A3A24]/40"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Componente principal                                               */
/* ------------------------------------------------------------------ */

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
}) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('font-body', className)}>
      <ol className="flex flex-wrap items-center text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {/* Separador entre elementos */}
              {index > 0 && <Separator />}

              {isLast || !item.href ? (
                // Elemento actual (último) – no es un enlace
                <span
                  aria-current="page"
                  className="font-medium text-[#2B1B12]"
                >
                  {item.label}
                </span>
              ) : (
                // Enlace navegable
                <Link
                  href={item.href}
                  className={cn(
                    'text-[#5A3A24]/70 hover:text-[#5A3A24]',
                    'underline-offset-2 hover:underline',
                    'transition-colors duration-150 motion-reduce:transition-none',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A2A] focus-visible:rounded-sm',
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.displayName = 'Breadcrumbs';
