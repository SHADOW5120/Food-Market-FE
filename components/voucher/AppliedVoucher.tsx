'use client';

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
    <div className={`bg-green-50 border-2 border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-800">Voucher Applied</span>
              <code className="bg-green-100 px-2 py-1 rounded text-sm font-mono font-bold text-green-700">
                {appliedVoucher.code}
              </code>
            </div>
            <p className="text-sm text-green-700">
              {appliedVoucher.name} • {formatDiscount()} • You saved ${discountAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {showRemoveButton && (
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 font-medium text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Removing...' : 'Remove'}
          </button>
        )}
      </div>
    </div>
  );
}