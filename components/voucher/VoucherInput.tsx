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
          className="flex-1 px-4 py-3 border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary uppercase font-mono text-sm bg-input text-foreground placeholder-muted-foreground"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!code.trim() || isLoading}
          className={`px-6 py-3 font-semibold rounded-lg transition-colors whitespace-nowrap ${
            !code.trim() || isLoading
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary'
          }`}
        >
          {isLoading ? 'Applying...' : buttonText}
        </button>
      </form>

      {error && (
        <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}