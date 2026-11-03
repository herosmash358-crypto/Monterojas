import { getAdminStats } from '@/lib/server/admin';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">Dashboard</h1>
        <p className="text-sm text-tierra mt-1">
          Resumen del estado de tu tostaduría.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-tierra uppercase font-semibold">
                Total Productos
              </p>
              <p className="text-2xl font-serif font-bold text-espresso">
                {stats.totalProducts}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-ocre/10 flex items-center justify-center text-ocre">
              ☕
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-tierra uppercase font-semibold">
                Categorías
              </p>
              <p className="text-2xl font-serif font-bold text-espresso">
                {stats.totalCategories}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-tierra/10 flex items-center justify-center text-tierra">
              📁
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-tierra uppercase font-semibold">
                Órdenes Totales
              </p>
              <p className="text-2xl font-serif font-bold text-espresso">
                {stats.totalOrders}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-bosque/10 flex items-center justify-center text-bosque">
              📦
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-tierra uppercase font-semibold">
                Órdenes Pendientes
              </p>
              <p className="text-2xl font-serif font-bold text-espresso">
                {stats.pendingOrders}
              </p>
            </div>
            <Badge
              variant={
                stats.pendingOrders > 0 ? 'default' : 'secondary'
              }
              className="text-xs"
            >
              {stats.pendingOrders > 0 ? 'Requiere atención' : 'Al día'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Revenue card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-tierra uppercase font-semibold">
              Ingresos Totales (COP)
            </p>
            <p className="text-3xl font-serif font-bold text-espresso">
              ${stats.totalRevenue.toLocaleString('es-CO')}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-espresso/50 flex items-center justify-center text-espresso">
            💰
          </div>
        </div>
      </Card>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col h-full">
          <h3 className="font-serif text-xl font-bold text-espresso mb-4">
            Gestionar Productos
          </h3>
          <p className="text-sm text-tierra mb-6 flex-1">
            Agrega, edita y elimina productos del catálogo.
          </p>
          <a
            href="/admin/products"
            className="mt-auto inline-flex items-center gap-2 bg-ocre text-espresso font-bold text-xs px-4 py-2.5 rounded-full hover:bg-ocre-hover transition-colors"
          >
            Ir a Productos <span>→</span>
          </a>
        </Card>

        <Card className="p-6 flex flex-col h-full">
          <h3 className="font-serif text-xl font-bold text-espresso mb-4">
            Gestionar Órdenes
          </h3>
          <p className="text-sm text-tierra mb-6 flex-1">
            Revisa y actualiza el estado de los pedidos.
          </p>
          <a
            href="/admin/orders"
            className="mt-auto inline-flex items-center gap-2 bg-ocre text-espresso font-bold text-xs px-4 py-2.5 rounded-full hover:bg-ocre-hover transition-colors"
          >
            Ir a Órdenes <span>→</span>
          </a>
        </Card>

        <Card className="p-6 flex flex-col h-full">
          <h3 className="font-serif text-xl font-bold text-espresso mb-4">
            Gestionar Categorías
          </h3>
          <p className="text-sm text-tierra mb-6 flex-1">
            Organiza tu catálogo en categorías.
          </p>
          <a
            href="/admin/categories"
            className="mt-auto inline-flex items-center gap-2 bg-ocre text-espresso font-bold text-xs px-4 py-2.5 rounded-full hover:bg-ocre-hover transition-colors"
          >
            Ir a Categorías <span>→</span>
          </a>
        </Card>
      </div>
    </div>
  );
}
