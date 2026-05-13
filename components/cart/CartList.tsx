'use client';

import { ShoppingCart } from 'lucide-react';
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
            className="flex gap-4 py-4 border-b border-[color:hsl(var(--border))] animate-pulse"
          >
            <div className="w-20 h-20 bg-muted rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4 flex items-center justify-center">
          <ShoppingCart className="w-16 h-16" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Your Cart is Empty</h3>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any items yet</p>
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary transition-colors"
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


