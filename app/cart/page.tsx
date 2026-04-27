'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartList } from '@/components/cart/CartList';
import { CartSummary } from '@/components/cart/CartSummary';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/ui/Navbar';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const { items, isLoading, loadCart } = useCart();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setPageLoading(true);
      try {
        await loadCart();
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setPageLoading(false);
      }
    };

    load();
  }, [loadCart]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">Shopping Cart</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {items.length === 0 ? 'Your cart is empty' : `You have ${items.length} item${items.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <CartList />
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>

        {/* Recommended Products Section */}
        {items.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">You might also like</h2>
                <p className="text-gray-600 mt-1">Add more items to your order</p>
              </div>
              <Link
                href="/products"
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Placeholder for recommendations */}
              <div className="text-center py-8 text-gray-500">
                <p>Recommended products will appear here</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Checkout Button */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
