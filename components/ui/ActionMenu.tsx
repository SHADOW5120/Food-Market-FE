'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/useTheme';
import { Avatar } from './Avatar';
import toast from 'react-hot-toast';

export function ActionMenu() {
  const { isAuthenticated, hasHydrated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setIsOpen(false);
  };

  const handleClose = () => setIsOpen(false);

  if (!hasHydrated) {
    return <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />;
  }

  const avatarUrl = user?.avatarUrl;
  const triggerLabel = isAuthenticated ? 'Open account menu' : 'Open actions menu';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] shadow-sm hover:border-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={triggerLabel}
      >
        {isAuthenticated ? (
          <Avatar
            src={avatarUrl}
            username={user?.username}
            size={40}
            className="w-10 h-10"
          />
        ) : (
          <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-0.9 2-2s-0.9-2-2-2-2 0.9-2 2 0.9 2 2 2zm0 2c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zm0 6c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card rounded-3xl shadow-2xl border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] z-50 overflow-hidden">
          <ul className="py-2">
            {!isAuthenticated ? (
              <>
                <li>
                  <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    Account
                  </div>
                </li>
                <li>
                  <Link
                    href="/login"
                    onClick={handleClose}
                    className="block px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
                  >
                    🔑 Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    onClick={handleClose}
                    className="block px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
                  >
                    ✍️ Register
                  </Link>
                </li>
                <li>
                  <div className="border-t border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] my-1"></div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    Account
                  </div>
                </li>
                <li>
                  <Link
                    href="/profile"
                    onClick={handleClose}
                    className="block px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
                  >
                    👤 Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile/edit"
                    onClick={handleClose}
                    className="block px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
                  >
                    ⚙️ Account Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-destructive transition-colors"
                  >
                    🚪 Logout
                  </button>
                </li>
                <li>
                  <div className="border-t border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] my-1"></div>
                </li>
              </>
            )}

            <li>
              <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Shopping
              </div>
            </li>
            <li>
              <Link
                href="/cart"
                onClick={handleClose}
                className="block px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
              >
                🛒 Cart
              </Link>
            </li>
            <li>
              <Link
                href="/favorites"
                onClick={handleClose}
                className="block px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
              >
                ❤️ Favorites
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                onClick={handleClose}
                className="block px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
              >
                📦 Orders
              </Link>
            </li>
            <li>
              <div className="border-t border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] my-1"></div>
            </li>

            <li>
              <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Settings
              </div>
            </li>
            <li>
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
              >
                {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </li>
            <li>
              <button
                onClick={handleClose}
                className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
              >
                ❓ Help & Support
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
