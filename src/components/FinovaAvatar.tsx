import React, { useState } from 'react';
import { User } from '../types';

interface FinovaAvatarProps {
  user?: Partial<User> | null;
  avatarUrl?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showOnlineStatus?: boolean;
  bordered?: boolean;
  alt?: string;
}

const SIZE_MAP = {
  xs: {
    container: 'w-7 h-7 text-[11px]',
    status: 'w-2 h-2 bottom-0 right-0 border',
    border: 'border',
  },
  sm: {
    container: 'w-9 h-9 text-xs',
    status: 'w-2.5 h-2.5 bottom-0 right-0 border-2',
    border: 'border-2',
  },
  md: {
    container: 'w-11 h-11 text-sm',
    status: 'w-3 h-3 bottom-0 right-0 border-2',
    border: 'border-2',
  },
  lg: {
    container: 'w-16 h-16 text-lg',
    status: 'w-3.5 h-3.5 bottom-0.5 right-0.5 border-2',
    border: 'border-2',
  },
  xl: {
    container: 'w-24 h-24 text-2xl',
    status: 'w-4 h-4 bottom-1 right-1 border-2',
    border: 'border-3',
  },
  '2xl': {
    container: 'w-32 h-32 text-4xl',
    status: 'w-5 h-5 bottom-1.5 right-1.5 border-3',
    border: 'border-4',
  },
};

/**
 * Extracts 1-2 initials from name or email
 */
export function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.trim().slice(0, 2).toUpperCase();
  }
  return 'FN';
}

export const FinovaAvatar: React.FC<FinovaAvatarProps> = ({
  user,
  avatarUrl,
  name,
  size = 'md',
  className = '',
  showOnlineStatus = false,
  bordered = true,
  alt,
}) => {
  const [imageError, setImageError] = useState(false);

  const effectiveAvatar = avatarUrl !== undefined ? avatarUrl : user?.avatar;
  const effectiveName = name || user?.name || user?.email || 'Finova Member';
  const initials = getInitials(effectiveName, user?.email);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  const borderClass = bordered ? `${sizeConfig.border} border-[#659B5E]/40` : '';

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center font-bold tracking-wider transition-all duration-200 ${sizeConfig.container} ${borderClass} shadow-xs`}
      >
        {effectiveAvatar && !imageError ? (
          <img
            src={effectiveAvatar}
            alt={alt || effectiveName}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Brand-color fallback: Finova Forest Green Palette */
          <div 
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#659B5E] via-[#4F7C49] to-[#304B2B] text-white shadow-inner font-sans font-semibold"
            title={`${effectiveName} (${initials})`}
            aria-label={`${effectiveName} initials`}
          >
            <span className="drop-shadow-xs">{initials}</span>
          </div>
        )}
      </div>

      {showOnlineStatus && (
        <span
          className={`absolute rounded-full bg-[#22C55E] border-[#133320] shadow-xs ${sizeConfig.status}`}
          title="Active Session"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
