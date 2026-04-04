'use client';

import Link from 'next/link';
import { StatusBadge } from './StatusBadge';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  status: 'available' | 'unavailable';
  category: string;
}

interface ProductRowProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function ProductRow({ product, onEdit, onDelete, onToggle }: ProductRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-2xl">
              📦
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        ${product.price.toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={product.status} />
      </td>
      <td className="px-6 py-4 text-sm space-x-2">
        <button
          onClick={() => onEdit(product.id)}
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onToggle(product.id)}
          className="text-green-600 hover:text-green-700 font-semibold transition-colors"
        >
          {product.status === 'available' ? 'Disable' : 'Enable'}
        </button>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this product?')) {
              onDelete(product.id);
            }
          }}
          className="text-red-600 hover:text-red-700 font-semibold transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
