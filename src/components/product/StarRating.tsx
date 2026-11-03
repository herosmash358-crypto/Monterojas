'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showNumeric?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showNumeric = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starNumber = index + 1;
          const isFilled = currentVal >= starNumber;
          const isHalf = currentVal >= starNumber - 0.5 && currentVal < starNumber;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starNumber)}
              onMouseEnter={() => interactive && setHoverRating(starNumber)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
              } p-0.5 focus:outline-none`}
              aria-label={`${starNumber} estrellas`}
            >
              <Star
                className={`${starSizes[size]} transition-colors ${
                  isFilled
                    ? 'text-ocre fill-ocre'
                    : isHalf
                    ? 'text-ocre fill-ocre/50'
                    : 'text-lino fill-crema'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showNumeric && (
        <span className="text-xs font-bold text-espresso ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
