import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showSubtitle = true
}) => {
  // Dimension mappings
  const dimensions = {
    sm: { icon: 'w-7 h-7', title: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9 sm:w-10 sm:h-10', title: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14 sm:w-16 sm:h-16', title: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-24 h-24 sm:w-28 sm:h-28', title: 'text-3xl sm:text-4xl', sub: 'text-sm' },
  }[size];

  // SVG Monogram representing the interlocking DS from the official logo
  const MonogramMark = (
    <div className={`relative flex items-center justify-center shrink-0 ${dimensions.icon}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs select-none"
      >
        <defs>
          <linearGradient id="dsGrad1" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="dsGrad2" x1="140" y1="20" x2="40" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>
          <linearGradient id="dsHighlight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Backplate subtle border */}
        <rect width="160" height="160" rx="32" className="fill-slate-900/5 dark:fill-white/5" />

        {/* D outer curve & vertical spine */}
        <path
          d="M 32 30 H 76 C 114 30 134 56 134 82 C 134 108 114 132 76 132 H 32 V 30 Z"
          fill="url(#dsGrad1)"
        />

        {/* D inner cutout hole */}
        <path
          d="M 52 50 H 74 C 98 50 112 65 112 82 C 112 99 98 112 74 112 H 52 V 50 Z"
          className="fill-slate-50 dark:fill-slate-950"
        />

        {/* Geometric facet cut on lower left of D */}
        <path
          d="M 32 94 L 52 112 V 132 H 32 Z"
          fill="#475569"
        />

        {/* S ribbon looping smoothly through D */}
        <path
          d="M 124 54 C 118 42 102 36 84 36 C 62 36 48 48 48 64 C 48 88 116 80 116 106 C 116 122 98 132 78 132 C 60 132 44 122 38 110 L 54 100 C 58 108 68 114 78 114 C 88 114 96 108 96 102 C 96 82 28 88 28 62 C 28 40 48 24 84 24 C 108 24 128 34 136 48 Z"
          fill="url(#dsGrad2)"
        />

        {/* Modern metallic sheen fold */}
        <path
          d="M 72 44 C 90 44 102 52 108 62 L 94 70 C 90 62 82 58 72 58 C 58 58 52 64 52 70 C 52 72 54 75 58 77 L 50 83 C 44 79 40 74 40 68 C 40 54 54 44 72 44 Z"
          fill="url(#dsHighlight)"
          opacity="0.8"
        />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {MonogramMark}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {MonogramMark}
        <div className="mt-3">
          <span className={`block font-black tracking-widest text-slate-900 dark:text-white uppercase ${dimensions.title}`}>
            DEROUA
          </span>
          <span className={`block font-bold tracking-[0.25em] text-slate-600 dark:text-slate-400 uppercase ${dimensions.sub}`}>
            SERVICES
          </span>
          {showSubtitle && (
            <span className="block mt-1 text-xs text-sky-600 dark:text-sky-400 font-medium">
              بوابة خدمات مدينة الدروة
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default 'horizontal' variant (standard website header)
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {MonogramMark}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-wider text-slate-900 dark:text-white uppercase ${dimensions.title}`}>
            DEROUA
          </span>
          <span className={`font-light tracking-widest text-slate-600 dark:text-slate-400 uppercase ${dimensions.title}`}>
            SERVICES
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-medium tracking-wide text-slate-500 dark:text-slate-400 mt-1 ${dimensions.sub}`}>
            دليل وخدمات مدينة الدروة
          </span>
        )}
      </div>
    </div>
  );
};
