'use client';

import React, { useMemo, useState } from 'react';
import { ThumbsUp, CheckCircle2, MessageSquare, PenLine } from 'lucide-react';
import { Product } from '@/lib/types';
import { StarRating } from '@/components/product/StarRating';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';

interface ProductReviewsProps {
  product: Product;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const { reviews, addReview, markReviewHelpful } = useStore();

  const productReviews = useMemo(() => reviews[product.id] || [], [reviews, product.id]);

  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formMethod, setFormMethod] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Distribution for the summary panel
  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    for (const r of productReviews) {
      const idx = Math.max(0, Math.min(4, Math.round(r.rating) - 1));
      dist[idx]++;
    }
    return dist;
  }, [productReviews]);

  const average = useMemo(() => {
    if (productReviews.length === 0) return product.rating;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  }, [productReviews, product.rating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formComment.trim()) return;

    addReview({
      productId: product.id,
      userName: 'Cliente Verificado',
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      brewMethod: formMethod.trim() || undefined,
    });

    setSubmitted(true);
    setShowForm(false);
    setFormTitle('');
    setFormComment('');
    setFormMethod('');
  };

  return (
    <section id="resenas" className="scroll-mt-28 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-espresso">
          Reseñas del producto
        </h2>
        {!showForm && (
          <Button
            variant="outline"
            size="sm"
            icon={<PenLine className="w-4 h-4" />}
            onClick={() => setShowForm(true)}
          >
            Escribir reseña
          </Button>
        )}
      </div>

      {/* Summary panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-white border border-lino rounded-craft p-6 shadow-soft">
        <div className="text-center md:text-left">
          <p className="font-serif text-5xl font-bold text-espresso">{average}</p>
          <div className="mt-2">
            <StarRating rating={average} />
          </div>
          <p className="text-xs text-tierra mt-1">
            Basado en {Math.max(productReviews.length, product.reviewCount)} reseñas verificadas
          </p>
        </div>
        {/* Bars */}
        <div className="md:col-span-2 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars - 1];
            const pct = productReviews.length > 0 ? Math.round((count / productReviews.length) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-6 text-tierra font-semibold text-right">{stars}★</span>
                <div className="flex-1 h-2 bg-lino/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ocre rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-tierra/60">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write review form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-lino rounded-craft p-6 space-y-4 shadow-soft"
        >
          <h3 className="font-serif text-lg font-bold text-espresso">Comparte tu experiencia</h3>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-tierra">Tu calificación</span>
            <div>
              <StarRating
                rating={formRating}
                interactive
                size="lg"
                onRatingChange={setFormRating}
                showNumeric
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="review-title" className="text-xs font-semibold text-tierra">
              Título de tu reseña
            </label>
            <input
              id="review-title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ej: Dulzor increíble, aroma florido"
              className="w-full border-2 border-lino rounded-xl px-4 py-2.5 text-sm bg-crema-light/60 focus:border-ocre focus:outline-none placeholder:text-tierra/40"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="review-comment" className="text-xs font-semibold text-tierra">
              Tu reseña
            </label>
            <textarea
              id="review-comment"
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              rows={4}
              placeholder="Cuéntanos sobre el aroma, sabor y método de preparación"
              className="w-full border-2 border-lino rounded-xl px-4 py-2.5 text-sm bg-crema-light/60 focus:border-ocre focus:outline-none placeholder:text-tierra/40 resize-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="review-method" className="text-xs font-semibold text-tierra">
              Método de preparación (opcional)
            </label>
            <input
              id="review-method"
              value={formMethod}
              onChange={(e) => setFormMethod(e.target.value)}
              placeholder="Ej: V60 (Hario), Espresso, Prensa Francesa"
              className="w-full border-2 border-lino rounded-xl px-4 py-2.5 text-sm bg-crema-light/60 focus:border-ocre focus:outline-none placeholder:text-tierra/40"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" variant="primary" size="md">
              Publicar reseña
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {submitted && (
        <p className="flex items-center gap-2 text-sm text-alerta-exito bg-salvia/30 border border-salvia/60 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4" />
          ¡Gracias por compartir tu reseña! Ya está publicada.
        </p>
      )}

      {/* Reviews list */}
      <div className="grid grid-cols-1 gap-4">
        {productReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white border border-dashed border-lino rounded-craft text-center px-6">
            <MessageSquare className="w-8 h-8 text-lino-dark mb-3" />
            <p className="font-serif font-bold text-espresso">Aún no hay reseñas</p>
            <p className="text-xs text-tierra mt-1 max-w-xs">
              Sé el primero en opinar sobre este producto y ayuda a otros caficultores de corazón a decidir.
            </p>
          </div>
        ) : (
          productReviews.map((review) => (
            <article
              key={review.id}
              className="bg-white border border-lino rounded-craft p-5 sm:p-6 shadow-soft space-y-3"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-10 h-10 rounded-full bg-espresso text-crema flex items-center justify-center font-serif font-bold text-sm shrink-0"
                >
                  {review.userName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-espresso">{review.userName}</span>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-alerta-exito">
                        <CheckCircle2 className="w-3 h-3" /> Compra verificada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-[11px] text-tierra/60">{review.date}</span>
                  </div>
                </div>
              </div>

              <h4 className="font-serif font-bold text-espresso text-sm">{review.title}</h4>
              <p className="text-sm text-tierra leading-relaxed">{review.comment}</p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {review.brewMethod && (
                  <span className="text-[10px] font-medium text-tierra bg-crema px-2.5 py-1 rounded-full border border-lino">
                    Preparación: {review.brewMethod}
                  </span>
                )}
                <button
                  onClick={() => markReviewHelpful(product.id, review.id)}
                  disabled={review.userVotedHelpful}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    review.userVotedHelpful
                      ? 'border-salvia text-alerta-exito bg-salvia/30 cursor-default'
                      : 'border-lino text-tierra hover:border-ocre hover:text-ocre-dark'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${review.userVotedHelpful ? 'fill-current' : ''}`} />
                  Útil ({review.helpfulCount})
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};
