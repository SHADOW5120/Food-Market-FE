'use client';

import Link from 'next/link';
import { StatusBadge } from '@/components/seller/StatusBadge';
import type { Order } from '@/lib/types';

interface OrderCardProps {
  order: Order;
  className?: string;
}

export function OrderCard({ order, className = '' }: OrderCardProps) {
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link href={`/orders/${order.id}`}>
      <div className={`bg-white rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all p-4 cursor-pointer ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Order ID and Date */}
          <div className="flex-1">
            <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formattedDate} at {formattedTime}
            </p>
          </div>

          {/* Items Count */}
          <div className="text-sm text-gray-600">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </div>

          {/* Status Badge */}
          <div>
            <StatusBadge status={order.status} />
          </div>

          {/* Total Price */}
          <div className="text-right">
            <p className="text-lg font-bold text-orange-600">${order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Mobile Summary */}
        <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <p>
            {order.deliveryAddress.city}, {order.customer.phone}
          </p>
        </div>
      </div>
    </Link>
  );
}
