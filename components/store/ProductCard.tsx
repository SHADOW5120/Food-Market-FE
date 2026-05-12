'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = async () => {
    try {
      await addItem(product);
      // You can add toast notification here
      console.log('Product added to cart');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 relative rounded-lg overflow-hidden">
            <Image
              src={product.image || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-1 truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-accent">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
