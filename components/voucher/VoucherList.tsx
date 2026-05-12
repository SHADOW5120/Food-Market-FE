'use client';

import { VoucherCard } from './VoucherCard';
import { useVoucher } from '@/lib/voucher-context';
import { Voucher } from '@/lib/types';

interface VoucherListProps {
  vouchers?: Voucher[];
  compact?: boolean;
  showEmptyState?: boolean;
  emptyStateMessage?: string;
  onVoucherApplied?: (voucher: Voucher) => void;
  className?: string;
}

export function VoucherList({
  vouchers,
  compact = false,
  showEmptyState = true,
  emptyStateMessage = 'No vouchers available at the moment.',
  onVoucherApplied,
  className = ''
}: VoucherListProps) {
  const { availableVouchers, isLoading, error } = useVoucher();

  const displayVouchers = vouchers || availableVouchers;
  const activeVouchers = displayVouchers.filter(v => v.isActive && new Date(v.expiryDate) > new Date());

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border-2 border-dashed border-[color:hsl(var(--border))] rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-destructive/10 border border-destructive/20 rounded-lg ${className}`}>
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (activeVouchers.length === 0 && showEmptyState) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-4xl mb-4">🎫</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Active Vouchers</h3>
        <p className="text-muted-foreground">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activeVouchers.map((voucher) => (
        <VoucherCard
          key={voucher.id}
          voucher={voucher}
          compact={compact}
          onApply={onVoucherApplied}
        />
      ))}
    </div>
  );
}

