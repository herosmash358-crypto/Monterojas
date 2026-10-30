export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  date: string;
  image: string;
  author: {
    name: string;
    role: string;
  };
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'guia-definitiva-preparacion-v60',
    title: 'Guía Definitiva: Cómo preparar café en V60 como un Barista Campeón',
    excerpt: 'Ratios, temperatura exacta del agua, molienda y la técnica de vertido circular para lograr una taza dulce y libre de amargor.',
    readTime: '6 min de lectura',
    category: 'Guías de Preparación',
    date: '24 de Octubre, 2026',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Andrés Camargo',
      role: 'Head Barista en Monterojas',
    },
    content: [
      'El cono de goteo Hario V60 es venerado por entusiastas del café de todo el mundo debido a su capacidad inigualable para destacar las notas florales y la acidez brillante de los cafés de altura.',
      '1. La proporción de oro (Ratio): Comenzamos con una proporción de 1:16 (15 gramos de café recién molido a granulometría media por 240 ml de agua filtrada).',
      '2. La temperatura: Para cafés de tostión clara como nuestro Cielo de Nariño, el agua debe oscilar entre 91°C y 93°C. Nunca uses agua hirviendo a 100°C porque sobreextraerá taninos amargos.',
      '3. El enjuague: Coloca el filtro de papel en el gotero de cerámica y enjuágalo generosamente con agua caliente. Esto elimina los residuos de celulosa y precalienta el cono.',
      '4. La preinfusión (Bloom): Vierte 45 ml de agua en movimientos circulares humedeciendo todo el café. Espera 40 segundos mientras el café libera dióxido de carbono y se hincha formando burbujas doradas.',
      '5. Vertido continuo: Realiza dos vertidos suaves en espiral de centro hacia afuera, manteniendo el flujo constante y sin tocar las paredes del papel. El tiempo total de extracción debe culminar entre los 2:45 y 3:15 minutos.',
    ],
  },
  {
    id: 'post-2',
    slug: 'secretos-prensa-francesa-sin-sedimentos',
    title: 'El secreto de la Prensa Francesa perfecta y sin sedimentos en el fondo',
    excerpt: 'Descubre el método Hoffmann para obtener un cuerpo sedoso, untuoso y una taza limpia usando tu prensa de émbolo.',
    readTime: '5 min de lectura',
    category: 'Técnicas de Extracción',
    date: '16 de Octubre, 2026',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Sofía Montoya',
      role: 'Especialista en Control de Calidad',
    },
    content: [
      'La prensa francesa es a menudo subestimada por dejar un poso arenoso en la última taza. Sin embargo, con un pequeño ajuste en la técnica, se convierte en uno de los métodos más placenteros y reconfortantes.',
      'Usa una molienda gruesa y un ratio 1:15. Tras verter el agua a 94°C, no bajes el émbolo de inmediato.',
      'Deja infusionar el café durante 4 minutos completos con la tapa puesta pero el émbolo arriba.',
      'A los 4 minutos, toma dos cucharas, rompe la costra superficial suavemente y retira la espuma blanca y partículas flotantes.',
      'Deja reposar otros 5 minutos sin tocarlo: la gravedad hará que todos los micro-sedimentos caigan naturalmente al fondo del recipiente.',
      'Coloca el émbolo y bájalo solo hasta la superficie del líquido, sin comprimir la cama de café. ¡Sirve suavemente y disfruta de una textura aterciopelada inigualable!',
    ],
  },
  {
    id: 'post-3',
    slug: 'mitos-del-cafe-guardar-nevera',
    title: '¿Guardar el café en la nevera? Los 5 errores más comunes al conservar el grano',
    excerpt: 'Por qué el frío y la condensación son los peores enemigos del café tostado y cómo preservar la frescura por semanas.',
    readTime: '4 min de lectura',
    category: 'Cultura Cafetera',
    date: '08 de Octubre, 2026',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Julián Rojas',
      role: 'Tostador Máster Monterojas',
    },
    content: [
      'El grano de café tostado es una esponja higroscópica que absorbe con facilidad la humedad y los olores circundantes.',
      'Meter el café al refrigerador expone los granos a los aromas de otros alimentos (cebollas, quesos, lácteos) y genera condensación cada vez que abres el empaque.',
      'La mejor manera de conservarlo: Mantén el café en su empaque original con válvula desgasificadora unidireccional o en una lata hermética opaca a temperatura ambiente en una alacena seca y fresca.',
      'Muele únicamente la cantidad exacta que vas a consumir en el instante. El café molido pierde el 60% de sus aromas volátiles en los primeros 20 minutos de exposición al aire.',
    ],
  },
  {
    id: 'post-4',
    slug: 'terroirs-de-colombia-huila-vs-narino',
    title: 'Duelo de Gigantes: ¿Por qué Huila y Nariño saben tan diferente?',
    excerpt: 'Altitud volcánica, vientos nocturnos y la ciencia detrás de la acidez fosfórica vs. la dulzura acaramelada.',
    readTime: '7 min de lectura',
    category: 'Orígenes y Terroir',
    date: '29 de Septiembre, 2026',
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Julián Rojas',
      role: 'Tostador Máster Monterojas',
    },
    content: [
      'Colombia goza de una bendición geográfica única en el mundo: tres cordilleras andinas que generan valles térmicos y microclimas excepcionales.',
      'En Nariño, la cercanía a la línea del ecuador permite sembrar café a altitudes extremas que superan los 2.200 msnm sin que las plantas sufran heladas.',
      'Por su parte, el Huila se beneficia del cañón del Magdalena, donde las temperaturas cálidas del día alternan con noches frescas provocando una síntesis intensa de fructosa y sacarosa.',
      '¿El veredicto? Si buscas elegancia floral y notas cítricas vivas, Nariño es tu destino; si prefieres un abrazo cálido de panela, chocolate con leche y equilibrio redondo, Huila es el rey indiscutible.',
    ],
  },
];
