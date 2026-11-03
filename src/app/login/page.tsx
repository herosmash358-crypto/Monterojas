'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

interface AuthMode {
  type: 'login' | 'register';
}

export default function LoginPage() {
  const router = useRouter();
  const { login, register, errorLogin, errorRegister } = useStore();
  const [mode, setMode] = useState<AuthMode>({ type: 'login' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode.type === 'login') {
        const ok = await login(email, password);
        if (ok) {
          router.push('/');
        }
      } else {
        if (password !== confirmPassword) {
          // Error manejado por el store, pero mostramos aquí también
          return;
        }
        const ok = await register(name, email, password);
        if (ok) {
          router.push('/');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-crema/50 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-10 border border-lino shadow-soft space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl font-bold text-espresso">Monterojas</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
            {mode.type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-xs text-tierra mt-2">
            {mode.type === 'login'
              ? 'Accede a tu cuenta para ver tus pedidos y direcciones.'
              : 'Únete a la comunidad de caficultores de corazón.'}
          </p>
        </div>

        {errorLogin && (
          <div className="bg-alerta-error/10 border border-alerta-error/30 text-alerta-error text-xs px-4 py-3 rounded-xl">
            {errorLogin}
          </div>
        )}
        {errorRegister && (
          <div className="bg-alerta-error/10 border border-alerta-error/30 text-alerta-error text-xs px-4 py-3 rounded-xl">
            {errorRegister}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode.type === 'register' && (
            <div className="space-y-1">
              <label htmlFor="name" className="font-bold text-tierra uppercase text-[11px]">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Carlos Alberto Gómez"
                className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="font-bold text-tierra uppercase text-[11px]">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tierra/60" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos@ejemplo.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="font-bold text-tierra uppercase text-[11px]">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tierra/60" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                required
              />
            </div>
          </div>

          {mode.type === 'register' && (
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="font-bold text-tierra uppercase text-[11px]">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tierra/60" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                  required
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
            variant="primary"
            size="md"
          >
            {isSubmitting ? (
              <>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                {mode.type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="pt-6 border-t border-lino space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-lino/60"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase text-tierra">
              <span className="px-4 bg-white">O continúa con</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 py-2.5 rounded-xl border border-lino text-tierra hover:bg-crema-light transition-colors text-xs font-semibold flex items-center justify-center gap-2"
            >
              <UserIcon className="w-4 h-4" /> Google
            </button>
          </div>

          <p className="text-xs text-tierra text-center">
            {mode.type === 'login'
              ? '¿No tienes cuenta? '
              : '¿Ya tienes cuenta? '}
            <button
              onClick={() => setMode(mode.type === 'login' ? { type: 'register' } : { type: 'login' })}
              className="font-bold text-ocre hover:text-ocre-dark"
            >
              {mode.type === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>

          <Link
            href="/"
            className="block text-center text-xs font-bold text-espresso uppercase tracking-wider hover:text-ocre-dark"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
