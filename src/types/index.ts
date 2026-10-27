// =============================================================================
// Monterojas - Tipos TypeScript
// Definiciones de tipos para toda la aplicación
// =============================================================================

// =============================================================================
// Tipos base que reflejan los modelos de Prisma
// =============================================================================

/** Roles de usuario en la plataforma */
export type Role = "USER" | "ADMIN";

/** Usuario registrado en la plataforma */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string | null;
  role: Role;
  /** Preferencias de sabor almacenadas como JSON string */
  flavorPreferences: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones opcionales (cargadas según la consulta)
  orders?: Order[];
  reviews?: Review[];
  addresses?: Address[];
  wishlistItems?: WishlistItem[];
}

/** Categoría de productos con soporte jerárquico */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  displayOrder: number;
  // Relaciones opcionales
  products?: Product[];
  children?: Category[];
  parent?: Category | null;
}

/** Producto de café con información detallada */
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string | null;
  origin: string | null;
  farm: string | null;
  altitude: string | null;
  variety: string | null;
  /** Proceso de beneficio: lavado, honey, natural */
  process: string | null;
  /** Nivel de tueste: claro, medio, oscuro */
  roastLevel: string | null;
  /** Notas de sabor como JSON string array */
  flavorNotes: string | null;
  /** Puntaje de catación SCA (0-100) */
  cuppingScore: number | null;
  /** Métodos de preparación recomendados como JSON string array */
  brewMethods: string | null;
  /** Certificaciones como JSON string array */
  certifications: string | null;
  // Perfil sensorial (escala 0-5)
  acidity: number;
  body: number;
  sweetness: number;
  bitterness: number;
  categoryId: string | null;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones opcionales
  variants?: ProductVariant[];
  images?: ProductImage[];
  reviews?: Review[];
  category?: Category | null;
  wishlistItems?: WishlistItem[];
}

/** Variante específica de un producto (peso + molienda) */
export interface ProductVariant {
  id: string;
  productId: string;
  /** Peso en gramos: 250, 500, 1000 */
  weight: number;
  /** Tipo de molienda: entero, medio, fino, espresso, filtro, moka */
  grind: string;
  /** Precio en COP como entero */
  price: number;
  /** Precio de comparación para descuentos */
  comparePrice: number | null;
  /** Unidades en inventario */
  stock: number;
  /** SKU único de la variante */
  sku: string;
  // Relaciones opcionales
  product?: Product;
  orderItems?: OrderItem[];
}

/** Imagen de un producto */
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  displayOrder: number;
  isPrimary: boolean;
  // Relaciones opcionales
  product?: Product;
}

/** Reseña de un producto */
export interface Review {
  id: string;
  productId: string;
  userId: string;
  /** Calificación de 1 a 5 estrellas */
  rating: number;
  title: string | null;
  content: string | null;
  brewMethod: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  helpfulCount: number;
  /** Estado: approved, pending, rejected */
  status: string;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones opcionales
  product?: Product;
  user?: User;
}

/** Pedido realizado */
export interface Order {
  id: string;
  userId: string | null;
  orderNumber: string;
  /** Estado: pendiente, confirmado, enviado, entregado, cancelado */
  status: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode: string | null;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  paymentMethod: string;
  /** Estado del pago: pendiente, aprobado, rechazado, reembolsado */
  paymentStatus: string;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones opcionales
  user?: User | null;
  items?: OrderItem[];
}

/** Línea individual dentro de un pedido */
export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  weight: number;
  grind: string;
  quantity: number;
  /** Precio unitario al momento de la compra (COP) */
  unitPrice: number;
  // Relaciones opcionales
  order?: Order;
}

/** Dirección de envío guardada */
export interface Address {
  id: string;
  userId: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
  // Relaciones opcionales
  user?: User;
}

/** Producto en la lista de deseos */
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  // Relaciones opcionales
  user?: User;
  product?: Product;
}

/** Cupón de descuento */
export interface Coupon {
  id: string;
  code: string;
  /** Tipo: "percent" (porcentaje) o "fixed" (monto fijo) */
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: Date | null;
}

/** Artículo del blog */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  author: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// Tipos del Carrito de Compras
// =============================================================================

/** Ítem individual en el carrito de compras */
export interface CartItem {
  /** ID de la variante seleccionada */
  variantId: string;
  /** Información del producto asociado */
  productId: string;
  productName: string;
  productSlug: string;
  /** URL de la imagen principal del producto */
  productImage: string | null;
  /** Peso en gramos */
  weight: number;
  /** Tipo de molienda */
  grind: string;
  /** Precio unitario en COP */
  price: number;
  /** Precio de comparación (si aplica descuento) */
  comparePrice: number | null;
  /** Cantidad de unidades en el carrito */
  quantity: number;
  /** Stock disponible de esta variante */
  stock: number;
  /** SKU de la variante */
  sku: string;
}

/** Estado completo del carrito de compras */
export interface CartState {
  /** Lista de ítems en el carrito */
  items: CartItem[];
  /** Subtotal antes de envío y descuentos (COP) */
  subtotal: number;
  /** Costo de envío (COP) */
  shipping: number;
  /** Descuento aplicado (COP) */
  discount: number;
  /** Total final (COP) */
  total: number;
  /** Código de cupón aplicado */
  couponCode: string | null;
}

// =============================================================================
// Tipos de Filtros y Búsqueda
// =============================================================================

/** Estado de los filtros de búsqueda de productos */
export interface FilterState {
  /** Slug de la categoría seleccionada */
  category: string | null;
  /** Rango de precios [min, max] en COP */
  priceRange: [number, number] | null;
  /** Región de origen */
  origin: string | null;
  /** Nivel de tueste: claro, medio, oscuro */
  roastLevel: string | null;
  /** Proceso: lavado, honey, natural */
  process: string | null;
  /** Notas de sabor seleccionadas */
  flavorNotes: string[];
  /** Tipo de molienda */
  grind: string | null;
  /** Peso en gramos */
  weight: number | null;
  /** Puntaje mínimo de catación */
  minCuppingScore: number | null;
  /** Calificación mínima de reseñas */
  minRating: number | null;
  /** Solo productos con stock disponible */
  inStock: boolean;
  /** Certificaciones seleccionadas */
  certifications: string[];
  /** Criterio de ordenamiento */
  sortBy: string;
}

/** Resultado de búsqueda con producto y relevancia */
export interface SearchResult {
  /** Producto encontrado */
  product: Product;
  /** Puntaje de relevancia para ordenar resultados */
  relevance: number;
  /** Fragmento de texto que coincide con la búsqueda */
  matchedField: string;
}

// =============================================================================
// Tipos del Checkout
// =============================================================================

/** Datos del formulario de checkout */
export interface CheckoutFormData {
  // Información de envío
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  /** Método de pago: tarjeta, PSE, nequi, contra_entrega */
  paymentMethod: string;
  /** Notas adicionales del cliente */
  notes: string;
  /** ID de dirección guardada (si el usuario elige una existente) */
  savedAddressId: string | null;
}

// =============================================================================
// Tipos de Perfil de Sabor
// =============================================================================

/** Perfil sensorial de un café (escala 0-5 para cada atributo) */
export interface FlavorProfile {
  /** Nivel de acidez (0-5) */
  acidity: number;
  /** Nivel de cuerpo (0-5) */
  body: number;
  /** Nivel de dulzura (0-5) */
  sweetness: number;
  /** Nivel de amargor (0-5) */
  bitterness: number;
}
