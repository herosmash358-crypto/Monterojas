import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/" className="hover:text-espresso">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Términos y Privacidad</span>
      </nav>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-tierra flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-bosque" /> Legal y Seguridad
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mt-1">
          Términos de Servicio y Privacidad
        </h1>
        <p className="text-xs sm:text-sm text-tierra mt-2">
          Monterojas Café de Colombia SAS · NIT 901.482.109-3
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-lino shadow-soft space-y-6 text-xs sm:text-sm text-tierra leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-espresso">
            1. Objeto y Generalidades
          </h2>
          <p>
            El presente sitio web es operado por Monterojas Café de Colombia SAS. A través de este portal ofrecemos café de especialidad tostado en grano o molido, cápsulas compostables y accesorios de preparación bajo la legislación colombiana (Ley 1480 de 2011 - Estatuto del Consumidor).
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-lino">
          <h2 className="font-serif font-bold text-lg text-espresso">
            2. Precios e Impuestos
          </h2>
          <p>
            Todos los precios mostrados en la tienda están expresados en pesos colombianos (COP) e incluyen el IVA aplicable según la legislación tributaria vigente.
          </p>
        </section>

        <section id="privacidad" className="space-y-2 pt-4 border-t border-lino">
          <h2 className="font-serif font-bold text-lg text-espresso">
            3. Política de Privacidad y Tratamiento de Datos (Habeas Data)
          </h2>
          <p>
            En cumplimiento de la Ley 1581 de 2012, informamos que los datos personales recolectados durante el proceso de compra o suscripción (nombre, dirección, teléfono, correo) serán utilizados exclusivamente para gestionar el despacho de tus pedidos, la facturación electrónica y enviarte información relevante sobre cosechas si así lo autorizas.
          </p>
          <p>
            Monterojas no vende, arrienda ni comparte tus datos personales con terceros para fines comerciales o publicitarios ajenos a la prestación del servicio.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-lino">
          <h2 className="font-serif font-bold text-lg text-espresso">
            4. Pasarelas de Pago Seguras
          </h2>
          <p>
            Las transacciones con tarjeta de crédito, PSE y Nequi son procesadas a través de pasarelas certificadas PCI-DSS con cifrado SSL de 256 bits. Monterojas nunca almacena los números completos ni los códigos de seguridad (CVV) de tus tarjetas.
          </p>
        </section>
      </div>
    </div>
  );
}
