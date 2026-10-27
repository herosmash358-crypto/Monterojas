'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Etiqueta visible del campo */
  label?: string;
  /** Opciones del desplegable */
  options: SelectOption[];
  /** Texto placeholder (opción deshabilitada inicial) */
  placeholder?: string;
  /** Texto de ayuda debajo del campo */
  helperText?: string;
  /** Mensaje de error – activa el estado de error */
  error?: string;
}

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder,
      helperText,
      error,
      className,
      id: externalId,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const selectId = externalId || autoId;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const hasError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1.5 font-body', className)}>
        {/* Etiqueta */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'text-sm font-medium text-[#5A3A24]',
              disabled && 'opacity-50',
            )}
          >
            {label}
          </label>
        )}

        {/* Contenedor con flecha personalizada */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={
              [errorId, helperId].filter(Boolean).join(' ') || undefined
            }
            className={cn(
              // Base
              'w-full appearance-none rounded-lg border bg-[#F6EEE0] px-4 py-2.5 pr-10',
              'text-[#2B1B12] font-body text-base',
              'transition-colors duration-200 motion-reduce:transition-none',
              // Focus
              'focus:outline-none focus:ring-2 focus:ring-[#D49A2A] focus:ring-offset-1 focus:ring-offset-[#F6EEE0]',
              // Normal border
              !hasError && 'border-[#5A3A24]/30 hover:border-[#5A3A24]/60',
              // Error border
              hasError && 'border-[#A63D2F] ring-1 ring-[#A63D2F]/30',
              // Disabled
              disabled && 'opacity-50 cursor-not-allowed',
            )}
            {...rest}
          >
            {/* Placeholder */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Opciones */}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Flecha desplegable */}
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#5A3A24]/60"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        {/* Mensaje de error */}
        {hasError && (
          <p id={errorId} role="alert" className="text-sm text-[#A63D2F]">
            {error}
          </p>
        )}

        {/* Texto de ayuda */}
        {!hasError && helperText && (
          <p id={helperId} className="text-sm text-[#5A3A24]/60">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
