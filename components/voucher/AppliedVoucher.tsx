'use client';

import { CheckCircle2 } from 'lucide-react';
import { useVoucher } from '@/lib/voucher-context';

interface AppliedVoucherProps {
  className?: string;
  showRemoveButton?: boolean;
}

export function AppliedVoucher({ className = '', showRemoveButton = true }: AppliedVoucherProps) {
  const { appliedVoucher, discountAmount, removeVoucher, isLoading } = useVoucher();

  if (!appliedVoucher) return null;

  const formatDiscount = () => {
    if (appliedVoucher.discountType === 'fixed') {
      return `$${appliedVoucher.discountValue} off`;
    } else {
      return `${appliedVoucher.discountValue}% off`;
    }
  };

  const handleRemove = async () => {
    if (isLoading) return;
    await removeVoucher();
  };

  return (
    <div className={`bg-muted border-2 border-[color:hsl(var(--border))] rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-success">Voucher Applied</span>
              <code className="bg-success px-2 py-1 rounded text-sm font-mono font-bold text-success">
                {appliedVoucher.code}
              </code>
            </div>
            <p className="text-sm text-success">
              {appliedVoucher.name} • {formatDiscount()} • You saved ${discountAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {showRemoveButton && (
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="text-destructive hover:text-destructive font-medium text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Removing...' : 'Remove'}
          </button>
        )}
      </div>
    </div>
  );
}


