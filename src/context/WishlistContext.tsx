'use client';

import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export interface WishlistState {
  /** IDs de productos en la lista de deseos */
  items: string[];
}

type WishlistAction =
  | { type: 'TOGGLE_WISHLIST'; payload: { productId: string } }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'HYDRATE'; payload: WishlistState };

export interface WishlistContextValue extends WishlistState {
  /** Agrega o quita un producto de la lista de deseos */
  toggleWishlist: (productId: string) => void;
  /** Limpia toda la lista de deseos */
  clearWishlist: () => void;
  /** Verifica si un producto está en la lista */
  isInWishlist: (productId: string) => boolean;
  /** Cantidad de productos en la lista */
  count: number;
}

/* ------------------------------------------------------------------ */
/*  Contexto                                                           */
/* ------------------------------------------------------------------ */

export const WishlistContext = createContext<WishlistContextValue | null>(null);
WishlistContext.displayName = 'WishlistContext';

/* ------------------------------------------------------------------ */
/*  Constantes                                                         */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'monterojas_wishlist';

const initialState: WishlistState = {
  items: [],
};

/* ------------------------------------------------------------------ */
/*  Reducer                                                            */
/* ------------------------------------------------------------------ */

function wishlistReducer(
  state: WishlistState,
  action: WishlistAction,
): WishlistState {
  switch (action.type) {
    case 'TOGGLE_WISHLIST': {
      const { productId } = action.payload;
      const exists = state.items.includes(productId);
      return {
        ...state,
        items: exists
          ? state.items.filter((id) => id !== productId)
          : [...state.items, productId],
      };
    }

    case 'CLEAR_WISHLIST':
      return { ...initialState };

    case 'HYDRATE':
      return action.payload;

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  /* ---- Hidratar desde localStorage al montar ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WishlistState;
        dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch {
      // localStorage no disponible o datos corruptos
    }
  }, []);

  /* ---- Persistir cambios en localStorage ---- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage no disponible
    }
  }, [state]);

  /* ---- Acciones memoizadas ---- */
  const toggleWishlist = useCallback(
    (productId: string) =>
      dispatch({ type: 'TOGGLE_WISHLIST', payload: { productId } }),
    [],
  );

  const clearWishlist = useCallback(
    () => dispatch({ type: 'CLEAR_WISHLIST' }),
    [],
  );

  const isInWishlist = useCallback(
    (productId: string) => state.items.includes(productId),
    [state.items],
  );

  const value: WishlistContextValue = {
    ...state,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    count: state.items.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
