'use client';

import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

/** Elemento individual en el carrito */
export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  /** Precio antes de descuento (si aplica) */
  compareAtPrice?: number;
  image: string;
  quantity: number;
  /** Peso del café en gramos (para calcular envío) */
  grind?: string;
  variant?: string;
}

/** Estado global del carrito */
export interface CartState {
  items: CartItem[];
  /** Controla la visibilidad del mini-carrito lateral */
  isOpen: boolean;
  couponCode: string | null;
  /** Porcentaje de descuento del cupón (0-100) */
  couponDiscount: number;
}

/* ------------------------------------------------------------------ */
/*  Acciones del reducer                                               */
/* ------------------------------------------------------------------ */

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'HYDRATE'; payload: CartState };

/* ------------------------------------------------------------------ */
/*  Valores calculados                                                 */
/* ------------------------------------------------------------------ */

export interface CartCalculations {
  /** Suma de (precio × cantidad) de cada artículo */
  subtotal: number;
  /** Costo de envío (0 si supera el umbral) */
  shipping: number;
  /** Monto descontado por cupón */
  discount: number;
  /** Total final = subtotal + shipping - discount */
  total: number;
  /** Número total de productos en el carrito */
  itemCount: number;
  /** true si el envío es gratuito */
  isFreeShipping: boolean;
  /** Cantidad faltante para envío gratis (0 si ya aplica) */
  amountUntilFreeShipping: number;
}

/* ------------------------------------------------------------------ */
/*  Interfaz del contexto                                              */
/* ------------------------------------------------------------------ */

export interface CartContextValue extends CartState, CartCalculations {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

/* ------------------------------------------------------------------ */
/*  Contexto                                                           */
/* ------------------------------------------------------------------ */

export const CartContext = createContext<CartContextValue | null>(null);
CartContext.displayName = 'CartContext';

/* ------------------------------------------------------------------ */
/*  Constantes                                                         */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'monterojas_cart';
const SHIPPING_COST = 12_000; // COP

const initialState: CartState = {
  items: [],
  isOpen: false,
  couponCode: null,
  couponDiscount: 0,
};

/* ------------------------------------------------------------------ */
/*  Reducer                                                            */
/* ------------------------------------------------------------------ */

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i,
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i,
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...initialState };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen,
      };

    case 'APPLY_COUPON':
      return {
        ...state,
        couponCode: action.payload.code,
        couponDiscount: action.payload.discount,
      };

    case 'REMOVE_COUPON':
      return { ...state, couponCode: null, couponDiscount: 0 };

    case 'HYDRATE':
      return { ...action.payload, isOpen: false };

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Funciones de cálculo                                               */
/* ------------------------------------------------------------------ */

function calculateCart(state: CartState): CartCalculations {
  const subtotal = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const discount = state.couponDiscount
    ? Math.round(subtotal * (state.couponDiscount / 100))
    : 0;

  const total = Math.max(0, subtotal + shipping - discount);
  const itemCount = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const amountUntilFreeShipping = isFreeShipping
    ? 0
    : FREE_SHIPPING_THRESHOLD - subtotal;

  return {
    subtotal,
    shipping,
    discount,
    total,
    itemCount,
    isFreeShipping,
    amountUntilFreeShipping,
  };
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /* ---- Hidratar desde localStorage al montar ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
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
  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }),
    [],
  );

  const removeItem = useCallback(
    (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
    [],
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    [],
  );

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const toggleCart = useCallback(
    (open?: boolean) => dispatch({ type: 'TOGGLE_CART', payload: open }),
    [],
  );

  const applyCoupon = useCallback(
    (code: string, discount: number) =>
      dispatch({ type: 'APPLY_COUPON', payload: { code, discount } }),
    [],
  );

  const removeCoupon = useCallback(
    () => dispatch({ type: 'REMOVE_COUPON' }),
    [],
  );

  const calculations = calculateCart(state);

  const value: CartContextValue = {
    ...state,
    ...calculations,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
