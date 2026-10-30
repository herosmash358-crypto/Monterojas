import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/data/blog';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/" className="hover:text-espresso">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <Link href="/blog" className="hover:text-espresso">
          Blog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <span className="bg-salvia/40 text-bosque-dark text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-salvia/60 inline-block">
          {post.category}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-tierra pt-1">
          <span className="flex items-center gap-1.5 font-semibold text-espresso">
            <User className="w-4 h-4 text-ocre" /> {post.author.name} ({post.author.role})
          </span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readTime}
          </span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-card border border-lino bg-lino">
        <Image src={post.image} alt={post.title} fill priority className="object-cover" />
      </div>

      {/* Content paragraphs */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-lino shadow-soft space-y-6 text-espresso text-sm sm:text-base leading-relaxed">
        <p className="font-serif text-lg sm:text-xl font-medium text-tierra leading-relaxed italic border-l-4 border-ocre pl-4">
          {post.excerpt}
        </p>

        {post.content.map((paragraph, i) => (
          <p key={i} className="text-tierra leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Call to action: shop coffee related */}
      <div className="p-8 bg-crema-dark rounded-3xl border border-lino flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif font-bold text-xl text-espresso">
            ¿Listo para poner en práctica esta técnica?
          </h3>
          <p className="text-xs text-tierra mt-1">
            Prueba con nuestros cafés en grano recién tostados de Huila y Nariño.
          </p>
        </div>
        <Link
          href="/categorias/cafe-en-grano"
          className="bg-ocre hover:bg-ocre-hover text-espresso font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-sm transition-all whitespace-nowrap inline-flex items-center gap-2"
        >
          Comprar Café Fresco <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
