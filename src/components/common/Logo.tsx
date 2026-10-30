import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'ocre';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  showTagline = true,
}) => {
  const textColor =
    variant === 'light'
      ? 'text-crema'
      : variant === 'ocre'
      ? 'text-ocre'
      : 'text-espresso';

  const mountainColor =
    variant === 'light' ? '#EADCC4' : variant === 'ocre' ? '#D49A2A' : '#5A3A24';
  const beanColor =
    variant === 'light' ? '#D49A2A' : variant === 'ocre' ? '#F6EEE0' : '#D49A2A';

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* SVG Icon with stylized Andean mountain & golden coffee bean */}
      <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Outer circle subtle border */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke={mountainColor}
            strokeWidth="3"
            strokeDasharray="4 2"
            opacity="0.5"
          />

          {/* Stylized Triple Mountain Peaks (Andean Cordilleras) */}
          <path
            d="M16 74L38 38L52 60L68 34L86 74H16Z"
            fill={mountainColor}
            opacity="0.85"
          />
          {/* Inner Mountain Highlight */}
          <path
            d="M38 38L44 48L52 38L68 34L76 52L86 74H52L38 38Z"
            fill={mountainColor}
          />

          {/* Golden Coffee Bean glowing above the central peak */}
          <g transform="translate(42, 16) scale(0.9)">
            {/* Bean body */}
            <ellipse
              cx="9"
              cy="12"
              rx="8.5"
              ry="11.5"
              fill={beanColor}
              transform="rotate(-18 9 12)"
            />
            {/* S-curve crease */}
            <path
              d="M9 2C13 6 5 16 10 22"
              stroke={variant === 'light' ? '#2B1B12' : '#F6EEE0'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>

          {/* Base mist / sun arc */}
          <path
            d="M24 74C32 71 42 69 50 69C58 69 68 71 76 74"
            stroke={beanColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span
          className={`font-serif text-2xl font-bold tracking-tight leading-none ${textColor} group-hover:text-ocre transition-colors duration-200`}
        >
          MONTEROJAS
        </span>
        {showTagline && (
          <span
            className={`text-[9px] uppercase tracking-[0.24em] font-sans font-semibold mt-1 ${
              variant === 'light' ? 'text-salvia' : 'text-tierra'
            }`}
          >
            Café de Origen · Colombia
          </span>
        )}
      </div>
    </Link>
  );
};
