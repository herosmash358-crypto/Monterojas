'use client';

import { useContext } from 'react';
import {
  WishlistContext,
  type WishlistContextValue,
} from '@/context/WishlistContext';

/**
 * Hook para acceder al contexto de la lista de deseos.
 *
 * @throws Error si se usa fuera de `<WishlistProvider>`.
 * @returns Valores y acciones de la lista de deseos.
 */
export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      'useWishlist debe usarse dentro de un <WishlistProvider>. ' +
        'Asegúrate de envolver tu aplicación con <WishlistProvider>.',
    );
  }

  return context;
}
