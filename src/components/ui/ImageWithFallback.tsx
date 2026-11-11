import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
  fallbackTitle,
  containerClassName,
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  if (hasError || !src) {
    return (
      <div
        className={twMerge(
          clsx(
            'w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-olive-900 via-olive-950 to-olive-900 text-honey-100 p-4 select-none relative overflow-hidden',
            containerClassName
          )
        )}
        role="img"
        aria-label={alt || fallbackTitle || 'طبق هشوشة فاخر'}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-honey-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-pomegranate-600/10 rounded-full blur-xl pointer-events-none" />

        {/* Appetizing Culinary Emblem SVG */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 mb-2 text-honey-500 drop-shadow-sm transition-transform duration-300 hover:scale-105"
          aria-hidden="true"
        >
          {/* Artisanal Clay Pot & Stuffed Leaf Emblem */}
          <path
            d="M32 6C34.5 14 44 18 44 26C44 33 38.6 38 32 38C25.4 38 20 33 20 26C20 18 29.5 14 32 6Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          <path
            d="M32 14V34M28 22L32 26M36 22L32 26"
            stroke="#173420"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 42C14 39.7909 15.7909 38 18 38H46C48.2091 38 50 39.7909 50 42V45C50 51.6274 44.6274 57 38 57H26C19.3726 57 14 51.6274 14 45V42Z"
            fill="#528D63"
            fillOpacity="0.4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M10 42H54"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <span className="text-xs font-readex font-bold text-surface-warm text-center max-w-[85%] truncate drop-shadow-sm">
          {fallbackTitle || alt || 'هشوشة للمحاشي'}
        </span>
        <span className="text-[10px] font-readex text-olive-200/80 mt-0.5">
          تحضير طازج يومياً
        </span>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        clsx(
          'relative w-full h-full overflow-hidden bg-surface-muted',
          containerClassName
        )
      )}
    >
      {/* Skeleton / Shimmer background while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-olive-100/50 via-surface-muted to-olive-100/50 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={twMerge(
          clsx(
            'w-full h-full object-cover transition-all duration-300',
            !isLoaded ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
            className
          )
        )}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
