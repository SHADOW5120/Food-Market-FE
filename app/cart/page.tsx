'use client';

import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartList } from '@/components/cart/CartList';
import { CartSummary } from '@/components/cart/CartSummary';
import { ProtectedRoute } from '@/components/ProtectedRoute';
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
      <div className="min-h-screen bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </li>
            <li className="text-foreground font-medium">Shopping Cart</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {items.length === 0 ? 'Your cart is empty' : `You have ${items.length} item${items.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] overflow-hidden">
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
                <h2 className="text-2xl font-bold text-foreground">You might also like</h2>
                <p className="text-muted-foreground mt-1">Add more items to your order</p>
              </div>
              <Link
                href="/products"
                className="text-primary hover:text-primary font-semibold inline-flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Placeholder for recommendations */}
              <div className="text-center py-8 text-muted-foreground">
                <p>Recommended products will appear here</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Checkout Button */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] p-4">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}


