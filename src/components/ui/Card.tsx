import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL opcional – convierte la tarjeta en un enlace */
  href?: string;
  /** Habilita la animación de sombra al pasar el cursor */
  hoverable?: boolean;
  children: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */

export const Card: React.FC<CardProps> = ({
  href,
  hoverable = false,
  className,
  children,
  ...rest
}) => {
  const cardClasses = cn(
    // Base
    'rounded-xl bg-[#EADCC4] overflow-hidden',
    'transition-shadow duration-300 motion-reduce:transition-none',
    // Hover (sombra)
    hoverable &&
      'hover:shadow-lg hover:shadow-[#2B1B12]/10 cursor-pointer',
    className,
  );

  // Si hay href, envolvemos en un Link de Next.js
  if (href) {
    return (
      <Link href={href} className={cn(cardClasses, 'block')}>
        {children}
      </Link>
    );
  }

  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
};

Card.displayName = 'Card';

/* ------------------------------------------------------------------ */
/*  Sub-componentes opcionales para estructura                        */
/* ------------------------------------------------------------------ */

/** Imagen superior de la tarjeta */
export const CardImage: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }
> = ({ className, alt, ...rest }) => (
  <img
    alt={alt}
    className={cn('w-full h-auto object-cover', className)}
    loading="lazy"
    {...rest}
  />
);

CardImage.displayName = 'CardImage';

/** Cuerpo con padding de la tarjeta */
export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => (
  <div className={cn('p-4 md:p-5', className)} {...rest}>
    {children}
  </div>
);

CardBody.displayName = 'CardBody';

/** Pie de la tarjeta */
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => (
  <div
    className={cn(
      'px-4 py-3 md:px-5 border-t border-[#5A3A24]/10',
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';
