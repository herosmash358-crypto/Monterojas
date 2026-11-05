import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Award,
  Truck,
  Flame,
  CheckCircle2,
  MapPin,
  Coffee,
  HeartHandshake,  cd /d "C:\Users\heros\Desktop\Monterojas"
  npm run dev
  BookOpen,
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { TasteAssistant } from '@/components/home/TasteAssistant';
import { getProducts, getCategories, getBlogPosts } from '@/lib/server/catalog';

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();
  const blogPosts = await getBlogPosts();

  const featuredBestsellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const microlotes = products
    .filter((p) => p.categorySlug === 'cafes-especiales-microlotes')
    .slice(0, 3);

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. HERO SECTION: El café como protagonista absoluto */}
      <section className="relative min-h-[580px] lg:min-h-[660px] bg-espresso text-crema flex items-center overflow-hidden">
        {/* Background Coffee Imagery with warm natural light */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=85"
            alt="Granos de café colombiano recién tostados con vapor aromático"
            fill
            priority
            className="object-cover opacity-35 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-espresso/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 bg-bosque/80 text-salvia-light border border-salvia/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-ocre" /> Tostión Artesanal · Cosecha 2026
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-crema leading-[1.12]">
              Café de origen, <br />
              <span className="text-ocre italic font-normal">tostado con alma</span> <br />
              de montaña.
            </h1>

            <p className="text-base sm:text-lg text-crema/85 max-w-xl font-normal leading-relaxed">
              Cosechado a mano en las alturas de Huila, Nariño y Tierradentro. Tostamos en pequeños lotes semanales para que recibas en tu mesa los aceites puros y aromas florales más frescos de Colombia.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                href="/categorias/cafe-en-grano"
                className="bg-ocre hover:bg-ocre-hover text-espresso font-bold text-sm sm:text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 uppercase tracking-wider"
              >
                Comprar Café Fresco <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categorias/cafes-especiales-microlotes"
                className="border border-lino/40 hover:border-ocre text-crema hover:text-ocre font-semibold text-sm sm:text-base px-7 py-4 rounded-full backdrop-blur-sm transition-colors inline-flex items-center gap-2"
              >
                Explorar Micro-lotes Geisha
              </Link>
            </div>

            {/* Highlights list */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-crema/15 text-xs text-crema/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ocre flex-shrink-0" />
                <span>Tostado hace &lt; 10 días</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-ocre flex-shrink-0" />
                <span>Envío gratis nacional</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-ocre flex-shrink-0" />
                <span>Puntajes 85+ a 89+ SCAA</span>
              </div>
            </div>
          </div>

          {/* Right Hero Product Card: Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-3xl bg-crema-light/95 p-6 shadow-2xl border border-lino text-espresso backdrop-blur-md">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-lino mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80"
                  alt="Montaña Dorada Huila"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-ocre text-espresso text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  Lote Estrella del Mes
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-tierra">
                  <span>📍 Pitalito, Huila · 1.750 msnm</span>
                  <span className="font-bold text-ocre-dark">86.5 SCAA</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso">
                  Montaña Dorada — Huila Suave
                </h3>
                <p className="text-xs text-tierra leading-relaxed">
                  Notas a caramelo de panela, mandarina dulce y chocolate con leche. Fermentación limpia de 24 horas.
                </p>

                <div className="pt-3 border-t border-lino flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-tierra/70 block">Presentación 250g</span>
                    <span className="font-serif text-xl font-bold text-espresso">$34.000 COP</span>
                  </div>
                  <Link
                    href="/producto/montana-dorada-huila-grano"
                    className="bg-ocre hover:bg-ocre-hover text-espresso text-xs font-bold px-5 py-2.5 rounded-full transition-all"
                  >
                    Ver Ficha
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORÍAS PRINCIPALES (Tarjetas visuales inspiradas en la naturaleza) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-tierra">Nuestra Despensa</span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso mt-1">
              Explora por Método y Tipo de Café
            </h2>
          </div>
          <Link
            href="/categorias/cafes-de-origen"
            className="text-xs font-bold text-ocre hover:text-ocre-dark uppercase tracking-wider flex items-center gap-1.5 self-start md:self-auto"
          >
            Ver catálogo completo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-lino shadow-soft hover:shadow-card hover:border-tierra/40 transition-all p-3 flex flex-col items-center text-center text-espresso"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-crema mb-2.5">
                <Image
                  src={cat.bannerImage}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-sm text-espresso group-hover:text-ocre transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-tierra/70 line-clamp-1 mt-0.5">
                {cat.subcategories.length} variantes
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. MÁS VENDIDOS: EL PRODUCTO AL CENTRO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-ocre font-bold text-xs uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-current" /> Favoritos de Nuestros Clientes
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso">
              Los Cafés Más Despachados Esta Semana
            </h2>
          </div>
          <Link
            href="/categorias/cafe-en-grano"
            className="text-xs font-bold text-ocre hover:text-ocre-dark uppercase tracking-wider flex items-center gap-1.5"
          >
            Ver todos los granos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBestsellers.map((prod, idx) => (
            <ProductCard key={prod.id} product={prod} priority={idx === 0} />
          ))}
        </div>
      </section>

      {/* 4. ASISTENTE SENSORIAL: "Encuentra tu Café Ideal" */}
      <TasteAssistant products={products} />

      {/* 5. MICRO-LOTES & GEISHA: EDICIÓN LIMITADA */}
      <section className="bg-espresso text-crema py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-ocre flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Micro-lotes de Alta Gama (Puntaje 88+)
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-crema mt-1">
                La Cúspide de la Caficultura Colombiana
              </h2>
              <p className="text-xs sm:text-sm text-crema/70 max-w-xl mt-2">
                Varietales botánicos raros y fermentaciones de autor producidas en microlotes de menos de 100 sacos por cosecha.
              </p>
            </div>
            <Link
              href="/categorias/cafes-especiales-microlotes"
              className="bg-ocre hover:bg-ocre-hover text-espresso font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all self-start md:self-auto"
            >
              Ver Todos los Micro-lotes
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {microlotes.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. HISTORIA DE ORIGEN: ALMA DE MONTAÑA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden bg-lino shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80"
              alt="Caficultor recolectando cerezas rojas maduras en las montañas de Colombia"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-crema">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ocre block mb-1">
                Trazabilidad 100%
              </span>
              <p className="font-serif text-lg font-bold">
                &ldquo;El café no es una mercancía masiva; es el fruto sagrado de la tierra andina y el sudor de nuestras familias.&rdquo;
              </p>
              <p className="text-xs text-salvia mt-1">— Don Álvaro Gómez, Finca La Esperanza, Huila</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-tierra">
              Filosofía Monterojas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso leading-tight">
              Honramos a quienes siembran en las pendientes imposibles.
            </h2>
            <p className="text-sm text-tierra leading-relaxed">
              En Colombia, las montañas son verticales y el café no se recolecta con tractores ni máquinas: se recolecta a mano, cereza por cereza, seleccionando únicamente el grano en su punto óptimo de maduración.
            </p>
            <p className="text-sm text-tierra leading-relaxed">
              Pagamos precios que superan en hasta un 70% el estándar internacional de la Bolsa de Nueva York. Porque creemos que un café extraordinario solo nace cuando el campesino caficultor vive con dignidad y orgullo.
            </p>

            <div className="pt-2 flex flex-wrap gap-6">
              <div>
                <span className="font-serif text-3xl font-bold text-ocre-dark block">+6 Regiones</span>
                <span className="text-xs text-tierra font-medium">Desde Nariño hasta Sierra Nevada</span>
              </div>
              <div>
                <span className="font-serif text-3xl font-bold text-bosque block">0 Intermediarios</span>
                <span className="text-xs text-tierra font-medium">Directo de finca a tostaduría</span>
              </div>
              <div>
                <span className="font-serif text-3xl font-bold text-espresso block">100% Compostable</span>
                <span className="text-xs text-tierra font-medium">Bolsas y cápsulas bioplásticas</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/nuestra-historia"
                className="inline-flex items-center gap-2 text-xs font-bold text-ocre-dark hover:text-ocre uppercase tracking-wider"
              >
                Conoce a nuestros caficultores y orígenes &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BLOG & GUÍAS DE PREPARACIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-tierra">Aprende con Nosotros</span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso mt-1">
              Guías de Preparación & Cultura Barista
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold text-ocre hover:text-ocre-dark uppercase tracking-wider flex items-center gap-1.5"
          >
            Ver todos los artículos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-lino overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-lino">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-crema-light/95 backdrop-blur-sm text-espresso text-[10px] font-bold px-2.5 py-1 rounded-full border border-lino">
                  {post.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-tierra/70 block mb-1">
                    {post.date} · {post.readTime}
                  </span>
                  <h3 className="font-serif font-bold text-base text-espresso group-hover:text-ocre transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-tierra mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-lino flex items-center justify-between text-xs text-ocre font-bold">
                  <span>Leer guía completa</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
