'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  productCount: number;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  displayOrder: string;
}

const DEFAULT_FORM: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  displayOrder: '0',
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormData>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      setError('No se pudo cargar las categorías.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      displayOrder: Number(form.displayOrder),
    };

    try {
      if (editingId) {
        await fetch(`/api/admin/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setOpen(false);
      setForm(DEFAULT_FORM);
      setEditingId(null);
      loadCategories();
    } catch (e) {
      setError('No se pudo guardar la categoría.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      loadCategories();
    } catch (e) {
      setError('No se pudo eliminar la categoría.');
    }
  }

  function handleEdit(c: AdminCategory) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
      displayOrder: '0',
    });
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Gestión de Categorías
          </h1>
          <p className="text-sm text-tierra mt-1">
            Organiza tu catálogo de café.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar categorías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => { setEditingId(null); setForm(DEFAULT_FORM); setOpen(true); }}>
            <Plus className="w-4 h-4" /> Nueva
          </Button>
        </div>
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
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-right px-4 py-3">Productos</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-tierra">
                  Cargando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-tierra">
                  No se encontraron categorías.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b border-lino/50 hover:bg-crema/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-espresso">{c.name}</div>
                    {c.description && (
                      <div className="text-[10px] text-tierra/60 line-clamp-1">
                        {c.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-tierra font-mono">
                    {c.slug}
                  </td>
                  <td className="px-4 py-3 text-right text-tierra font-medium">
                    {c.productCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(c)}
                      className="text-[10px] px-2 py-1.5"
                    >
                      <Edit className="w-3 h-3" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(c.id)}
                      className="text-[10px] px-2 py-1.5 text-alerta-error hover:bg-alerta-error/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-espresso">
                {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-tierra uppercase">
                  Nombre
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-tierra uppercase">
                  Slug
                </label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-tierra uppercase">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-tierra uppercase">
                  Orden de visualización
                </label>
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm({ ...form, displayOrder: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar Categoría</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
