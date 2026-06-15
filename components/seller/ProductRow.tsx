'use client';

import { Package } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from './StatusBadge';

import { Product } from '@/lib/types';

interface ProductRowProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function ProductRow({ product, onEdit, onDelete, onToggle }: ProductRowProps) {
  return (
    <tr className="hover:bg-muted transition-colors border-b border-[color:hsl(var(--border))]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground">
              <Package className="w-6 h-6" />
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {product.category?.name ??
                (typeof product.categoryId === 'string'
                  ? product.categoryId
                  : product.categoryId
                  ? ((product.categoryId as any).name || (product.categoryId as any).id || 'Unknown')
                  : 'Unknown')}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">
        {product.storeId || 'N/A'}
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-foreground">
        ${product.price.toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={product.status ?? 'unavailable'} />
      </td>
      <td className="px-6 py-4 text-sm space-x-2">
        <button
          onClick={() => onEdit(product.id)}
          className="text-secondary hover:text-secondary font-semibold transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onToggle(product.id)}
          className="text-success hover:text-success font-semibold transition-colors"
        >
          {product.status === 'available' ? 'Disable' : 'Enable'}
        </button>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this product?')) {
              onDelete(product.id);
            }
          }}
          className="text-destructive hover:text-destructive font-semibold transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}




