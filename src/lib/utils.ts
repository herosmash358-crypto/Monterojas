// =============================================================================
// Monterojas - Funciones Utilitarias
// Utilidades compartidas en toda la aplicación
// =============================================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SHIPPING_RATES } from "./constants";

// =============================================================================
// Formateo de Precios
// =============================================================================

/**
 * Formatea un precio en pesos colombianos (COP).
 * Convierte un entero a formato de moneda colombiana con separador de miles.
 *
 * @param price - Precio en pesos colombianos como entero
 * @returns Cadena formateada (ej: "$45.000")
 *
 * @example
 * formatCOP(45000)  // "$45.000"
 * formatCOP(150000) // "$150.000"
 * formatCOP(0)      // "$0"
 */
export function formatCOP(price: number): string {
  return `$${price.toLocaleString("es-CO")}`;
}

// =============================================================================
// Generación de Slugs
// =============================================================================

/**
 * Genera un slug URL-friendly a partir de un texto.
 * Convierte a minúsculas, remueve acentos y caracteres especiales,
 * y reemplaza espacios con guiones.
 *
 * @param text - Texto a convertir en slug
 * @returns Slug generado
 *
 * @example
 * generateSlug("Café de Huila Especial") // "cafe-de-huila-especial"
 * generateSlug("Nariño 100% Orgánico")   // "narino-100-organico"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    // Remover marcas diacríticas (acentos, tildes)
    .replace(/[\u0300-\u036f]/g, "")
    // Reemplazar caracteres especiales con guiones
    .replace(/[^a-z0-9]+/g, "-")
    // Remover guiones al inicio y final
    .replace(/^-+|-+$/g, "");
}

// =============================================================================
// Generación de Números de Pedido
// =============================================================================

/**
 * Genera un número de pedido único con formato legible.
 * Formato: "MR-YYYYMMDD-XXXX" donde XXXX es un código alfanumérico aleatorio.
 *
 * @returns Número de pedido generado (ej: "MR-20261027-A3F2")
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Generar código alfanumérico de 4 caracteres
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `MR-${year}${month}${day}-${code}`;
}

// =============================================================================
// Generación de SKUs
// =============================================================================

/**
 * Genera un SKU único para un producto basado en su categoría e índice.
 * Formato: "MR-CAT-001"
 *
 * @param category - Nombre o código de la categoría
 * @param index - Índice numérico del producto
 * @returns SKU generado (ej: "MR-ESP-001")
 *
 * @example
 * generateSKU("especial", 1)  // "MR-ESP-001"
 * generateSKU("blend", 15)    // "MR-BLE-015"
 */
export function generateSKU(category: string, index: number): string {
  const prefix = category
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .slice(0, 3);
  const num = String(index).padStart(3, "0");
  return `MR-${prefix}-${num}`;
}

// =============================================================================
// Truncar Texto
// =============================================================================

/**
 * Trunca un texto a la longitud máxima especificada, añadiendo "..." al final.
 * Si el texto es más corto que maxLength, se devuelve sin cambios.
 *
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima permitida
 * @returns Texto truncado con "..." si excede maxLength
 *
 * @example
 * truncateText("Un café excepcional de la región", 20) // "Un café excepcional..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

// =============================================================================
// Costos de Envío
// =============================================================================

/**
 * Calcula el costo de envío basado en la ciudad de destino.
 * Normaliza el nombre de la ciudad para buscar en las tarifas.
 *
 * @param city - Nombre de la ciudad de destino
 * @returns Costo de envío en COP
 *
 * @example
 * getShippingCost("Bogotá")    // 8000
 * getShippingCost("medellín")  // 10000
 * getShippingCost("Leticia")   // 15000 (tarifa por defecto)
 */
export function getShippingCost(city: string): number {
  // Normalizar el nombre: minúsculas, sin acentos, espacios a guiones bajos
  const normalizedCity = city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");

  return SHIPPING_RATES[normalizedCity] ?? SHIPPING_RATES.default;
}

// =============================================================================
// Cálculo de Descuentos
// =============================================================================

/**
 * Calcula el monto de descuento basado en el cupón aplicado.
 * Soporta descuentos porcentuales y de monto fijo.
 *
 * @param subtotal - Subtotal del pedido en COP
 * @param coupon - Objeto con tipo y valor del cupón
 * @returns Monto del descuento en COP (nunca mayor al subtotal)
 *
 * @example
 * calculateDiscount(100000, { type: "percent", value: 10 }) // 10000
 * calculateDiscount(100000, { type: "fixed", value: 15000 }) // 15000
 * calculateDiscount(5000, { type: "fixed", value: 15000 })   // 5000 (no excede subtotal)
 */
export function calculateDiscount(
  subtotal: number,
  coupon: { type: string; value: number }
): number {
  let discount = 0;

  if (coupon.type === "percent") {
    // Descuento porcentual
    discount = Math.round(subtotal * (coupon.value / 100));
  } else if (coupon.type === "fixed") {
    // Descuento de monto fijo
    discount = coupon.value;
  }

  // El descuento nunca puede ser mayor al subtotal
  return Math.min(discount, subtotal);
}

// =============================================================================
// Utilidad de Clases CSS (Tailwind)
// =============================================================================

/**
 * Combina clases CSS de Tailwind de forma inteligente.
 * Usa clsx para condicionales y twMerge para resolver conflictos de Tailwind.
 *
 * @param classes - Clases CSS a combinar (strings, arrays, objetos condicionales)
 * @returns Cadena de clases CSS combinada y optimizada
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-amber-700", "text-white")
 * cn("text-sm", className) // permite sobrescribir desde props
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}

// =============================================================================
// Búsqueda Difusa (Fuzzy Match)
// =============================================================================

/**
 * Realiza una comparación difusa entre una consulta y un texto objetivo.
 * Permite tolerancia a errores tipográficos y coincidencias parciales.
 *
 * @param query - Término de búsqueda del usuario
 * @param target - Texto objetivo donde buscar
 * @returns true si hay una coincidencia razonable
 *
 * @example
 * fuzzyMatch("huila", "Café de Huila")         // true
 * fuzzyMatch("choclate", "chocolate")           // true (tolerancia a typos)
 * fuzzyMatch("espresso", "preparación filtro")  // false
 */
export function fuzzyMatch(query: string, target: string): boolean {
  // Normalizar ambos textos: minúsculas y sin acentos
  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const normalizedTarget = target
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Coincidencia directa (substring)
  if (normalizedTarget.includes(normalizedQuery)) {
    return true;
  }

  // Coincidencia difusa: verificar si los caracteres de la consulta
  // aparecen en orden dentro del objetivo (fuzzy subsequence)
  let queryIndex = 0;
  for (let i = 0; i < normalizedTarget.length && queryIndex < normalizedQuery.length; i++) {
    if (normalizedTarget[i] === normalizedQuery[queryIndex]) {
      queryIndex++;
    }
  }

  // Se considera coincidencia si al menos el 80% de los caracteres coinciden en orden
  return queryIndex >= normalizedQuery.length * 0.8;
}

// =============================================================================
// Distribución de Estrellas
// =============================================================================

/**
 * Calcula la distribución de calificaciones por estrellas.
 * Retorna un array con el conteo de reseñas para cada nivel (1-5).
 *
 * @param reviews - Array de reseñas con campo rating
 * @returns Array de 5 posiciones [count1★, count2★, count3★, count4★, count5★]
 *
 * @example
 * getStarDistribution([{rating: 5}, {rating: 4}, {rating: 5}])
 * // [0, 0, 0, 1, 2] → 0 de 1★, 0 de 2★, 0 de 3★, 1 de 4★, 2 de 5★
 */
export function getStarDistribution(reviews: { rating: number }[]): number[] {
  const distribution = [0, 0, 0, 0, 0]; // Índices 0-4 representan 1★-5★

  for (const review of reviews) {
    const index = Math.max(0, Math.min(4, review.rating - 1));
    distribution[index]++;
  }

  return distribution;
}

// =============================================================================
// Calificación Promedio
// =============================================================================

/**
 * Calcula la calificación promedio de un conjunto de reseñas.
 * Retorna 0 si no hay reseñas.
 *
 * @param reviews - Array de reseñas con campo rating
 * @returns Promedio redondeado a un decimal
 *
 * @example
 * getAverageRating([{rating: 5}, {rating: 4}, {rating: 5}]) // 4.7
 * getAverageRating([]) // 0
 */
export function getAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
