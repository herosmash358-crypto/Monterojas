// =============================================================================
// Monterojas - Constantes de la Aplicación
// Valores fijos utilizados en toda la tienda
// =============================================================================

// =============================================================================
// Regiones cafeteras de Colombia
// =============================================================================

/** Principales regiones de origen del café colombiano */
export const REGIONS = [
  { value: "huila", label: "Huila" },
  { value: "narino", label: "Nariño" },
  { value: "cauca", label: "Cauca" },
  { value: "santander", label: "Santander" },
  { value: "sierra-nevada", label: "Sierra Nevada" },
  { value: "antioquia", label: "Antioquia" },
] as const;

// =============================================================================
// Procesos de beneficio
// =============================================================================

/** Métodos de procesamiento post-cosecha del café */
export const PROCESSES = [
  { value: "lavado", label: "Lavado" },
  { value: "honey", label: "Honey" },
  { value: "natural", label: "Natural" },
] as const;

// =============================================================================
// Niveles de tueste
// =============================================================================

/** Niveles de tueste disponibles */
export const ROAST_LEVELS = [
  { value: "claro", label: "Tueste Claro" },
  { value: "medio", label: "Tueste Medio" },
  { value: "oscuro", label: "Tueste Oscuro" },
] as const;

// =============================================================================
// Notas de sabor
// =============================================================================

/** Notas de sabor comunes encontradas en cafés colombianos */
export const FLAVOR_NOTES = [
  "chocolate",
  "frutal",
  "floral",
  "caramelo",
  "nuez",
  "cítrico",
  "miel",
  "panela",
  "mora",
  "cereza",
  "vainilla",
  "almendra",
  "especias",
  "cacao",
] as const;

// =============================================================================
// Opciones de molienda
// =============================================================================

/** Tipos de molienda disponibles para cada producto */
export const GRIND_OPTIONS = [
  { value: "entero", label: "Grano Entero" },
  { value: "medio", label: "Molienda Media" },
  { value: "fino", label: "Molienda Fina" },
  { value: "espresso", label: "Espresso" },
  { value: "filtro", label: "Filtro / Goteo" },
  { value: "moka", label: "Moka / Cafetera Italiana" },
] as const;

// =============================================================================
// Opciones de peso
// =============================================================================

/** Presentaciones de peso disponibles */
export const WEIGHT_OPTIONS = [
  { value: 250, label: "250g", suffix: "g" },
  { value: 500, label: "500g", suffix: "g" },
  { value: 1000, label: "1kg", suffix: "kg" },
] as const;

// =============================================================================
// Métodos de preparación
// =============================================================================

/** Métodos de preparación de café recomendados */
export const BREW_METHODS = [
  "Espresso",
  "V60",
  "Chemex",
  "Prensa Francesa",
  "AeroPress",
  "Moka",
  "Goteo",
  "Cold Brew",
  "Sifón",
  "Turco",
] as const;

// =============================================================================
// Certificaciones
// =============================================================================

/** Certificaciones de calidad y sostenibilidad */
export const CERTIFICATIONS = [
  "Rainforest Alliance",
  "UTZ",
  "Orgánico",
  "Comercio Justo",
  "FNC",
  "Denominación de Origen",
] as const;

// =============================================================================
// Opciones de ordenamiento
// =============================================================================

/** Criterios de ordenamiento para listados de productos */
export const SORT_OPTIONS = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: Menor a Mayor" },
  { value: "precio-desc", label: "Precio: Mayor a Menor" },
  { value: "nombre-asc", label: "Nombre: A - Z" },
  { value: "nombre-desc", label: "Nombre: Z - A" },
  { value: "calificacion", label: "Mejor Calificados" },
  { value: "recientes", label: "Más Recientes" },
  { value: "catacion", label: "Puntaje de Catación" },
  { value: "populares", label: "Más Populares" },
] as const;

// =============================================================================
// Tarifas de envío
// =============================================================================

/** Tarifas de envío por ciudad en pesos colombianos (COP) */
export const SHIPPING_RATES: Record<string, number> = {
  bogota: 8000,
  medellin: 10000,
  cali: 10000,
  barranquilla: 12000,
  cartagena: 12000,
  bucaramanga: 10000,
  pereira: 9000,
  manizales: 9000,
  armenia: 9000,
  ibague: 9000,
  neiva: 8000,
  popayan: 9000,
  pasto: 11000,
  villavicencio: 9000,
  santa_marta: 12000,
  cucuta: 11000,
  tunja: 8000,
  monteria: 12000,
  valledupar: 13000,
  sincelejo: 13000,
  // Tarifa por defecto para otras ciudades
  default: 15000,
} as const;

/** Umbral de compra para envío gratis (COP) */
export const FREE_SHIPPING_THRESHOLD = 150000;

// =============================================================================
// Ciudades principales de Colombia
// =============================================================================

/** Ciudades principales para selector de envío */
export const COLOMBIAN_CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Armenia",
  "Ibagué",
  "Neiva",
  "Popayán",
  "Pasto",
  "Villavicencio",
  "Santa Marta",
  "Cúcuta",
  "Tunja",
  "Montería",
  "Valledupar",
  "Sincelejo",
] as const;

// =============================================================================
// Métodos de pago
// =============================================================================

/** Métodos de pago aceptados en la tienda */
export const PAYMENT_METHODS = [
  {
    id: "tarjeta",
    name: "Tarjeta de Crédito / Débito",
    icon: "credit-card",
  },
  {
    id: "pse",
    name: "PSE - Débito Bancario",
    icon: "bank",
  },
  {
    id: "nequi",
    name: "Nequi",
    icon: "smartphone",
  },
  {
    id: "contra_entrega",
    name: "Pago Contra Entrega",
    icon: "package",
  },
] as const;
