// Script para generar imágenes SVG placeholder para productos
// Se ejecuta con: node scripts/generate-placeholders.js

const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, '..', 'public', 'images', 'products');
const categoriesDir = path.join(__dirname, '..', 'public', 'images', 'categories');
const heroDir = path.join(__dirname, '..', 'public', 'images', 'hero');
const blogDir = path.join(__dirname, '..', 'public', 'images', 'blog');

// Asegurar que existan los directorios
[productsDir, categoriesDir, heroDir, blogDir].forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

const coffeeColors = [
  { bg: '#5A3A24', accent: '#D49A2A', label: 'Café Tostado' },
  { bg: '#2B1B12', accent: '#A9B796', label: 'Oscuro Premium' },
  { bg: '#6B4226', accent: '#F6EEE0', label: 'Medio Especial' },
  { bg: '#3E2217', accent: '#D49A2A', label: 'Origen Único' },
  { bg: '#4A2C1A', accent: '#EADCC4', label: 'Micro Lote' },
];

function createProductSVG(name, colorIdx, variant = 0) {
  const color = coffeeColors[colorIdx % coffeeColors.length];
  const grainRotation = (variant * 30) % 360;
  const steamOffset = variant * 5;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none">
  <defs>
    <linearGradient id="bg${variant}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color.bg}"/>
      <stop offset="100%" stop-color="#2B1B12"/>
    </linearGradient>
    <radialGradient id="glow${variant}" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${color.accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${color.bg}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow${variant}">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <!-- Fondo con gradiente -->
  <rect width="600" height="600" fill="url(#bg${variant})" rx="12"/>
  <rect width="600" height="600" fill="url(#glow${variant})"/>
  <!-- Textura sutil -->
  <rect width="600" height="600" fill="#000" opacity="0.02"/>
  <!-- Bolsa de café estilizada -->
  <rect x="175" y="150" width="250" height="320" rx="8" fill="${color.accent}" opacity="0.15" filter="url(#shadow${variant})"/>
  <rect x="180" y="155" width="240" height="310" rx="6" fill="${color.accent}" opacity="0.25"/>
  <!-- Sello circular -->
  <circle cx="300" cy="280" r="70" fill="none" stroke="${color.accent}" stroke-width="2" opacity="0.8"/>
  <circle cx="300" cy="280" r="60" fill="none" stroke="${color.accent}" stroke-width="1" opacity="0.5"/>
  <!-- Grano de café central -->
  <g transform="translate(300, 280) rotate(${grainRotation})">
    <ellipse rx="25" ry="38" fill="${color.accent}" opacity="0.9"/>
    <path d="M-8,-30 Q0,0 -8,30" stroke="${color.bg}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </g>
  <!-- Vapor decorativo -->
  <g opacity="0.4" transform="translate(${steamOffset}, 0)">
    <path d="M270,140 Q260,120 270,100 Q280,80 270,60" stroke="${color.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M300,145 Q290,120 300,95 Q310,70 300,50" stroke="${color.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M330,140 Q320,120 330,100 Q340,80 330,60" stroke="${color.accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>
  <!-- Nombre del producto -->
  <text x="300" y="520" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="${color.accent}" opacity="0.9">${name}</text>
  <text x="300" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${color.accent}" opacity="0.6">MONTEROJAS</text>
</svg>`;
}

function createCategorySVG(name, colorIdx) {
  const color = coffeeColors[colorIdx % coffeeColors.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" fill="none">
  <defs>
    <linearGradient id="catbg" x1="0" y1="0" x2="1" y2="0.5">
      <stop offset="0%" stop-color="${color.bg}"/>
      <stop offset="100%" stop-color="#2B1B12"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#catbg)" rx="8"/>
  <!-- Montañas decorativas -->
  <path d="M0,400 L200,200 L350,300 L500,150 L650,280 L800,180 L1000,250 L1200,200 L1200,400Z" fill="${color.accent}" opacity="0.1"/>
  <text x="100" y="220" font-family="Georgia, serif" font-size="48" fill="#F6EEE0" font-weight="bold">${name}</text>
  <text x="100" y="260" font-family="Arial, sans-serif" font-size="18" fill="${color.accent}" opacity="0.8">Monterojas — Café de Origen</text>
</svg>`;
}

function createHeroSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 700" fill="none">
  <defs>
    <linearGradient id="herobg" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="#2B1B12"/>
      <stop offset="50%" stop-color="#3E2217"/>
      <stop offset="100%" stop-color="#5A3A24"/>
    </linearGradient>
    <radialGradient id="heroglow" cx="70%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#D49A2A" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#2B1B12" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1400" height="700" fill="url(#herobg)"/>
  <rect width="1400" height="700" fill="url(#heroglow)"/>
  <!-- Montañas de fondo -->
  <path d="M0,700 L100,400 L250,500 L400,300 L550,450 L700,250 L850,400 L1000,300 L1150,350 L1400,500 L1400,700Z" fill="#2F4A36" opacity="0.3"/>
  <path d="M0,700 L150,500 L300,550 L450,400 L600,500 L750,380 L900,450 L1050,400 L1200,480 L1400,550 L1400,700Z" fill="#2F4A36" opacity="0.15"/>
  <!-- Taza de café grande -->
  <g transform="translate(900, 250)">
    <ellipse cx="100" cy="180" rx="120" ry="25" fill="#000" opacity="0.15"/>
    <rect x="10" y="60" width="180" height="130" rx="10" fill="#EADCC4"/>
    <ellipse cx="100" cy="60" rx="90" ry="30" fill="#5A3A24"/>
    <ellipse cx="100" cy="60" rx="75" ry="22" fill="#3E2217"/>
    <!-- Vapor -->
    <path d="M60,30 Q50,0 60,-30 Q70,-60 60,-90" stroke="#F6EEE0" stroke-width="3" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M100,25 Q90,-5 100,-35 Q110,-65 100,-95" stroke="#F6EEE0" stroke-width="3" fill="none" opacity="0.5" stroke-linecap="round"/>
    <path d="M140,30 Q130,0 140,-30 Q150,-60 140,-90" stroke="#F6EEE0" stroke-width="3" fill="none" opacity="0.4" stroke-linecap="round"/>
    <!-- Asa -->
    <path d="M190,90 Q240,90 240,130 Q240,170 190,170" stroke="#EADCC4" stroke-width="12" fill="none" stroke-linecap="round"/>
  </g>
  <!-- Texto de marca -->
  <text x="100" y="300" font-family="Georgia, serif" font-size="72" fill="#F6EEE0" font-weight="bold">Monterojas</text>
  <text x="100" y="360" font-family="Arial, sans-serif" font-size="24" fill="#D49A2A" letter-spacing="4">CAFÉ DE ORIGEN COLOMBIANO</text>
  <text x="100" y="420" font-family="Arial, sans-serif" font-size="18" fill="#EADCC4" opacity="0.8">Del corazón de la montaña a tu taza</text>
</svg>`;
}

// Generar imágenes de productos
const products = [
  'Huila Supremo', 'Nariño Reserva', 'Cauca Imperial', 'Santander Volcánico',
  'Sierra Nevada Clásico', 'Antioquia Gold', 'Huila Honey', 'Nariño Natural',
  'Micro Lote El Paraíso', 'Micro Lote La Esperanza', 'Blend Montañero',
  'Blend Amanecer', 'Geisha Especial', 'Bourbon Rosado', 'Caturra Lavado',
  'Tabi Natural', 'Colombia Supremo', 'Descafeinado Suizo', 'Cold Brew Blend',
  'Espresso Intenso', 'Cápsulas Clásicas', 'Cápsulas Intensas',
  'Kit Degustación', 'Kit Regalo Premium'
];

products.forEach((name, i) => {
  const slug = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // 3 variantes de imagen por producto
  for (let v = 0; v < 3; v++) {
    const svg = createProductSVG(name, i, v);
    const filename = `${slug}-${v + 1}.svg`;
    fs.writeFileSync(path.join(productsDir, filename), svg);
  }
  console.log(`✓ ${name} (${slug})`);
});

// Generar banners de categoría
const categories = [
  'Café en Grano', 'Café Molido', 'Cafés de Origen', 'Cafés Especiales',
  'Cápsulas y Monodosis', 'Accesorios y Métodos', 'Kits y Regalos'
];

categories.forEach((name, i) => {
  const slug = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const svg = createCategorySVG(name, i);
  fs.writeFileSync(path.join(categoriesDir, `${slug}.svg`), svg);
  console.log(`✓ Categoría: ${name}`);
});

// Generar hero
fs.writeFileSync(path.join(heroDir, 'hero-main.svg'), createHeroSVG());
console.log('✓ Hero principal');

// Blog placeholders
const blogPosts = [
  'Cómo preparar el V60 perfecto',
  'Guía de métodos de preparación',
  'El proceso del café: de la cereza a la taza'
];

blogPosts.forEach((title, i) => {
  const svg = createCategorySVG(title, i + 2);
  const slug = title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  fs.writeFileSync(path.join(blogDir, `${slug}.svg`), svg);
  console.log(`✓ Blog: ${title}`);
});

console.log('\n✅ Todas las imágenes placeholder generadas correctamente');
