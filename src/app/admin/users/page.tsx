'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  orderCount: number;
  createdAt: string;
}

const ROLE_OPTIONS = ['USER', 'ADMIN'];

const ROLE_LABELS: Record<string, string> = {
  USER: 'Cliente',
  ADMIN: 'Administrador',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      setError('No se pudo cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(id: string, role: string) {
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      loadUsers();
    } catch (e) {
      setError('No se pudo actualizar el rol.');
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Gestión de Usuarios
        </h1>
        <p className="text-sm text-tierra mt-1">
          Administra las cuentas de clientes y administradores.
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
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-right px-4 py-3">Rol</th>
              <th className="text-right px-4 py-3">Órdenes</th>
              <th className="text-center px-4 py-3">Registrado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-tierra">
                  Cargando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-tierra">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-b border-lino/50 hover:bg-crema/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-espresso">{u.name}</div>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-tierra font-mono">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Select
                      options={ROLE_OPTIONS.map((r) => ({
                        value: r,
                        label: ROLE_LABELS[r] ?? r,
                      }))}
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u.id, (e.target as HTMLSelectElement).value)
                      }
                      placeholder={ROLE_LABELS[u.role] ?? u.role}
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-tierra font-medium">
                    {u.orderCount}
                  </td>
                  <td className="px-4 py-3 text-center text-[10px] text-tierra">
                    {new Date(u.createdAt).toLocaleDateString('es-CO')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80"
        />
        <Button variant="outline" size="sm" onClick={loadUsers}>
          Refrescar
        </Button>
      </div>
    </div>
  );
}
