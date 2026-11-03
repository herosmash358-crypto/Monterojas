'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  itemCount: number;
}

const STATUS_OPTIONS = [
  'pendiente',
  'confirmado',
  'en_tostion',
  'en_camino',
  'entregado',
  'cancelado',
];

const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  en_tostion: 'En Tostión',
  en_camino: 'En Camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      setError('No se pudo cargar las órdenes.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadOrders();
    } catch (e) {
      setError('No se pudo actualizar el estado.');
    }
  }

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Gestión de Órdenes
        </h1>
        <p className="text-sm text-tierra mt-1">
          Revisa y actualiza el estado de los pedidos.
        </p>
      </div>

      {error && (
        <div className="bg-alerta-error/10 border border-alerta-error/30 text-alerta-error text-xs px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="-mx-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-lino text-tierra uppercase text-[10px] font-semibold">
              <th className="text-left px-4 py-3">Número</th>
              <th className="text-left px-4 py-3">Cliente</th>
              <th className="text-right px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Pago</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-center px-4 py-3">Fecha</th>
              <th className="text-right px-4 py-3">Ítems</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-tierra">
                  Cargando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-tierra">
                  No se encontraron órdenes.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="border-b border-lino/50 hover:bg-crema/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono font-medium text-espresso">
                      {o.orderNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-espresso font-medium">{o.customerName}</div>
                    <div className="text-[10px] text-tierra/60">
                      {o.customerEmail}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Select
                      options={STATUS_OPTIONS.map((s) => ({
                        value: s,
                        label: STATUS_LABELS[s] ?? s,
                      }))}
                      value={o.status}
                      onChange={(e) =>
                        handleStatusChange(
                          o.id,
                          (e.target as HTMLSelectElement).value
                        )
                      }
                      placeholder={STATUS_LABELS[o.status] ?? o.status}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge
                      variant={
                        o.paymentStatus === 'aprobado' ? 'default' : 'secondary'
                      }
                      className="text-[10px] px-2 py-1"
                    >
                      {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-espresso font-medium">
                    ${o.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3 text-center text-[10px] text-tierra">
                    {new Date(o.createdAt).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-4 py-3 text-right text-tierra font-medium">
                    {o.itemCount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar por número o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80"
        />
        <Button variant="outline" size="sm" onClick={loadOrders}>
          Refrescar
        </Button>
      </div>
    </div>
  );
}
