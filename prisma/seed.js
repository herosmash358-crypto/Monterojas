const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES_DATA = [
  {
    id: 'cat-1',
    name: 'Café en Grano',
    slug: 'cafe-en-grano',
    description: 'Granos enteros recién tostados para moler en casa con frescura absoluta.',
    image: '/images/categories/cafe-en-grano.svg',
    displayOrder: 1,
  },
  {
    id: 'cat-2',
    name: 'Café Molido',
    slug: 'cafe-molido',
    description: 'Molido fresco calibrado para prensa francesa, filtro, V60 o espresso.',
    image: '/images/categories/cafe-molido.svg',
    displayOrder: 2,
  },
  {
    id: 'cat-3',
    name: 'Cafés de Origen',
    slug: 'cafes-de-origen',
    description: 'Un viaje sensorial por las cordilleras de Colombia: Huila, Nariño, Cauca y Santander.',
    image: '/images/categories/cafes-de-origen.svg',
    displayOrder: 3,
  },
  {
    id: 'cat-4',
    name: 'Cafés Especiales',
    slug: 'cafes-especiales',
    description: 'Puntajes SCA superiores a 86+ y varietales exóticos como Geisha y Bourbon Rosado.',
    image: '/images/categories/cafes-especiales.svg',
    displayOrder: 4,
  },
  {
    id: 'cat-5',
    name: 'Cápsulas y Monodosis',
    slug: 'capsulas-y-monodosis',
    description: '100% café de especialidad colombiano en cápsulas compostables compatibles con Nespresso.',
    image: '/images/categories/capsulas-y-monodosis.svg',
    displayOrder: 5,
  },
  {
    id: 'cat-6',
    name: 'Accesorios y Métodos',
    slug: 'accesorios-y-metodos',
    description: 'Cafeteras de émbolo, goteros V60, Chemex y molinillos cónicos para baristas en casa.',
    image: '/images/categories/accesorios-y-metodos.svg',
    displayOrder: 6,
  },
  {
    id: 'cat-7',
    name: 'Kits y Regalos',
    slug: 'kits-y-regalos',
    description: 'Cajas de cata de degustación, suscripciones recurrentes y obsequios con alma.',
    image: '/images/categories/kits-y-regalos.svg',
    displayOrder: 7,
  },
];

const PRODUCTS_DATA = [
  // 1. Huila Supremo
  {
    name: 'Huila Supremo',
    slug: 'huila-supremo',
    sku: 'MON-HUI-001',
    categorySlug: 'cafe-en-grano',
    shortDescription: 'Equilibrio clásico con caramelo de panela y mandarina madura.',
    description: 'Nuestro café insignia del Macizo Colombiano. Cultivado en suelos volcánicos con secado solar en camas africanas, ofrece un dulzor redondo y sedoso que reconforta en cada sorbo.',
    origin: 'Pitalito, Huila',
    farm: 'Finca La Esperanza',
    altitude: '1.750 msnm',
    variety: 'Castillo y Caturra',
    process: 'Lavado',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Panela', 'Mandarina', 'Chocolate de leche', 'Almendra']),
    cuppingScore: 86.5,
    brewMethods: JSON.stringify(['Filtrado V60', 'Chemex', 'Cafetera de goteo']),
    certifications: JSON.stringify(['Denominación de Origen', 'Rainforest Alliance']),
    acidity: 4, body: 3, sweetness: 5, bitterness: 2,
    featured: true, bestSeller: true, isNew: false,
    basePrice: 34000,
  },
  // 2. Nariño Reserva
  {
    name: 'Nariño Reserva',
    slug: 'narino-reserva',
    sku: 'MON-NAR-002',
    categorySlug: 'cafes-de-origen',
    shortDescription: 'Acidez cítrica vibrante y elegancia floral cosechada a más de 2.100 msnm.',
    description: 'Cosechado en las faldas de los volcanes de Nariño, donde las noches frías concentran los azúcares y crean una acidez málica refinada que recuerda a manzana verde y jazmín.',
    origin: 'La Unión, Nariño',
    farm: 'Finca Vista Hermosa',
    altitude: '2.150 msnm',
    variety: 'Caturra y Borbón',
    process: 'Lavado tradicional',
    roastLevel: 'Claro',
    flavorNotes: JSON.stringify(['Jazmín', 'Limón Meyer', 'Manzana verde', 'Miel de azahar']),
    cuppingScore: 88.0,
    brewMethods: JSON.stringify(['V60', 'Chemex', 'Aeropress']),
    certifications: JSON.stringify(['Orgánico Certificado', 'Comercio Justo']),
    acidity: 5, body: 3, sweetness: 4, bitterness: 1,
    featured: true, bestSeller: true, isNew: false,
    basePrice: 36000,
  },
  // 3. Cauca Imperial
  {
    name: 'Cauca Imperial',
    slug: 'cauca-imperial',
    sku: 'MON-CAU-003',
    categorySlug: 'cafes-de-origen',
    shortDescription: 'Cuerpo untuoso con notas a moras silvestres y cacao puro al 70%.',
    description: 'En el corazón de Tierradentro, las comunidades Nasa cultivan este café bajo doseles de guamo y plátano. Taza densa y reconfortante con postgusto achocolatado persistente.',
    origin: 'Inzá, Tierradentro, Cauca',
    farm: 'Resguardo Indígena Páez',
    altitude: '1.900 msnm',
    variety: 'Tabi y Typica',
    process: 'Lavado con doble fermentación',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Mora silvestre', 'Cacao puro', 'Panela morena', 'Clavo']),
    cuppingScore: 86.0,
    brewMethods: JSON.stringify(['Prensa Francesa', 'Moka italiana', 'Espresso']),
    certifications: JSON.stringify(['Comercio Justo', 'Denominación de Origen']),
    acidity: 3, body: 4, sweetness: 4, bitterness: 2,
    featured: false, bestSeller: true, isNew: false,
    basePrice: 33000,
  },
  // 4. Santander Volcánico
  {
    name: 'Santander Volcánico',
    slug: 'santander-volcanico',
    sku: 'MON-SAN-004',
    categorySlug: 'cafe-en-grano',
    shortDescription: 'Café de sombra bajo ceibas con notas a chocolate amargo y cedro.',
    description: 'Pionero de la caficultura colombiana cultivado bajo bosques primarios que protegen aves migratorias. Cuerpo robusto, baja acidez y un perfil clásico y penetrante.',
    origin: 'San Gil, Santander',
    farm: 'Hacienda El Roble',
    altitude: '1.600 msnm',
    variety: 'Castillo y Colombia',
    process: 'Lavado',
    roastLevel: 'Medio-Oscuro',
    flavorNotes: JSON.stringify(['Chocolate 80%', 'Almendra tostada', 'Caramelo oscuro', 'Cedro']),
    cuppingScore: 85.0,
    brewMethods: JSON.stringify(['Moka italiana', 'Espresso', 'Prensa Francesa']),
    certifications: JSON.stringify(['Bird Friendly Smithsonian', 'Orgánico']),
    acidity: 2, body: 5, sweetness: 3, bitterness: 3,
    featured: false, bestSeller: false, isNew: false,
    basePrice: 32000,
  },
  // 5. Sierra Nevada Clásico
  {
    name: 'Sierra Nevada Clásico',
    slug: 'sierra-nevada-clasico',
    sku: 'MON-SIE-005',
    categorySlug: 'cafes-de-origen',
    shortDescription: 'Cultivado por comunidades Arhuacas bajo brisas caribeñas y niebla de montaña.',
    description: 'En el macizo litoral más alto del planeta, cafetos centenarios reciben agua de manantial sagrado. Sabor apanalado, baja acidez y notas densas a frutos secos.',
    origin: 'Pueblo Bello, Sierra Nevada',
    farm: 'Comunidad Gun Aruwun',
    altitude: '1.700 msnm',
    variety: 'Typica Antiguo',
    process: 'Lavado tradicional',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Avellana', 'Melaza', 'Higo seco', 'Nuez moscada']),
    cuppingScore: 85.5,
    brewMethods: JSON.stringify(['Cafetera de filtro', 'Chemex', 'Aeropress']),
    certifications: JSON.stringify(['Orgánico USDA y UE', 'Comercio Étnico']),
    acidity: 2, body: 4, sweetness: 4, bitterness: 2,
    featured: false, bestSeller: false, isNew: false,
    basePrice: 35000,
  },
  // 6. Antioquia Gold
  {
    name: 'Antioquia Gold',
    slug: 'antioquia-gold',
    sku: 'MON-ANT-006',
    categorySlug: 'cafe-en-grano',
    shortDescription: 'El café paisa tradicional: caña de azúcar, cacao y manzana roja madura.',
    description: 'De las empinadas faldas del Suroeste antioqueño, en el pueblo patrimonial de Jardín. El perfil aromático más noble y hogareño para acompañar el inicio de la jornada.',
    origin: 'Jardín, Antioquia',
    farm: 'Finca La Alborada',
    altitude: '1.800 msnm',
    variety: 'Castillo y Caturra',
    process: 'Lavado ecológico',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Panela rubia', 'Manzana roja', 'Cacao', 'Mantequilla fresca']),
    cuppingScore: 85.0,
    brewMethods: JSON.stringify(['Greca tradicional', 'Filtro', 'Espresso']),
    certifications: JSON.stringify(['Denominación de Origen']),
    acidity: 3, body: 4, sweetness: 4, bitterness: 2,
    featured: false, bestSeller: true, isNew: false,
    basePrice: 32000,
  },
  // 7. Huila Honey
  {
    name: 'Huila Honey',
    slug: 'huila-honey',
    sku: 'MON-HUI-HON-007',
    categorySlug: 'cafes-especiales',
    shortDescription: 'Secado con el mucílago dulce natural: durazno maduro y miel de abejas.',
    description: 'Proceso de autor donde el grano se seca al sol con sus propios azúcares durante 25 días. Dulzor intenso con textura aterciopelada y acidez dulce de frutas de hueso.',
    origin: 'San Agustín, Huila',
    farm: 'Finca Bellavista',
    altitude: '1.850 msnm',
    variety: 'Borbón Rosado & Caturra',
    process: 'Honey Amarillo',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Miel silvestre', 'Durazno', 'Caramelo salado', 'Flores']),
    cuppingScore: 87.5,
    brewMethods: JSON.stringify(['Aeropress', 'V60', 'Chemex']),
    certifications: JSON.stringify(['Micro-lote de Origen Único']),
    acidity: 4, body: 4, sweetness: 5, bitterness: 1,
    featured: true, bestSeller: false, isNew: true,
    basePrice: 42000,
  },
  // 8. Nariño Natural
  {
    name: 'Nariño Natural',
    slug: 'narino-natural',
    sku: 'MON-NAR-NAT-008',
    categorySlug: 'cafes-especiales',
    shortDescription: 'Fermentación en cereza entera: frutos rojos compotados y licor suave.',
    description: 'Secado lento en zarandas elevadas bajo marquesina solar. Las levaduras nativas enriquecen el grano con ésteres afrutados recordando a vino dulce y fresas maduras.',
    origin: 'Buesaco, Nariño',
    farm: 'La Ilusión',
    altitude: '2.080 msnm',
    variety: 'Caturra',
    process: 'Natural',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Fresas maduras', 'Arándanos', 'Vino dulce', 'Cacao oscuro']),
    cuppingScore: 88.25,
    brewMethods: JSON.stringify(['Chemex', 'V60', 'Prensa Francesa']),
    certifications: JSON.stringify(['Micro-lote']),
    acidity: 4, body: 4, sweetness: 5, bitterness: 2,
    featured: true, bestSeller: false, isNew: true,
    basePrice: 45000,
  },
  // 9. Micro Lote El Paraíso
  {
    name: 'Micro Lote El Paraíso',
    slug: 'micro-lote-el-paraiso',
    sku: 'MON-SPE-PAR-009',
    categorySlug: 'cafes-especiales',
    shortDescription: 'Fermentación anaeróbica térmica con notas tropicales a maracuyá y guayaba.',
    description: 'Cultivado por pioneros de la biotecnología cafetera en Cauca. Fermentación en tanques de acero sellados que despiertan notas vibrantes a frutas de la pasión.',
    origin: 'Piendamó, Cauca',
    farm: 'El Paraíso',
    altitude: '1.930 msnm',
    variety: 'Castillo Especial',
    process: 'Anaeróbico Choque Térmico',
    roastLevel: 'Claro',
    flavorNotes: JSON.stringify(['Maracuyá', 'Guayaba rosa', 'Yogur de fresa', 'Vainilla']),
    cuppingScore: 89.0,
    brewMethods: JSON.stringify(['V60 Origami', 'Chemex']),
    certifications: JSON.stringify(['Edición Limitada 80 Sacos']),
    acidity: 5, body: 3, sweetness: 5, bitterness: 1,
    featured: true, bestSeller: true, isNew: true,
    basePrice: 58000,
  },
  // 10. Micro Lote La Esperanza
  {
    name: 'Micro Lote La Esperanza',
    slug: 'micro-lote-la-esperanza',
    sku: 'MON-SPE-ESP-010',
    categorySlug: 'cafes-especiales',
    shortDescription: 'Taza limpia y floral con notas a té de jazmín y miel de azahar.',
    description: 'Selección meticulosa grano a grano a 24° Brix. Una de las expresiones más puras y delicadas de la cordillera huilense.',
    origin: 'Pitalito, Huila',
    farm: 'La Esperanza',
    altitude: '1.820 msnm',
    variety: 'Borbón Rojo',
    process: 'Lavado 36h',
    roastLevel: 'Claro',
    flavorNotes: JSON.stringify(['Té blanco', 'Jazmín', 'Pera de agua', 'Limonaria']),
    cuppingScore: 88.5,
    brewMethods: JSON.stringify(['V60 Hario', 'Kalita Wave']),
    certifications: JSON.stringify(['Trazabilidad 100%']),
    acidity: 5, body: 3, sweetness: 4, bitterness: 1,
    featured: false, bestSeller: false, isNew: false,
    basePrice: 48000,
  },
  // 11. Blend Montañero
  {
    name: 'Blend Montañero',
    slug: 'blend-montanero',
    sku: 'MON-BLE-MON-011',
    categorySlug: 'cafe-molido',
    shortDescription: 'Mezcla equilibrada de Huila y Antioquia para el café matutino de la familia.',
    description: 'La armonía entre la acidez balanceada de Huila y el cuerpo achocolatado de Antioquia. Molido fresco para goteo o prensa.',
    origin: 'Huila & Antioquia',
    farm: 'Cooperativas Aliadas',
    altitude: '1.700 msnm',
    variety: 'Castillo y Colombia',
    process: 'Lavado',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Chocolate con leche', 'Panela', 'Naranja dulce']),
    cuppingScore: 84.5,
    brewMethods: JSON.stringify(['Cafetera de goteo', 'Prensa Francesa', 'Greca']),
    certifications: JSON.stringify(['Denominación de Origen']),
    acidity: 3, body: 4, sweetness: 4, bitterness: 2,
    featured: false, bestSeller: true, isNew: false,
    basePrice: 29000,
  },
  // 12. Blend Amanecer
  {
    name: 'Blend Amanecer',
    slug: 'blend-amanecer',
    sku: 'MON-BLE-AMA-012',
    categorySlug: 'cafe-molido',
    shortDescription: 'Tostión viva y luminosa con cítricos suaves y aroma floral energizante.',
    description: 'Diseñado para despertar los sentidos con notas frescas a mandarina y flor de cafeto.',
    origin: 'Nariño & Huila',
    farm: 'Fincas Asociadas',
    altitude: '1.900 msnm',
    variety: 'Caturra y Borbón',
    process: 'Lavado',
    roastLevel: 'Claro',
    flavorNotes: JSON.stringify(['Mandarina', 'Flor de azahar', 'Miel suave']),
    cuppingScore: 85.5,
    brewMethods: JSON.stringify(['V60', 'Filtro eléctrico', 'Aeropress']),
    certifications: JSON.stringify(['Café 100% Colombiano']),
    acidity: 4, body: 3, sweetness: 4, bitterness: 1,
    featured: false, bestSeller: false, isNew: false,
    basePrice: 31000,
  },
  // 13. Geisha Especial
  {
    name: 'Geisha Especial',
    slug: 'geisha-especial',
    sku: 'MON-SPE-GEI-013',
    categorySlug: 'cafes-especiales',
    shortDescription: 'La joya botánica: bergamota, jazmín silvestre, melocotón blanco y té de limón.',
    description: 'El varietal más codiciado del mundo cultivado a casi 2.000 msnm en Palestina, Huila. Complejidad aromática sublime con cuerpo sedoso casi etéreo.',
    origin: 'Palestina, Huila',
    farm: 'Finca Paraíso Verde',
    altitude: '1.950 msnm',
    variety: 'Geisha 100%',
    process: 'Lavado Anaeróbico 48h',
    roastLevel: 'Claro',
    flavorNotes: JSON.stringify(['Bergamota', 'Jazmín', 'Melocotón blanco', 'Lemongrass', 'Miel']),
    cuppingScore: 89.75,
    brewMethods: JSON.stringify(['V60', 'Chemex', 'Origami']),
    certifications: JSON.stringify(['Lote de Colección', 'Selección Manual Láser']),
    acidity: 5, body: 3, sweetness: 5, bitterness: 1,
    featured: true, bestSeller: true, isNew: true,
    basePrice: 68000,
  },
  // 14. Bourbon Rosado
  {
    name: 'Bourbon Rosado',
    slug: 'bourbon-rosado',
    sku: 'MON-SPE-BOU-014',
    categorySlug: 'cafes-especiales',
    shortDescription: 'Cereza rosa tornasolada: papaya dulce, maracuyá y caramelo salado.',
    description: 'Mutación natural descubierta en el Huila. Su pulpa translúcida rica en azúcares produce una taza exótica e hipnótica.',
    origin: 'Acevedo, Huila',
    farm: 'Bellavista',
    altitude: '1.870 msnm',
    variety: 'Pink Bourbon',
    process: 'Honey',
    roastLevel: 'Claro',
    flavorNotes: JSON.stringify(['Papaya madura', 'Maracuyá', 'Caramelo salado', 'Flores de saúco']),
    cuppingScore: 88.75,
    brewMethods: JSON.stringify(['Aeropress', 'V60', 'Chemex']),
    certifications: JSON.stringify(['Micro-lote Huila']),
    acidity: 4, body: 4, sweetness: 5, bitterness: 1,
    featured: true, bestSeller: true, isNew: false,
    basePrice: 54000,
  },
  // 15. Caturra Lavado
  {
    name: 'Caturra Lavado',
    slug: 'caturra-lavado',
    sku: 'MON-CAT-LAV-015',
    categorySlug: 'cafe-en-grano',
    shortDescription: 'La pureza del varietal clásico colombiano con balance impecable.',
    description: 'Caturra puro de sombra con fermentación sumergida tradicional en tanques de azulejo blanco. Taza limpia, dulce y sin asperezas.',
    origin: 'Gigante, Huila',
    farm: 'El Mirador',
    altitude: '1.750 msnm',
    variety: 'Caturra',
    process: 'Lavado',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Caramelo', 'Chocolate suave', 'Manzana roja', 'Nuez']),
    cuppingScore: 85.5,
    brewMethods: JSON.stringify(['Chemex', 'Filtro', 'V60']),
    certifications: JSON.stringify(['Denominación de Origen']),
    acidity: 3, body: 3, sweetness: 4, bitterness: 2,
    featured: false, bestSeller: false, isNew: false,
    basePrice: 33000,
  },
  // 16. Tabi Natural
  {
    name: 'Tabi Natural',
    slug: 'tabi-natural',
    sku: 'MON-TAB-NAT-016',
    categorySlug: 'cafes-especiales',
    shortDescription: 'Cruce entre Typica, Bourbon y Timor con secado en cereza entera: licor y frutos del bosque.',
    description: 'El varietal Tabi («bueno» en lengua Guambiana) destaca por granos alargados y perfil licoroso dulce.',
    origin: 'Tierradentro, Cauca',
    farm: 'La Cabaña',
    altitude: '1.920 msnm',
    variety: 'Tabi',
    process: 'Natural',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Vino tinto', 'Mora azul', 'Ciruela pasa', 'Cacao oscuro']),
    cuppingScore: 87.5,
    brewMethods: JSON.stringify(['Prensa Francesa', 'Chemex']),
    certifications: JSON.stringify(['Comercio Justo']),
    acidity: 3, body: 5, sweetness: 5, bitterness: 2,
    featured: false, bestSeller: false, isNew: true,
    basePrice: 47000,
  },
  // 17. Colombia Supremo
  {
    name: 'Colombia Supremo',
    slug: 'colombia-supremo',
    sku: 'MON-COL-SUP-017',
    categorySlug: 'cafe-en-grano',
    shortDescription: 'Malla 17/18 seleccionada: grano gigante con tostión media dorada.',
    description: 'Granos de calibre superior cuidadosamente clasificados por tamaño y densidad. Tostión uniforme con crema dorada espesa.',
    origin: 'Pitalito & Gigante',
    farm: 'Selección Especial',
    altitude: '1.700 msnm',
    variety: 'Colombia y Caturra',
    process: 'Lavado',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Panela', 'Cacao', 'Avellana tostada']),
    cuppingScore: 85.0,
    brewMethods: JSON.stringify(['Espresso', 'Cafetera automática', 'Moka']),
    certifications: JSON.stringify(['Café de Colombia']),
    acidity: 3, body: 4, sweetness: 4, bitterness: 2,
    featured: false, bestSeller: true, isNew: false,
    basePrice: 33500,
  },
  // 18. Descafeinado Suizo
  {
    name: 'Descafeinado Suizo',
    slug: 'descafeinado-suizo',
    sku: 'MON-DEC-SUI-018',
    categorySlug: 'cafe-en-grano',
    shortDescription: 'Descafeinado natural con caña de azúcar: 100% sabor sin cafeína.',
    description: 'Proceso Sugar Cane con acetato de etilo de melaza de caña. Conserva intactos los azúcares naturales y aceites del café de Huila sin químicos clorados.',
    origin: 'San Agustín, Huila',
    farm: 'Cooperativa San Agustín',
    altitude: '1.700 msnm',
    variety: 'Castillo',
    process: 'Descafeinado Caña de Azúcar',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Chocolate derretido', 'Panela', 'Ciruela roja', 'Manzana horneada']),
    cuppingScore: 84.75,
    brewMethods: JSON.stringify(['Espresso', 'Prensa Francesa', 'Filtro']),
    certifications: JSON.stringify(['100% Libre de Químicos Clorados']),
    acidity: 2, body: 4, sweetness: 5, bitterness: 2,
    featured: false, bestSeller: false, isNew: false,
    basePrice: 36000,
  },
  // 19. Cold Brew Blend
  {
    name: 'Cold Brew Blend',
    slug: 'cold-brew-blend',
    sku: 'MON-COL-BRE-019',
    categorySlug: 'cafe-molido',
    shortDescription: 'Molienda extra gruesa calibrada para extracción lenta en frío de 16 horas.',
    description: 'Mezcla formulada para infusión prolongada sin acidez cortante ni amargura. Bebida refrescante con notas sedosas a cacao y caramelo.',
    origin: 'Santander & Huila',
    farm: 'Blend Artesanal',
    altitude: '1.650 msnm',
    variety: 'Castillo',
    process: 'Lavado',
    roastLevel: 'Medio-Oscuro',
    flavorNotes: JSON.stringify(['Chocolate amargo', 'Caramelo frío', 'Nuez']),
    cuppingScore: 84.5,
    brewMethods: JSON.stringify(['Cold Brew maceración', 'Prensa Francesa fría']),
    certifications: JSON.stringify(['Café 100% Colombiano']),
    acidity: 1, body: 5, sweetness: 4, bitterness: 2,
    featured: false, bestSeller: false, isNew: false,
    basePrice: 32000,
  },
  // 20. Espresso Intenso
  {
    name: 'Espresso Intenso',
    slug: 'espresso-intenso',
    sku: 'MON-ESP-INT-020',
    categorySlug: 'cafe-molido',
    shortDescription: 'Cuerpo espeso y crema persistente para portafiltro o cafetera Moka.',
    description: 'Tostión medio-oscura que carameliza los azúcares y otorga una crema avellanada elástica ideal para cortados y cappuccinos.',
    origin: 'Santander & Cauca',
    farm: 'Cooperativas Andinas',
    altitude: '1.650 msnm',
    variety: 'Castillo y Colombia',
    process: 'Lavado',
    roastLevel: 'Medio-Oscuro',
    flavorNotes: JSON.stringify(['Trufa de chocolate', 'Nuez tostada', 'Caramelo tostado', 'Canela']),
    cuppingScore: 85.0,
    brewMethods: JSON.stringify(['Máquina espresso', 'Moka italiana']),
    certifications: JSON.stringify(['Denominación de Origen']),
    acidity: 2, body: 5, sweetness: 3, bitterness: 3,
    featured: false, bestSeller: true, isNew: false,
    basePrice: 34000,
  },
  // 21. Cápsulas Clásicas
  {
    name: 'Cápsulas Clásicas',
    slug: 'capsulas-clasicas',
    sku: 'MON-CAP-CLA-021',
    categorySlug: 'capsulas-y-monodosis',
    shortDescription: 'Caja x10 cápsulas 100% compostables sistema Nespresso Original (Intensidad 8/10).',
    description: 'Café de especialidad de Huila encapsulado en biopolímero biodegradable a base de almidón vegetal. Crema perfecta en 30 segundos sin residuos de aluminio.',
    origin: 'Pitalito, Huila',
    farm: 'La Esperanza',
    altitude: '1.750 msnm',
    variety: 'Castillo',
    process: 'Lavado',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Panela', 'Caramelo', 'Chocolate']),
    cuppingScore: 85.0,
    brewMethods: JSON.stringify(['Máquinas Nespresso Original']),
    certifications: JSON.stringify(['100% Compostable Industrial TÜV Austria']),
    acidity: 3, body: 4, sweetness: 4, bitterness: 2,
    featured: true, bestSeller: true, isNew: false,
    basePrice: 28000,
  },
  // 22. Cápsulas Intensas
  {
    name: 'Cápsulas Intensas',
    slug: 'capsulas-intensas',
    sku: 'MON-CAP-INT-022',
    categorySlug: 'capsulas-y-monodosis',
    shortDescription: 'Caja x10 cápsulas compostables Ristretto Fuerte (Intensidad 10/10).',
    description: 'Para quienes buscan un shot denso y con cuerpo noble para combinar con leche sin perder carácter.',
    origin: 'Santander & Cauca',
    farm: 'Cooperativas Asociadas',
    altitude: '1.600 msnm',
    variety: 'Castillo',
    process: 'Lavado',
    roastLevel: 'Medio-Oscuro',
    flavorNotes: JSON.stringify(['Cacao 85%', 'Nuez moscada', 'Caramelo oscuro']),
    cuppingScore: 84.5,
    brewMethods: JSON.stringify(['Shot Ristretto (25ml)', 'Espresso (40ml)']),
    certifications: JSON.stringify(['Compostable TÜV Austria']),
    acidity: 2, body: 5, sweetness: 3, bitterness: 4,
    featured: false, bestSeller: false, isNew: false,
    basePrice: 28000,
  },
  // 23. Kit Degustación
  {
    name: 'Kit Degustación',
    slug: 'kit-degustacion',
    sku: 'MON-KIT-DEG-023',
    categorySlug: 'kits-y-regalos',
    shortDescription: 'Tres bolsas de 250g: Huila Suave + Nariño Floral + Cauca Sedoso en caja artesanal.',
    description: 'La experiencia de cata completa para viajar por la cordillera colombiana. Incluye rueda de sabores y libreta de barista.',
    origin: 'Huila, Nariño y Cauca',
    farm: 'Tres Fincas de Altura',
    altitude: '1.750 - 2.150 msnm',
    variety: 'Caturra, Castillo y Borbón',
    process: 'Lavado',
    roastLevel: 'Medio',
    flavorNotes: JSON.stringify(['Panela', 'Cítricos', 'Cacao', 'Flores']),
    cuppingScore: 87.0,
    brewMethods: JSON.stringify(['Comparación en mesa de cata', 'V60', 'Chemex']),
    certifications: JSON.stringify(['Caja de Madera y Cera Ecológica']),
    acidity: 4, body: 4, sweetness: 5, bitterness: 2,
    featured: true, bestSeller: true, isNew: false,
    basePrice: 96000,
  },
  // 24. Kit Regalo Premium
  {
    name: 'Kit Regalo Premium',
    slug: 'kit-regalo-premium',
    sku: 'MON-KIT-PRE-024',
    categorySlug: 'kits-y-regalos',
    shortDescription: 'Cafetera V60 Cerámica Blanca Hario + Filtros + 250g Nariño Reserva.',
    description: 'El obsequio soñado para cualquier apasionado del café. Incluye todo lo necesario para preparar filtrados limpios y florales como un profesional en casa.',
    origin: 'Nariño & Japón',
    farm: 'Edición Barista',
    altitude: '2.150 msnm',
    variety: 'Caturra Nariño',
    process: 'Lavado',
    roastLevel: 'Claro',
    flavorNotes: JSON.stringify(['Jazmín', 'Limón Meyer', 'Miel']),
    cuppingScore: 88.0,
    brewMethods: JSON.stringify(['V60 filtrado manual']),
    certifications: JSON.stringify(['Kit Barista Oficial Hario']),
    acidity: 5, body: 3, sweetness: 5, bitterness: 1,
    featured: true, bestSeller: true, isNew: true,
    basePrice: 185000,
  },
];

const REVIEWS_SAMPLES = [
  { rating: 5, title: 'Frescura inigualable y tueste perfecto', comment: 'Llegó con fecha de tostión de solo 4 días atrás. En taza se siente exactamente la descripción de las notas de cata.', brewMethod: 'V60 (Hario)', isVerified: true, helpfulCount: 14 },
  { rating: 5, title: 'El mejor café que he probado en Colombia', comment: 'El dulzor a panela y la acidez jugosa son extraordinarios. Cero amargor quemado.', brewMethod: 'Chemex', isVerified: true, helpfulCount: 9 },
  { rating: 4, title: 'Muy buen balance aromático', comment: 'Recomiendo usar agua a 91°C para que resalten los azúcares naturales. Volveré a pedir.', brewMethod: 'Aeropress', isVerified: true, helpfulCount: 6 },
  { rating: 5, title: 'Excelente para comenzar la mañana', comment: 'El empaque con válvula protege los granos intactos. Calidad de exportación en casa.', brewMethod: 'Prensa Francesa', isVerified: true, helpfulCount: 11 },
  { rating: 4, title: 'Muy agradable con leche de avena', comment: 'Se complementa muy bien en cortado sin perder su carácter frutal.', brewMethod: 'Moka italiana', isVerified: true, helpfulCount: 4 },
];

async function main() {
  console.log('🌱 Iniciando seed de la base de datos Monterojas...');

  // 1. Limpiar datos existentes
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.blogPost.deleteMany();

  // 2. Crear usuario de prueba
  const testUser = await prisma.user.create({
    data: {
      id: 'usr-carlos-1',
      name: 'Carlos Alberto Gómez',
      email: 'carlos@monterojas.co',
      password: 'password123',
      role: 'USER',
      flavorPreferences: JSON.stringify(['Panela', 'Caramelo', 'Jazmín', 'Cacao']),
      addresses: {
        create: [
          {
            label: 'Casa',
            name: 'Carlos Alberto Gómez',
            phone: '+57 310 495 8291',
            street: 'Carrera 43A # 18 Sur - 125 Apto 502',
            city: 'Medellín',
            state: 'Antioquia',
            zipCode: '050022',
            isDefault: true,
          },
        ],
      },
    },
  });
  console.log(`✓ Usuario de prueba creado: ${testUser.email}`);

  // 3. Crear categorías
  const categoryMap = new Map();
  for (const cat of CATEGORIES_DATA) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`✓ ${CATEGORIES_DATA.length} categorías creadas.`);

  // 4. Crear cupones
  await prisma.coupon.createMany({
    data: [
      { code: 'MONTEROJAS10', type: 'percent', value: 10, minOrder: 50000 },
      { code: 'BIENVENIDO', type: 'fixed', value: 10000, minOrder: 60000 },
      { code: 'ENVIOFREE', type: 'fixed', value: 12000, minOrder: 70000 },
    ],
  });
  console.log('✓ Cupones de descuento creados (MONTEROJAS10, BIENVENIDO, ENVIOFREE).');

  // 5. Crear productos con variantes, imágenes y reseñas
  for (let i = 0; i < PRODUCTS_DATA.length; i++) {
    const p = PRODUCTS_DATA[i];
    const categoryId = categoryMap.get(p.categorySlug) || categoryMap.get('cafe-en-grano');

    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        shortDescription: p.shortDescription,
        description: p.description,
        origin: p.origin,
        farm: p.farm,
        altitude: p.altitude,
        variety: p.variety,
        process: p.process,
        roastLevel: p.roastLevel,
        flavorNotes: p.flavorNotes,
        cuppingScore: p.cuppingScore,
        brewMethods: p.brewMethods,
        certifications: p.certifications,
        acidity: p.acidity,
        body: p.body,
        sweetness: p.sweetness,
        bitterness: p.bitterness,
        featured: p.featured,
        bestSeller: p.bestSeller,
        isNew: p.isNew,
        active: true,
        categoryId: categoryId,
      },
    });

    // Variantes: 250g, 500g, 1000g para cada molienda
    const weights = [
      { weight: 250, multiplier: 1.0 },
      { weight: 500, multiplier: 1.85 },
      { weight: 1000, multiplier: 3.4 },
    ];

    for (const w of weights) {
      const price = Math.round((p.basePrice * w.multiplier) / 1000) * 1000;
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          weight: w.weight,
          grind: 'En grano',
          price: price,
          comparePrice: Math.round(price * 1.1),
          stock: 30 + (i * 3) % 40,
          sku: `${p.sku}-${w.weight}G-GRA`,
        },
      });
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          weight: w.weight,
          grind: 'Molienda media (V60/Filtro)',
          price: price,
          comparePrice: Math.round(price * 1.1),
          stock: 25 + (i * 2) % 30,
          sku: `${p.sku}-${w.weight}G-MED`,
        },
      });
    }

    // 3 imágenes SVG placeholder generadas para cada producto
    for (let v = 1; v <= 3; v++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: `/images/products/${p.slug}-${v}.svg`,
          alt: `${p.name} - Presentación ${v}`,
          displayOrder: v,
        },
      });
    }

    // 3 a 5 reseñas por producto
    const numReviews = 3 + (i % 3);
    for (let r = 0; r < numReviews; r++) {
      const sample = REVIEWS_SAMPLES[(i + r) % REVIEWS_SAMPLES.length];
      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          userId: testUser.id,
          rating: sample.rating,
          title: sample.title,
          content: sample.comment,
          brewMethod: sample.brewMethod,
          isVerified: sample.isVerified,
          helpfulCount: sample.helpfulCount + r,
          status: 'approved',
        },
      });
    }
  }
  console.log(`✓ ${PRODUCTS_DATA.length} productos con variantes, imágenes y reseñas creados.`);

  // 6. Artículos de Blog
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Cómo preparar el V60 perfecto como un barista campeón',
        slug: 'como-preparar-el-v60-perfecto',
        excerpt: 'Ratios, temperatura exacta del agua, molienda y la técnica de vertido circular para lograr una taza dulce y balanceada.',
        content: 'El gotero V60 es una de las herramientas más nobles para resaltar las notas florales y cítricas del café de especialidad...',
        image: '/images/blog/como-preparar-el-v60-perfecto.svg',
        author: 'Andrés Camargo (Head Barista)',
        publishedAt: new Date(),
      },
      {
        title: 'Guía completa de métodos de preparación',
        slug: 'guia-de-metodos-de-preparacion',
        excerpt: 'De la prensa francesa al Chemex: descubre qué método se adapta mejor a tu rutina y preferencias sensoriales.',
        content: 'Cada método de extracción desbloquea diferentes compuestos solubles en el grano de café...',
        image: '/images/blog/guia-de-metodos-de-preparacion.svg',
        author: 'Sofía Montoya (Catadora Q)',
        publishedAt: new Date(),
      },
      {
        title: 'El proceso del café: de la cereza a la taza',
        slug: 'el-proceso-del-cafe-de-la-cereza-a-la-taza',
        excerpt: 'Descubre las diferencias entre proceso Lavado, Honey y Natural y cómo influyen en el sabor final.',
        content: 'La recolección selectiva punto uva y el beneficio ecológico son el alma de la calidad colombiana...',
        image: '/images/blog/el-proceso-del-cafe-de-la-cereza-a-la-taza.svg',
        author: 'Julián Rojas (Tostador Máster)',
        publishedAt: new Date(),
      },
    ],
  });
  console.log('✓ Publicaciones de blog creadas.');

  console.log('🎉 Seed completado exitosamente en SQLite dev.db.');
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
