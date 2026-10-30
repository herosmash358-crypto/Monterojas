'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export interface ModalProps {
  /** Controla la visibilidad del modal */
  open: boolean;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Título del encabezado */
  title?: string;
  /** Contenido principal */
  children: React.ReactNode;
  /** Contenido opcional del pie */
  footer?: React.ReactNode;
  /** Clases adicionales del panel */
  className?: string;
  /** Tamaño máximo del panel */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/* ------------------------------------------------------------------ */
/*  Tamaños                                                           */
/* ------------------------------------------------------------------ */

const sizeStyles: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  size = 'md',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  /* ---- Trampa de foco ---- */
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  /* ---- Escape para cerrar ---- */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  /* ---- Abrir / cerrar ---- */
  useEffect(() => {
    if (!open) return;

    // Guardar el elemento con foco actual
    previouslyFocused.current = document.activeElement as HTMLElement;

    // Prevenir scroll del body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Enfocar el panel
    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    // Listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', trapFocus);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', trapFocus);

      // Restaurar foco previo
      previouslyFocused.current?.focus();
    };
  }, [open, handleKeyDown, trapFocus]);

  /* ---- Click fuera del panel ---- */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  /* ---- No renderizar si está cerrado ---- */
  if (!open) return null;

  /* ---- Portal ---- */
  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-[#2B1B12]/60 backdrop-blur-sm',
        // Animación de entrada
        'animate-in fade-in duration-200 motion-reduce:animate-none',
      )}
      aria-hidden={!open}
    >
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Diálogo'}
        tabIndex={-1}
        className={cn(
          'w-full rounded-xl bg-[#F6EEE0] shadow-2xl shadow-[#2B1B12]/20',
          'flex flex-col max-h-[90vh]',
          'animate-in zoom-in-95 duration-200 motion-reduce:animate-none',
          'focus:outline-none',
          sizeStyles[size],
          className,
        )}
      >
        {/* Encabezado */}
        {title && (
          <div className="flex items-center justify-between border-b border-[#5A3A24]/15 px-5 py-4">
            <h2 className="font-heading text-xl font-bold text-[#5A3A24]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar diálogo"
              className={cn(
                'rounded-lg p-1.5 text-[#5A3A24]/60',
                'hover:bg-[#5A3A24]/10 hover:text-[#5A3A24]',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A2A]',
              )}
            >
              {/* Ícono de cerrar (X) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Sin título pero con botón de cerrar */}
        {!title && (
          <div className="flex justify-end px-5 pt-4">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar diálogo"
              className={cn(
                'rounded-lg p-1.5 text-[#5A3A24]/60',
                'hover:bg-[#5A3A24]/10 hover:text-[#5A3A24]',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A2A]',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto px-5 py-4 font-body text-[#2B1B12]">
          {children}
        </div>

        {/* Pie */}
        {footer && (
          <div className="border-t border-[#5A3A24]/15 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

Modal.displayName = 'Modal';
