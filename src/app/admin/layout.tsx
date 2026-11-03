import { getServerAddresses } from '@/lib/server/addresses';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const cookieStore = cookies();
  const userId = cookieStore.get('monterojas_auth')?.value;

  if (!userId) {
    redirect('/login?callbackUrl=/admin');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin');
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Productos', href: '/admin/products', icon: '☕' },
    { name: 'Categorías', href: '/admin/categories', icon: '📁' },
    { name: 'Órdenes', href: '/admin/orders', icon: '📦' },
    { name: 'Usuarios', href: '/admin/users', icon: '👥' },
  ];

  return (
    <div className="flex h-screen flex-col lg:flex-row overflow-hidden bg-crema/50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-espresso text-crema">
        <div className="p-6 border-b border-tierra/30">
          <span className="text-xl font-serif font-bold text-ocre">Monterojas</span>
          <p className="text-xs text-crema/70 mt-1">Panel de Administración</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = typeof window !== 'undefined'
              ? window.location.pathname === item.href
              : false;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-ocre text-espresso font-bold'
                    : 'text-crema/90 hover:bg-tierra/30 hover:text-crema'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-tierra/30">
          <a
            href="/"
            className="flex items-center gap-2 text-xs text-crema/80 hover:text-crema transition-colors"
          >
            <span>←</span> Volver a la tienda
          </a>
          <button
            onClick={() => {
              document.cookie =
                'monterojas_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              window.location.href = '/login';
            }}
            className="mt-2 flex items-center gap-2 text-xs text-crema/60 hover:text-crema transition-colors"
          >
            <span>🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12">
        {children}
      </main>
    </div>
  );
}
