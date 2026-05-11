'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { ActionMenu } from './ActionMenu';

export function Navbar() {
  const { role, hasHydrated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-3xl">🍽️</div>
            <h1 className="text-2xl font-bold text-gray-900">Food Market</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium">
              Menu
            </Link>

            {hasHydrated && role === 'seller' && (
              <Link href="/seller" className="text-gray-700 hover:text-orange-600 font-medium">
                Seller Dashboard
              </Link>
            )}

            {hasHydrated && <ActionMenu />}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-orange-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-orange-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>

              {hasHydrated && role === 'seller' && (
                <Link
                  href="/seller"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Seller Dashboard
                </Link>
              )}

              {hasHydrated && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <ActionMenu />
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}