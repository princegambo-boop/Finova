import React from 'react';

export interface FinovaSymbolProps {
  /**
   * 'light-bg': Deep forest pillar (#41603B) with primary green (#659B5E) & mint (#76BA6F) growth vectors
   * 'dark-bg': Crisp white pillar (#FFFFFF) with primary green (#659B5E) & luminous mint (#86EFAC) growth vectors
   * 'navy': Deep navy pillar (#1E293B) with primary green vectors
   * 'monochrome': Follows parent text color via currentColor
   */
  theme?: 'light-bg' | 'dark-bg' | 'navy' | 'monochrome';
  className?: string;
  size?: number | string;
}

/**
 * FINOVA Master Geometric "Ascendant F" Symbol
 * 
 * Mathematical Architecture (48x48 Centered Grid):
 * 1. The Bedrock Pillar (Foundation & Solvency):
 *    - Vertical spine on the left in #41603B / #FFFFFF (width: 7px, rounded caps).
 *    - Anchors the mark with institutional security, capital preservation, and trust.
 * 2. The Horizon-to-Ascent Vector (Middle Tier - Smart Money Management):
 *    - Horizontal baseline that breaks upward at an exact 45° angle into an ascending trajectory.
 *    - Represents budgeting, real-time balancing, and disciplined capital allocation (#659B5E).
 * 3. The Sovereign Growth Wing (Upper Tier - Long-Term Prosperity & Compounding):
 *    - Extends horizontally from the top of the pillar, then accelerates upward at an exact 45° angle,
 *      rising into an optimistic growth peak with a luminous mint gradient (#659B5E -> #86EFAC).
 * 4. Optical Center & Negative Space:
 *    - 3.0px uniform negative space channel separating the pillar and arms.
 *    - Perfectly centered at (24.0, 23.75) with 45° parallel harmony.
 *    - Scalable down to a 16x16px favicon with zero loss of silhouette clarity.
 */
export const FinovaSymbol: React.FC<FinovaSymbolProps> = ({
  theme = 'light-bg',
  className = 'w-8 h-8',
}) => {
  const gradPrefix = React.useId().replace(/:/g, '');

  const isDark = theme === 'dark-bg';
  const isNavy = theme === 'navy';
  const isMono = theme === 'monochrome';

  // Pillar styling
  const pillarColor = isDark
    ? '#FFFFFF'
    : isNavy
    ? '#1E293B'
    : isMono
    ? 'currentColor'
    : `url(#${gradPrefix}-pillar-grad)`;

  // Arms styling
  const midArmColor = isMono ? 'currentColor' : '#659B5E';
  const topArmColor = isMono
    ? 'currentColor'
    : `url(#${gradPrefix}-growth-grad)`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Dynamic Growth Gradient for Top Vector */}
        <linearGradient
          id={`${gradPrefix}-growth-grad`}
          x1="18.5"
          y1="15.5"
          x2="39.5"
          y2="6.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#588D52" />
          <stop offset="60%" stopColor="#659B5E" />
          <stop offset="100%" stopColor={isDark ? '#86EFAC' : '#76BA6F'} />
        </linearGradient>

        {/* Tactile Pillar Gradient for Light Theme */}
        <linearGradient
          id={`${gradPrefix}-pillar-grad`}
          x1="9"
          y1="15.5"
          x2="9"
          y2="40.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4A6F42" />
          <stop offset="100%" stopColor="#355230" />
        </linearGradient>
      </defs>

      {/* 1. The Bedrock Foundation Pillar (Vertical Stem of 'F') */}
      <path
        d="M 9 15.5 V 40.5"
        stroke={pillarColor}
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* 2. Middle Horizon-to-Ascent Vector (Smart Management & Compounding) */}
      <path
        d="M 18.5 27.5 H 25.5 L 33.5 19.5"
        stroke={midArmColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Upper Sovereign Growth Wing (High Expansion & Long-term Opportunity) */}
      <path
        d="M 18.5 15.5 H 30.5 L 39.5 6.5"
        stroke={topArmColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export interface FinovaLogoProps {
  /**
   * 'light-bg': Deep navy text, dark green pillar, primary green arms (Default)
   * 'dark-bg': White text, white pillar, green/mint arms (for dark navbar & dark surfaces)
   * 'navy': Deep navy text & pillar, primary green arms
   * 'monochrome': Follows parent text color via currentColor
   */
  theme?: 'light-bg' | 'dark-bg' | 'navy' | 'monochrome';
  /**
   * Optical size presets
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  /**
   * Layout format:
   * 'standard': Horizontal layout (Symbol left, FINOVA right) - Ideal for Navbars & headers
   * 'stacked': Symbol centered above FINOVA wordmark - Ideal for Login, splash & cards
   * 'badge': Squircle container for mobile app icon
   * 'symbol-only': Abstract symbol only
   * 'wordmark-only': Typography only
   */
  variant?: 'standard' | 'stacked' | 'badge' | 'symbol-only' | 'wordmark-only';
  showWordmark?: boolean;
  showTagline?: boolean;
  taglineText?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * FINOVA Official Brand Identity
 * 
 * Minimal, modern, and prestigious fintech logo:
 * - Mathematical "Ascendant F" symbol
 * - Elegant geometric sans-serif wordmark "FINOVA"
 */
export const FinovaLogo: React.FC<FinovaLogoProps> = ({
  theme = 'light-bg',
  size = 'md',
  variant = 'standard',
  showWordmark = true,
  showTagline = false,
  taglineText = 'WEALTH INTELLIGENCE',
  className = '',
  onClick,
}) => {
  const dimensions = {
    xs: {
      symbol: 'w-5 h-5',
      badge: 'w-7 h-7 rounded-lg p-1',
      fontSize: 'text-sm tracking-[0.2em]',
      taglineSize: 'text-[8px] tracking-[0.24em]',
      gap: 'gap-2',
    },
    sm: {
      symbol: 'w-6 h-6',
      badge: 'w-8 h-8 rounded-lg p-1.5',
      fontSize: 'text-base sm:text-lg tracking-[0.2em]',
      taglineSize: 'text-[9px] tracking-[0.26em]',
      gap: 'gap-2.5',
    },
    md: {
      symbol: 'w-8.5 h-8.5 sm:w-9 sm:h-9',
      badge: 'w-10 h-10 rounded-xl p-2',
      fontSize: 'text-xl sm:text-2xl tracking-[0.22em]',
      taglineSize: 'text-[10px] tracking-[0.28em]',
      gap: 'gap-3',
    },
    lg: {
      symbol: 'w-11 h-11 sm:w-13 sm:h-13',
      badge: 'w-16 h-16 rounded-2xl p-3',
      fontSize: 'text-2xl sm:text-3xl tracking-[0.24em]',
      taglineSize: 'text-xs tracking-[0.3em]',
      gap: 'gap-3.5',
    },
    xl: {
      symbol: 'w-16 h-16 sm:w-18 sm:h-18',
      badge: 'w-22 h-22 rounded-3xl p-4',
      fontSize: 'text-3xl sm:text-4xl tracking-[0.25em]',
      taglineSize: 'text-sm tracking-[0.32em]',
      gap: 'gap-4',
    },
    hero: {
      symbol: 'w-24 h-24 sm:w-28 sm:h-28',
      badge: 'w-36 h-36 rounded-3xl p-6',
      fontSize: 'text-5xl sm:text-6xl tracking-[0.26em]',
      taglineSize: 'text-base tracking-[0.36em]',
      gap: 'gap-6',
    },
  }[size];

  const textColor =
    theme === 'dark-bg'
      ? 'text-white'
      : theme === 'monochrome'
      ? 'text-current'
      : 'text-[#1E293B]'; // Deep navy

  const taglineColor =
    theme === 'dark-bg'
      ? 'text-white/70'
      : theme === 'monochrome'
      ? 'text-current opacity-70'
      : 'text-[#64748B]';

  const isStacked = variant === 'stacked';
  const shouldRenderSymbol = variant !== 'wordmark-only';
  const shouldRenderWordmark = variant !== 'symbol-only' && showWordmark;

  return (
    <div
      onClick={onClick}
      className={`inline-flex ${
        isStacked ? 'flex-col items-center text-center' : `items-center ${dimensions.gap}`
      } ${onClick ? 'cursor-pointer select-none group' : ''} ${className}`}
      role={onClick ? 'button' : 'banner'}
      aria-label="Finova"
    >
      {/* Scalable Vector Symbol */}
      {shouldRenderSymbol && (
        variant === 'badge' ? (
          <div
            className={`${dimensions.badge} ${
              theme === 'dark-bg'
                ? 'bg-[#1E293B] border border-white/15 shadow-md'
                : 'bg-white border border-[#E2E8F0] shadow-xs'
            } flex items-center justify-center transition-transform duration-200 ${
              onClick ? 'group-hover:scale-105' : ''
            }`}
          >
            <FinovaSymbol theme={theme} className={dimensions.symbol} />
          </div>
        ) : (
          <div className={`transition-transform duration-200 ${onClick ? 'group-hover:scale-105' : ''}`}>
            <FinovaSymbol theme={theme} className={dimensions.symbol} />
          </div>
        )
      )}

      {/* Refined Geometric Sans-Serif Wordmark */}
      {shouldRenderWordmark && (
        <div className={`flex flex-col ${isStacked ? 'items-center mt-3' : 'items-start'} leading-none`}>
          <span
            className={`font-heading font-extrabold uppercase ${dimensions.fontSize} ${textColor} leading-none select-none transition-colors tracking-[0.22em]`}
            style={{
              fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            FINOVA
          </span>
          {showTagline && (
            <span
              className={`uppercase font-semibold ${dimensions.taglineSize} ${taglineColor} mt-1.5 select-none`}
              style={{
                fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              {taglineText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Legacy reference helper for 3D-sculpted gold edition
 */
export const FinovaGoldTreeLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({
  size = 'md',
  showWordmark = false,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
  };

  return (
    <div 
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`overflow-hidden border border-[#D4AF37]/35 shadow-md ${sizeMap[size]} transition-transform duration-200 ${onClick ? 'group-hover:scale-105' : ''}`}>
        <img
          src="/finova-gold-tree.jpg"
          alt="Finova 3D Sculpted Gold Wealth Tree Emblem"
          className="w-full h-full object-cover"
        />
      </div>

      {showWordmark && (
        <span 
          className="font-extrabold uppercase text-white tracking-[0.24em] text-lg"
          style={{ fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
        >
          FINOVA
        </span>
      )}
    </div>
  );
};
