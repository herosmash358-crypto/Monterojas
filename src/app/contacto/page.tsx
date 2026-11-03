'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, CheckCircle2, MessageSquare, ChevronRight } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Café de Especialidad', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/" className="hover:text-espresso">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Contacto & Cafeterías</span>
      </nav>

      <div className="max-w-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-tierra">
          Estamos para ayudarte
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mt-1">
          Hablemos de Buen Café
        </h1>
        <p className="text-xs sm:text-sm text-tierra mt-2 leading-relaxed">
          ¿Tienes dudas sobre qué molienda elegir para tu cafetera, pedidos institucionales o alianzas de café para tu negocio? Escríbenos directamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-lino shadow-soft space-y-3">
            <h3 className="font-serif font-bold text-base text-espresso flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-ocre" /> Atención Rápida por WhatsApp
            </h3>
            <p className="text-xs text-tierra leading-relaxed">
              Nuestro equipo de baristas responde tus preguntas sobre métodos, ratios y estado de envíos en minutos.
            </p>
            <p className="text-sm font-bold text-bosque">+57 310 892 4150</p>
            <span className="text-[11px] text-tierra/70 block">Lunes a Sábado: 8:00 AM - 6:00 PM</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-lino shadow-soft space-y-3">
            <h3 className="font-serif font-bold text-base text-espresso flex items-center gap-2">
              <Mail className="w-5 h-5 text-bosque" /> Correo Electrónico
            </h3>
            <p className="text-xs text-tierra">
              Escríbenos para consultas sobre pedidos, cuentas empresariales o suscripciones:
            </p>
            <p className="text-sm font-bold text-espresso">hola@monterojas.co</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-lino shadow-soft space-y-3">
            <h3 className="font-serif font-bold text-base text-espresso flex items-center gap-2">
              <MapPin className="w-5 h-5 text-ocre" /> Tostaduría y Laboratorio
            </h3>
            <p className="text-xs text-tierra">
              Monterojas Café de Colombia SAS<br />
              Carrera 43A # 14 - 85, El Poblado<br />
              Medellín, Antioquia, Colombia
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-lino shadow-card">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-salvia/40 text-bosque mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-espresso">
                ¡Mensaje recibido con éxito!
              </h3>
              <p className="text-xs sm:text-sm text-tierra max-w-sm mx-auto">
                Uno de nuestros baristas te responderá al correo <strong>{formData.email}</strong> en menos de 24 horas hábiles.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-ocre hover:underline pt-2 block mx-auto"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-serif font-bold text-xl text-espresso mb-2">
                Envíanos tu consulta
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-tierra uppercase">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-tierra uppercase">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@correo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-tierra uppercase">Teléfono Móvil</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+57 300 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-tierra uppercase">Motivo</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso cursor-pointer"
                  >
                    <option value="Duda sobre molienda y métodos">Duda sobre molienda y métodos</option>
                    <option value="Estado de mi pedido">Estado de mi pedido</option>
                    <option value="Café para empresas y eventos">Café para empresas y eventos</option>
                    <option value="Suscripciones mensuales">Suscripciones mensuales</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-tierra uppercase">Mensaje</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  className="w-full p-3.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-ocre hover:bg-ocre-hover text-espresso font-bold text-xs uppercase tracking-wider py-4 rounded-full shadow-md transition-all mt-2"
              >
                Enviar Mensaje
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
