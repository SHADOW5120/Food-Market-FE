'use client';

import { motion } from 'framer-motion';
import { cardHover } from '@/components/ui/motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { FavoriteButton } from '@/components/favorite/FavoriteButton';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: Product;
}

function AddInlineCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await addItem(product, 1);
    } catch (err) {
      console.error('Failed to add inline:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
    >
      {loading ? 'Adding...' : 'Add'}
    </button>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      layout
      initial={false} // Prevent initial animation on mount
      {...cardHover}
      className="group overflow-hidden rounded-[1.75rem] border border-[color:hsl(var(--border))] bg-card/95 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-muted">
        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton product={product} size="md" variant="icon" />
        </div>

        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.status === 'unavailable' && (
          <div className="absolute inset-0 bg-muted/60 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
              Unavailable
            </span>
          </div>
        )}
      </div>

          <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-primary ml-2 flex-shrink-0">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {product.category?.name ??
              (typeof product.categoryId === 'string'
                ? product.categoryId
                : product.categoryId
                ? ((product.categoryId as any).name || (product.categoryId as any).id || 'Unknown')
                : 'Unknown')}
          </span>
          <div className="flex items-center gap-3">
            <div className="text-accent group-hover:translate-x-1 transition-transform duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <AddInlineCart product={product} />
          </div>
        </div>
      </div>
    </Link>
    </motion.article>
  );
}


