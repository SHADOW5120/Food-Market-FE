'use client';

import { Voucher } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useVoucher } from '@/lib/voucher-context';

interface VoucherCardProps {
  voucher: Voucher;
  onApply?: (voucher: Voucher) => void;
  compact?: boolean;
}

export function VoucherCard({ voucher, onApply, compact = false }: VoucherCardProps) {
  const { items, totalPrice } = useCart();
  const { appliedVoucher, applyVoucher, isLoading } = useVoucher();

  const isApplied = appliedVoucher?.id === voucher.id;
  const isExpired = new Date(voucher.expiryDate) < new Date();

  const handleApply = async () => {
    if (isApplied || isExpired) return;

    const success = await applyVoucher(voucher.code, items, totalPrice);
    if (success && onApply) {
      onApply(voucher);
    }
  };

  const formatDiscount = () => {
    if (voucher.discountType === 'fixed') {
      return `$${voucher.discountValue} off`;
    } else {
      return `${voucher.discountValue}% off${voucher.maxDiscount ? ` (max $${voucher.maxDiscount})` : ''}`;
    }
  };

  const formatExpiry = () => {
    const expiryDate = new Date(voucher.expiryDate);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays <= 7) return `Expires in ${diffDays} days`;
    return `Expires ${expiryDate.toLocaleDateString()}`;
  };

  if (compact) {
    return (
      <div className={`border-2 border-dashed rounded-lg p-3 transition-all ${
        isApplied
          ? 'border-success bg-muted/20'
          : isExpired
          ? 'border-[color:hsl(var(--border))] bg-muted opacity-60'
          : 'border-primary bg-muted hover:border-primary'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <code className="bg-card px-2 py-1 rounded text-sm font-mono font-bold text-foreground border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))]">
                {voucher.code}
              </code>
              <span className="text-sm font-bold text-success">
                {formatDiscount()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{voucher.description}</p>
          </div>
          <button
            onClick={handleApply}
            disabled={isApplied || isExpired || isLoading}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              isApplied
                ? 'bg-success text-success-foreground'
                : isExpired
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary'
            }`}
          >
            {isApplied ? 'Applied' : isExpired ? 'Expired' : 'Apply'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-2 border-dashed rounded-xl p-6 transition-all hover:shadow-md ${
      isApplied
        ? 'border-success bg-muted/20 shadow-md'
        : isExpired
        ? 'border-[color:hsl(var(--border))] bg-muted opacity-60'
        : 'border-primary bg-muted hover:border-primary'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">{voucher.name}</h3>
          <code className="bg-card px-3 py-1 rounded-lg text-sm font-mono font-bold text-foreground border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))]">
            {voucher.code}
          </code>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-success mb-1">
            {formatDiscount()}
          </div>
          <div className={`text-sm font-medium ${
            isExpired ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {formatExpiry()}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-foreground mb-4">{voucher.description}</p>

      {/* Conditions */}
      <div className="space-y-1 mb-4 text-sm text-muted-foreground">
        {voucher.minOrderValue && (
          <div>Minimum order: ${voucher.minOrderValue}</div>
        )}
        {voucher.usageLimit && (
          <div>Usage: {voucher.usedCount}/{voucher.usageLimit}</div>
        )}
        {voucher.applicableCategories && voucher.applicableCategories.length > 0 && (
          <div>Categories: {voucher.applicableCategories.join(', ')}</div>
        )}
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={isApplied || isExpired || isLoading}
        className={`w-full py-3 font-bold rounded-lg transition-colors ${
          isApplied
            ? 'bg-success text-success-foreground'
            : isExpired
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary'
        }`}
      >
        {isLoading ? 'Applying...' : isApplied ? 'âœ“ Applied' : isExpired ? 'Expired' : 'Apply Voucher'}
      </button>
    </div>
  );
}


