'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { Button } from './Button';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onAddComplete?: () => void;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  variant = 'primary',
  size = 'md',
  onAddComplete,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // Add item to cart with specified quantity
      await addItem(product, quantity);

      setAdded(true);
      onAddComplete?.();

      // Reset after 2 seconds
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      loading={loading}
      disabled={added}
      variant={added ? 'secondary' : variant}
      size={size}
      className={`${className} min-w-[120px]`}
    >
      {added ? (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added!
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
          </svg>
          Add to Cart
        </>
      )}
    </Button>
  );
}