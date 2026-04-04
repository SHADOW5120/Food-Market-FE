'use client';

import { useState } from 'react';
import { VoucherInput } from './VoucherInput';
import { VoucherList } from './VoucherList';
import { AppliedVoucher } from './AppliedVoucher';
import { useVoucher } from '@/lib/voucher-context';

interface VoucherSectionProps {
  className?: string;
  showAppliedVoucher?: boolean;
  compact?: boolean;
}

export function VoucherSection({
  className = '',
  showAppliedVoucher = true,
  compact = false
}: VoucherSectionProps) {
  const { appliedVoucher, availableVouchers } = useVoucher();
  const [showAllVouchers, setShowAllVouchers] = useState(false);

  const activeVouchers = availableVouchers.filter(v => v.isActive && new Date(v.expiryDate) > new Date());
  const hasVouchers = activeVouchers.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Have a Voucher?</h3>
        {hasVouchers && !appliedVoucher && (
          <button
            onClick={() => setShowAllVouchers(!showAllVouchers)}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            {showAllVouchers ? 'Hide vouchers' : 'View available vouchers'}
          </button>
        )}
      </div>

      {/* Applied Voucher */}
      {showAppliedVoucher && appliedVoucher && (
        <AppliedVoucher />
      )}

      {/* Voucher Input */}
      {!appliedVoucher && (
        <div>
          <VoucherInput
            placeholder="Enter voucher code (e.g. SAVE10)"
            buttonText="Apply Voucher"
          />
        </div>
      )}

      {/* Available Vouchers */}
      {showAllVouchers && hasVouchers && !appliedVoucher && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Available Vouchers</h4>
          <VoucherList
            compact={compact}
            showEmptyState={false}
          />
        </div>
      )}

      {/* Quick Voucher Suggestions */}
      {!showAllVouchers && hasVouchers && !appliedVoucher && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">
                💡 {activeVouchers.length} voucher{activeVouchers.length !== 1 ? 's' : ''} available
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Save up to {Math.max(...activeVouchers.map(v =>
                  v.discountType === 'fixed' ? v.discountValue : 50 // Assume max 50% for percentage
                ))}{activeVouchers.some(v => v.discountType === 'percentage') ? '%' : '$'} off your order
              </p>
            </div>
            <button
              onClick={() => setShowAllVouchers(true)}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium underline"
            >
              View all →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}