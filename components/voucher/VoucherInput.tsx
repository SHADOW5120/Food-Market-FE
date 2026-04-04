'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useVoucher } from '@/lib/voucher-context';

interface VoucherInputProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
}

export function VoucherInput({
  className = '',
  placeholder = 'Enter voucher code',
  buttonText = 'Apply'
}: VoucherInputProps) {
  const { items, totalPrice } = useCart();
  const { applyVoucher, isLoading, error, clearError } = useVoucher();
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;

    clearError();
    const success = await applyVoucher(code.trim().toUpperCase(), items, totalPrice);
    if (success) {
      setCode('');
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 uppercase font-mono text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!code.trim() || isLoading}
          className={`px-6 py-3 font-semibold rounded-lg transition-colors whitespace-nowrap ${
            !code.trim() || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          {isLoading ? 'Applying...' : buttonText}
        </button>
      </form>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}