'use client';

import Link from 'next/link';

interface RequireAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequireAuthModal({ isOpen, onClose }: RequireAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
          aria-label="Close"
        >
          ×
        </button>

        <div className="space-y-4 pt-2">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Login required</h2>
            <p className="mt-2 text-gray-600">
              You need to sign in or register to save favorites and access your wishlist.
            </p>
          </div>

          <div className="grid gap-3">
            <Link
              href="/login"
              className="inline-flex justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              onClick={onClose}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              onClick={onClose}
            >
              Register
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
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
