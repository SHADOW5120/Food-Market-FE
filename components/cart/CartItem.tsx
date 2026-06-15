'use client';

import { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (!confirm('Remove this item from your cart?')) return;
    
    setIsRemoving(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-[color:hsl(var(--border))] hover:bg-muted px-4 rounded-lg transition-colors">
      {/* Product Image */}
      <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden">
        {item.product.image ? (
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
          </div>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-destructive hover:text-destructive transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6h-2V4a2 2 0 00-2-2h-6a2 2 0 00-2 2v2H5a1 1 0 000 2h1v11a2 2 0 002 2h8a2 2 0 002-2V8h1a1 1 0 000-2zM9 4h6v2H9V4zm0 14H9V8h6v10z" />
            </svg>
          </button>
        </div>

        {/* Quantity Selector and Subtotal */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-muted rounded-lg p-3 text-sm font-semibold">
            <span>Qty: {item.quantity}</span>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
            <p className="text-lg font-bold text-primary">
              ${item.subtotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


