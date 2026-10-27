'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Etiqueta visible del campo */
  label?: string;
  /** Texto de ayuda debajo del campo */
  helperText?: string;
  /** Mensaje de error – activa el estado de error */
  error?: string;
  /** Tipo de input */
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  /** Ícono al inicio del campo */
  startIcon?: React.ReactNode;
  /** Ícono al final del campo */
  endIcon?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      type = 'text',
      startIcon,
      endIcon,
      className,
      id: externalId,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = externalId || autoId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const hasError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1.5 font-body', className)}>
        {/* Etiqueta */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-[#5A3A24]',
              disabled && 'opacity-50',
            )}
          >
            {label}
          </label>
        )}

        {/* Contenedor del input */}
        <div className="relative">
          {/* Ícono inicio */}
          {startIcon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A3A24]/60"
              aria-hidden="true"
            >
              {startIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={
              [errorId, helperId].filter(Boolean).join(' ') || undefined
            }
            className={cn(
              // Base
              'w-full rounded-lg border bg-[#F6EEE0] px-4 py-2.5 text-[#2B1B12] font-body text-base',
              'placeholder:text-[#5A3A24]/40',
              'transition-colors duration-200 motion-reduce:transition-none',
              // Focus
              'focus:outline-none focus:ring-2 focus:ring-[#D49A2A] focus:ring-offset-1 focus:ring-offset-[#F6EEE0]',
              // Normal border
              !hasError && 'border-[#5A3A24]/30 hover:border-[#5A3A24]/60',
              // Error border
              hasError && 'border-[#A63D2F] ring-1 ring-[#A63D2F]/30',
              // Disabled
              disabled && 'opacity-50 cursor-not-allowed',
              // Padding para íconos
              startIcon && 'pl-10',
              endIcon && 'pr-10',
            )}
            {...rest}
          />

          {/* Ícono final */}
          {endIcon && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A3A24]/60"
              aria-hidden="true"
            >
              {endIcon}
            </span>
          )}
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

Input.displayName = 'Input';
