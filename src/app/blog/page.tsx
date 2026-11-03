import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '@/lib/server/catalog';
import { BlogPost } from '@/lib/types';

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/" className="hover:text-espresso">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Blog & Guías Barista</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-espresso text-crema p-8 sm:p-12 rounded-3xl shadow-card space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-ocre flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> Cultura del Café de Especialidad
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-crema">
          Guías de Preparación & Historias de Tostión
        </h1>
        <p className="text-xs sm:text-sm text-crema/80 max-w-xl leading-relaxed">
          Técnicas profesionales explicadas de forma sencilla para preparar una taza memorable en tu cocina todos los días.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-3xl border border-lino overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-lino">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-crema-light/95 backdrop-blur-sm text-espresso text-[11px] font-bold px-3 py-1 rounded-full border border-lino shadow-sm">
                {post.category}
              </span>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-tierra mb-2">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-espresso group-hover:text-ocre transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-tierra mt-2.5 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-lino flex items-center justify-between text-xs text-ocre font-bold">
                <span>Por {post.author.name} ({post.author.role})</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Leer artículo <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
