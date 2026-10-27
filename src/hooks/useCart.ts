'use client';

import { useContext } from 'react';
import { CartContext, type CartContextValue } from '@/context/CartContext';

/**
 * Hook para acceder al contexto del carrito de compras.
 *
 * @throws Error si se usa fuera de `<CartProvider>`.
 * @returns Valores y acciones del carrito.
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart debe usarse dentro de un <CartProvider>. ' +
        'Asegúrate de envolver tu aplicación con <CartProvider>.',
    );
  }

  return context;
}
