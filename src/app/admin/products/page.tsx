'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trash2,
  Edit,
  Plus,
  Search,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categoryName: string | null;
  price: number;
  stock: number;
  active: boolean;
  isBestseller: boolean;
  isNew: boolean;
  featured: boolean;
  reviewCount: number;
}

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  tagline: string;
  categoryId: string;
  price: string;
  stock: string;
  weightLabel: string;
  grind: string;
  active: boolean;
  isBestseller: boolean;
  isNew: boolean;
  featured: boolean;
}

const DEFAULT_FORM: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  tagline: '',
  categoryId: '',
  price: '',
  stock: '',
  weightLabel: '250g',
  grind: 'En grano',
  active: true,
  isBestseller: false,
  isNew: false,
  featured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      setError('No se pudo cargar los productos.');
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories((data.categories || []).map((c: any) => ({ id: c.id, name: c.name })));
    } catch (e) {
      // Ignorar error de categorías
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      tagline: form.tagline,
      categoryId: form.categoryId || undefined,
      price: form.price,
      stock: form.stock,
      weightLabel: form.weightLabel,
      grind: form.grind,
      active: form.active,
      isBestseller: form.isBestseller,
      isNew: form.isNew,
      featured: form.featured,
    };

    try {
      if (editingId) {
        await fetch(`/api/admin/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setOpen(false);
      setForm(DEFAULT_FORM);
      setEditingId(null);
      loadProducts();
    } catch (e) {
      setError('No se pudo guardar el producto.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      loadProducts();
    } catch (e) {
      setError('No se pudo eliminar el producto.');
    }
  }

  function handleEdit(p: AdminProduct) {
    // Cargar datos del producto en el formulario (simplificado)
    setEditingId(p.id);
    setForm({
      ...DEFAULT_FORM,
      name: p.name,
      slug: p.slug,
      active: p.active,
      isBestseller: p.isBestseller,
      isNew: p.isNew,
      featured: p.featured,
    });
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Gestión de Productos
          </h1>
          <p className="text-sm text-tierra mt-1">
            Administra el catálogo de café de Monterojas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
            leftIcon={<Search className="w-4 h-4 text-tierra/60" />}
          />
          <Button onClick={() => { setEditingId(null); setForm(DEFAULT_FORM); setOpen(true); }}>
            <Plus className="w-4 h-4" /> Nuevo
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
              <th className="text-left px-4 py-3">Producto</th>
              <th className="text-left px-4 py-3">SKU</th>
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-right px-4 py-3">Precio</th>
              <th className="text-right px-4 py-3">Stock</th>
              <th className="text-center px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
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
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-lino/50 hover:bg-crema/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-espresso">{p.name}</div>
                    <div className="text-[10px] text-tierra/60">
                      {p.reviewCount} reseñas
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-tierra font-mono">
                    {p.sku}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-tierra">
                      {p.categoryName || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-espresso font-medium">
                    ${p.price.toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3 text-right text-tierra font-medium">
                    {p.stock}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant={p.active ? 'default' : 'secondary'}
                      className="text-[10px] px-2 py-1"
                    >
                      {p.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(p)}
                      className="text-[10px] px-2 py-1.5"
                    >
                      <Edit className="w-3 h-3" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(p.id)}
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-espresso">
                {editingId ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cerrar
              </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Categoría
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Sin categoría' },
                      ...categories.map((c) => ({
                        value: c.id,
                        label: c.name,
                      })),
                    ]}
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({ ...form, categoryId: (e.target as HTMLSelectElement).value })
                    }
                    placeholder="Seleccionar categoría..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tierra uppercase">
                    Precio (COP)
                  </label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tierra uppercase">
                    Tagline
                  </label>
                  <Input
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tierra uppercase">
                    Peso
                  </label>
                  <Input
                    value={form.weightLabel}
                    onChange={(e) =>
                      setForm({ ...form, weightLabel: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tierra uppercase">
                    Molienda
                  </label>
                  <Input
                    value={form.grind}
                    onChange={(e) => setForm({ ...form, grind: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tierra uppercase">
                    Stock
                  </label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-lino/50">
                <div className="flex items-center gap-2">
                  <input
                    id="active"
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm({ ...form, active: e.target.checked })
                    }
                    className="rounded text-ocre focus:ring-ocre accent-ocre w-4 h-4"
                  />
                  <label htmlFor="active" className="text-sm text-tierra">
                    Activo
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="isBestseller"
                    type="checkbox"
                    checked={form.isBestseller}
                    onChange={(e) =>
                      setForm({ ...form, isBestseller: e.target.checked })
                    }
                    className="rounded text-ocre focus:ring-ocre accent-ocre w-4 h-4"
                  />
                  <label htmlFor="isBestseller" className="text-sm text-tierra">
                    Más vendido
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="isNew"
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) =>
                      setForm({ ...form, isNew: e.target.checked })
                    }
                    className="rounded text-ocre focus:ring-ocre accent-ocre w-4 h-4"
                  />
                  <label htmlFor="isNew" className="text-sm text-tierra">
                    Nuevo
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="rounded text-ocre focus:ring-ocre accent-ocre w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm text-tierra">
                    Destacado
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar Producto
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
