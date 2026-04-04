'use client';

import { CartItem } from './CartItem';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

export function CartList() {
  const { items, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 py-4 border-b border-gray-200 animate-pulse"
          >
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Cart is Empty</h3>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items yet</p>
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}
