import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, CheckCircle2, HeartHandshake, MapPin, Sparkles, ArrowRight } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="relative min-h-[460px] bg-espresso text-crema flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1800&q=80"
            alt="Paisaje de la cordillera cafetera de Colombia"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-ocre bg-espresso/80 px-3.5 py-1.5 rounded-full inline-block backdrop-blur-sm">
            Nuestra Historia
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-crema leading-tight max-w-2xl">
            Café con alma de montaña y respeto a la tierra andina.
          </h1>
          <p className="text-base sm:text-lg text-crema/80 max-w-xl leading-relaxed">
            Monterojas nació con un propósito sencillo: llevar la pureza del café de especialidad colombiano directamente desde las manos que lo cosechan hasta tu taza, sin intermediarios.
          </p>
        </div>
      </section>

      {/* Philosophy Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-lino shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-bosque text-ocre flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-espresso">
              Comercio Directo y Justo
            </h3>
            <p className="text-xs sm:text-sm text-tierra leading-relaxed">
              Pagamos precios que superan ampliamente las cotizaciones de bolsa. Esto garantiza que las familias de Huila, Nariño y Cauca puedan invertir en infraestructura ecológica y educación para las nuevas generaciones de caficultores.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-lino shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-ocre text-espresso flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-espresso">
              Tostión en Origen
            </h3>
            <p className="text-xs sm:text-sm text-tierra leading-relaxed">
              A diferencia de las marcas comerciales que exportan grano verde para ser tostado meses después en otros continentes, nosotros tostamos en Colombia, calibrando cada lote para preservar los terpenos y notas florales intactas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-lino shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-tierra text-crema flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-espresso">
              Micro-lotes & Trazabilidad
            </h3>
            <p className="text-xs sm:text-sm text-tierra leading-relaxed">
              Cada bolsa lleva el nombre del caficultor, el nombre de la finca, la altitud exacta de siembra y la fecha precisa de tostión. Cero misterios: transparencia absoluta en cada taza.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Map / Regions Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-crema-dark rounded-3xl p-8 sm:p-12 border border-lino space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-tierra">
              Geografía Sensorial
            </span>
            <h2 className="font-serif text-3xl font-bold text-espresso mt-1">
              Las Cordilleras que dan Vida a Monterojas
            </h2>
            <p className="text-xs sm:text-sm text-tierra mt-2">
              Colombia cuenta con tres ramales andinos que crean microclimas insuperables:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                region: 'Huila',
                desc: 'Macizo Colombiano. Suelos volcánicos y cañón del río Magdalena. Perfil con dulzura a panela, mandarina dulce y chocolate con leche.',
                score: '86.5 - 89.5 SCAA',
              },
              {
                region: 'Nariño',
                desc: 'Altiplano andino a más de 2.100 msnm. Noches frías que retienen azúcares. Acidez cítrica brillante, limón Meyer y jazmín silvestre.',
                score: '87.5 - 88.5 SCAA',
              },
              {
                region: 'Cauca / Tierradentro',
                desc: 'Resguardos indígenas Nasa. Beneficio ecológico con agua de nacimiento. Textura aterciopelada densa y notas a moras y cacao.',
                score: '86.0 - 87.5 SCAA',
              },
              {
                region: 'Santander',
                desc: 'Caficultura de sombra bajo árboles nativos. Notas a chocolate 80%, madera de cedro y caramelo tostado.',
                score: '84.5 - 85.5 SCAA',
              },
              {
                region: 'Sierra Nevada de Santa Marta',
                desc: 'La montaña litoral más alta del mundo. Cultivado por comunidades Arhuacas en equilibrio con la Madre Tierra.',
                score: '85.0 - 86.0 SCAA',
              },
              {
                region: 'Antioquia',
                desc: 'Suroeste colonial de balcones coloridos. Sabor noble y familiar a caña de azúcar, manzana roja y mantequilla.',
                score: '84.5 - 85.5 SCAA',
              },
            ].map((reg, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-lino shadow-xs space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-lg text-espresso flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-bosque" /> {reg.region}
                  </h3>
                  <span className="text-[10px] font-bold text-ocre-dark bg-crema px-2 py-0.5 rounded-full">
                    {reg.score}
                  </span>
                </div>
                <p className="text-xs text-tierra leading-relaxed">{reg.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/categorias/cafes-de-origen"
              className="inline-flex items-center gap-2 bg-ocre text-espresso font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full hover:bg-ocre-hover shadow-md transition-all"
            >
              Explorar Cafés por Región <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
