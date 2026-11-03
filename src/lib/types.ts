export type RoastLevel = 'Claro' | 'Medio' | 'Medio-Oscuro' | 'Oscuro';
export type ProcessType = 'Lavado' | 'Honey' | 'Natural' | 'Anaeróbico' | string;
export type GrindType = 'En grano' | 'Gruesa (Prensa francesa)' | 'Media (V60 / Filtro)' | 'Fina (Espresso / Moka)' | string;
export type WeightOption = '250g' | '500g' | '1000g' | 'Pack degustación' | 'Unidad' | string;

export interface ProductVariant {
  id: string;
  weight: WeightOption;
  price: number;
  stock: number;
  sku: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  brewMethod?: string;
  verified: boolean;
  helpfulCount: number;
  userVotedHelpful?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  sku: string;
  categorySlug: string;
  subcategory?: string;
  price: number; // Base price for default variant
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  featured?: boolean;
  inStock: boolean;
  
  // Coffee specific specs
  origin?: string;
  department?: string;
  farm?: string;
  producer?: string;
  altitude?: string;
  variety?: string;
  process?: ProcessType;
  roastLevel?: RoastLevel;
  flavorNotes?: string[];
  cuppingScore?: number;
  brewMethodRecommended?: string;
  availableGrinds: GrindType[];
  certifications: string[];

  // Sensory bars (1 - 5)
  profile: {
    acidity: number;
    body: number;
    sweetness: number;
    bitterness: number;
  };

  description: string;
  story: string;
  images: string[];
  variants: ProductVariant[];
  faqs: { question: string; answer: string }[];
  relatedProductSlugs: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  bannerImage: string;
  iconName: string;
  subcategories: { slug: string; name: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  date: string;
  image: string;
  author: { name: string; role: string };
  content: string[];
}

export interface CartItem {
  id: string; // unique item id = `${productId}-${variantWeight}-${grind}`
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  variantWeight: WeightOption;
  grind: GrindType;
  unitPrice: number;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  weight: WeightOption;
  grind: GrindType;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Confirmado' | 'En tostión' | 'En camino' | 'Entregado' | string;
  trackingNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    department: string;
    phone: string;
    notes?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  department: string;
  favoriteRoast: RoastLevel;
  preferredBrewMethod: string;
  flavorPreferences: string[];
}
