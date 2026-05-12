'use client';

import Image from 'next/image';
import type { OrderItem } from '@/lib/types';

interface OrderItemProps {
  item: OrderItem;
}

export function OrderItem({ item }: OrderItemProps) {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-[color:hsl(var(--border))] last:border-b-0">
      {/* Product Image */}
      {item.image && (
        <div className="flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="object-cover rounded-lg w-20 h-20"
          />
        </div>
      )}

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
        <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
        <p className="text-sm font-semibold text-primary mt-2">
          ${item.price.toFixed(2)} each
        </p>
      </div>

      {/* Item Total */}
      <div className="text-right">
        <p className="font-semibold text-foreground">${itemTotal.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground mt-1">{item.quantity} × ${item.price.toFixed(2)}</p>
      </div>
    </div>
  );
}


