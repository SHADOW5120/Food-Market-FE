'use client';

import { useState } from 'react';

interface AvatarProps {
  src?: string;
  username?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, username, size = 40, className = '' }: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const initial = username ? username.charAt(0).toUpperCase() : 'U';
  const resolvedSrc = src && !hasError ? src : undefined;

  return resolvedSrc ? (
    <img
      src={resolvedSrc}
      alt={username ? `${username} avatar` : 'User avatar'}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-muted text-primary font-semibold ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

