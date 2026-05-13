'use client';

import { X } from 'lucide-react';
import Link from 'next/link';

interface RequireAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequireAuthModal({ isOpen, onClose }: RequireAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-muted/60 p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl ring-1 ring-black/5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-4 pt-2">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">Login required</h2>
            <p className="mt-2 text-muted-foreground">
              You need to sign in or register to save favorites and access your wishlist.
            </p>
          </div>

          <div className="grid gap-3">
            <Link
              href="/login"
              className="inline-flex justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary"
              onClick={onClose}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex justify-center rounded-xl border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              onClick={onClose}
            >
              Register
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center rounded-xl bg-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              onClick={onClose}
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


