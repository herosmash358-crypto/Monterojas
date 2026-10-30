'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Order, Product, Review, UserProfile, WeightOption, GrindType } from './types';
import { INITIAL_REVIEWS } from './data/reviews';

const FREE_SHIPPING_THRESHOLD = 90000; // COP 90.000 envío gratis

interface StoreContextType {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, weight: WeightOption, grind: GrindType, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string;
  appliedDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartShipping: number;
  cartTotal: number;
  freeShippingProgress: number; // 0 to 100%
  amountUntilFreeShipping: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Auth & Profile
  user: UserProfile | null;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber'>) => Order;

  // Reviews dynamic
  reviews: Record<string, Review[]>;
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'verified'>) => void;
  markReviewHelpful: (productId: string, reviewId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  name: 'Alejandro Morales',
  email: 'alejandro.morales@monterojas.co',
  phone: '+57 312 458 9210',
  city: 'Bogotá D.C.',
  department: 'Cundinamarca',
  favoriteRoast: 'Medio',
  preferredBrewMethod: 'V60 (Hario)',
  flavorPreferences: ['Panela', 'Caramelo', 'Jazmín', 'Cacao oscuro'],
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'MON-2026-8941',
    date: '21 de Octubre, 2026',
    status: 'Entregado',
    trackingNumber: 'ENV-98327410-CO',
    items: [
      {
        productId: 'prod-1',
        name: 'Montaña Dorada — Huila Suave',
        image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=400&q=80',
        weight: '500g',
        grind: 'En grano',
        unitPrice: 62000,
        quantity: 1,
      },
      {
        productId: 'prod-17',
        name: 'Gotero V60 Cerámica Blanco — Hario 02',
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=400&q=80',
        weight: 'Unidad',
        grind: 'En grano',
        unitPrice: 135000,
        quantity: 1,
      },
    ],
    subtotal: 197000,
    shipping: 0,
    discount: 15000,
    total: 182000,
    paymentMethod: 'PSE',
    shippingAddress: {
      fullName: 'Alejandro Morales',
      street: 'Calle 118 # 14 - 28 Apto 402',
      city: 'Bogotá D.C.',
      department: 'Cundinamarca',
      phone: '+57 312 458 9210',
      notes: 'Dejar en portería del edificio.',
    },
  },
  {
    id: 'MON-2026-9102',
    date: '28 de Octubre, 2026',
    status: 'En camino',
    trackingNumber: 'ENV-98335190-CO',
    items: [
      {
        productId: 'prod-10',
        name: 'Geisha Ancestral — Micro-lote Edición de Colección',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
        weight: '250g',
        grind: 'Media (V60 / Filtro)',
        unitPrice: 68000,
        quantity: 1,
      },
      {
        productId: 'prod-2',
        name: 'Cielo de Nariño — Altura Pura',
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
        weight: '250g',
        grind: 'En grano',
        unitPrice: 36000,
        quantity: 1,
      },
    ],
    subtotal: 104000,
    shipping: 0,
    discount: 0,
    total: 104000,
    paymentMethod: 'Tarjeta de Crédito',
    shippingAddress: {
      fullName: 'Alejandro Morales',
      street: 'Calle 118 # 14 - 28 Apto 402',
      city: 'Bogotá D.C.',
      department: 'Cundinamarca',
      phone: '+57 312 458 9210',
      notes: 'Timbre 402',
    },
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>(['prod-10', 'prod-17']);
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Record<string, Review[]>>(INITIAL_REVIEWS);
  const [mounted, setMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('monterojas_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const savedWishlist = localStorage.getItem('monterojas_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem('monterojas_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedReviews = localStorage.getItem('monterojas_reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));

      const savedUser = localStorage.getItem('monterojas_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error('Failed to load local storage state', e);
    }
    setMounted(true);
  }, []);

  // Save changes to local storage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('monterojas_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('monterojas_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('monterojas_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('monterojas_reviews', JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (user) localStorage.setItem('monterojas_user', JSON.stringify(user));
      else localStorage.removeItem('monterojas_user');
    } catch (e) {}
  }, [user, mounted]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, weight: WeightOption, grind: GrindType, quantity = 1) => {
    const variant = product.variants.find((v) => v.weight === weight) || product.variants[0];
    const unitPrice = variant ? variant.price : product.price;
    const itemId = `${product.id}-${weight}-${grind}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          productSlug: product.slug,
          name: product.name,
          image: product.images[0],
          variantWeight: weight,
          grind,
          unitPrice,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
    setCouponCode('');
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MONTEROJAS10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discount);
      setCouponCode(clean);
      return { success: true, message: '¡Cupón aplicado! 10% de descuento en tu compra.' };
    }
    if (clean === 'ENVIOFREE') {
      setAppliedDiscount(12000);
      setCouponCode(clean);
      return { success: true, message: '¡Bono de envío gratuito redimido!' };
    }
    return { success: false, message: 'Cupón no válido o expirado. Prueba con MONTEROJAS10.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const cartShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : 12000;
  const cartTotal = Math.max(0, cartSubtotal + cartShipping - appliedDiscount);

  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Auth
  const login = (email: string, pass: string) => {
    setUser({
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
    });
    return true;
  };

  const register = (name: string, email: string, pass: string) => {
    setUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: '+57 300 000 0000',
      city: 'Medellín',
      department: 'Antioquia',
      favoriteRoast: 'Medio',
      preferredBrewMethod: 'V60 (Hario)',
      flavorPreferences: ['Panela', 'Caramelo'],
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber'>): Order => {
    const id = `MON-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      date: new Date().toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      trackingNumber: `ENV-${Math.floor(10000000 + Math.random() * 90000000)}-CO`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Reviews
  const addReview = (newRev: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'verified'>) => {
    const completeReview: Review = {
      ...newRev,
      id: `rev-usr-${Date.now()}`,
      date: 'Hoy',
      helpfulCount: 0,
      verified: true,
    };

    setReviews((prev) => {
      const currentList = prev[newRev.productId] || [];
      return {
        ...prev,
        [newRev.productId]: [completeReview, ...currentList],
      };
    });
  };

  const markReviewHelpful = (productId: string, reviewId: string) => {
    setReviews((prev) => {
      const currentList = prev[productId] || [];
      return {
        ...prev,
        [productId]: currentList.map((r) =>
          r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1, userVotedHelpful: true } : r
        ),
      };
    });
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        appliedDiscount,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartShipping,
        cartTotal,
        freeShippingProgress,
        amountUntilFreeShipping,
        wishlist,
        toggleWishlist,
        isWishlisted,
        user,
        login,
        register,
        logout,
        updateProfile,
        orders,
        createOrder,
        reviews,
        addReview,
        markReviewHelpful,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
