'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Voucher, CartItem } from './types';

interface VoucherContextType {
  // State
  availableVouchers: Voucher[];
  appliedVoucher: Voucher | null;
  discountAmount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadVouchers: () => Promise<void>;
  applyVoucher: (code: string, cartItems: CartItem[], cartTotal: number) => Promise<boolean>;
  removeVoucher: () => Promise<void>;
  clearError: () => void;

  // Utilities
  calculateDiscount: (voucher: Voucher, cartItems: CartItem[], cartTotal: number) => number;
  isVoucherValid: (voucher: Voucher, cartItems: CartItem[], cartTotal: number) => { valid: boolean; reason?: string };
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

export function VoucherProvider({ children }: { children: ReactNode }) {
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available vouchers on mount
  useEffect(() => {
    loadVouchers();
  }, []);

  // Persist applied voucher to localStorage
  useEffect(() => {
    if (appliedVoucher) {
      localStorage.setItem('appliedVoucher', JSON.stringify(appliedVoucher));
      localStorage.setItem('discountAmount', discountAmount.toString());
    } else {
      localStorage.removeItem('appliedVoucher');
      localStorage.removeItem('discountAmount');
    }
  }, [appliedVoucher, discountAmount]);

  // Load persisted voucher on mount
  useEffect(() => {
    const storedVoucher = localStorage.getItem('appliedVoucher');
    const storedDiscount = localStorage.getItem('discountAmount');

    if (storedVoucher && storedDiscount) {
      try {
        setAppliedVoucher(JSON.parse(storedVoucher));
        setDiscountAmount(parseFloat(storedDiscount));
      } catch (error) {
        console.error('Failed to parse stored voucher:', error);
        localStorage.removeItem('appliedVoucher');
        localStorage.removeItem('discountAmount');
      }
    }
  }, []);

  const loadVouchers = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vouchers');
      const data = await response.json();

      if (data.success && data.data) {
        setAvailableVouchers(data.data);
      } else {
        setError(data.error || 'Failed to load vouchers');
      }
    } catch (error) {
      setError('Network error while loading vouchers');
      console.error('Failed to load vouchers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscount = useCallback((voucher: Voucher, cartItems: CartItem[], cartTotal: number): number => {
    if (voucher.discountType === 'fixed') {
      return Math.min(voucher.discountValue, cartTotal);
    } else {
      // Percentage discount
      const discount = (cartTotal * voucher.discountValue) / 100;
      return voucher.maxDiscount ? Math.min(discount, voucher.maxDiscount) : discount;
    }
  }, []);

  const isVoucherValid = useCallback((voucher: Voucher, cartItems: CartItem[], cartTotal: number): { valid: boolean; reason?: string } => {
    // Check if voucher is active
    if (!voucher.isActive) {
      return { valid: false, reason: 'Voucher is not active' };
    }

    // Check expiry date
    if (new Date(voucher.expiryDate) < new Date()) {
      return { valid: false, reason: 'Voucher has expired' };
    }

    // Check minimum order value
    if (voucher.minOrderValue && cartTotal < voucher.minOrderValue) {
      return { valid: false, reason: `Minimum order value is $${voucher.minOrderValue}` };
    }

    // Check usage limit
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return { valid: false, reason: 'Voucher usage limit exceeded' };
    }

    // Check applicable categories/products
    if (voucher.applicableCategories && voucher.applicableCategories.length > 0) {
      const hasApplicableCategory = cartItems.some(item =>
        voucher.applicableCategories!.includes(item.product.category)
      );
      if (!hasApplicableCategory) {
        return { valid: false, reason: 'Voucher not applicable to items in cart' };
      }
    }

    if (voucher.applicableProducts && voucher.applicableProducts.length > 0) {
      const hasApplicableProduct = cartItems.some(item =>
        voucher.applicableProducts!.includes(item.product.id)
      );
      if (!hasApplicableProduct) {
        return { valid: false, reason: 'Voucher not applicable to items in cart' };
      }
    }

    return { valid: true };
  }, []);

  const applyVoucher = async (code: string, cartItems: CartItem[], cartTotal: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // First, get voucher details
      const voucherResponse = await fetch(`/api/vouchers/code/${code}`);
      const voucherData = await voucherResponse.json();

      if (!voucherData.success || !voucherData.data) {
        setError(voucherData.error || 'Invalid voucher code');
        return false;
      }

      const voucher = voucherData.data;

      // Validate voucher
      const validation = isVoucherValid(voucher, cartItems, cartTotal);
      if (!validation.valid) {
        setError(validation.reason || 'Voucher is not valid');
        return false;
      }

      // Apply voucher via API
      const applyResponse = await fetch('/api/vouchers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voucherCode: code,
          cartTotal,
          cartItems,
        }),
      });

      const applyData = await applyResponse.json();

      if (applyData.success && applyData.data) {
        setAppliedVoucher(voucher);
        setDiscountAmount(applyData.data.discountAmount);
        return true;
      } else {
        setError(applyData.error || 'Failed to apply voucher');
        return false;
      }
    } catch (error) {
      setError('Network error while applying voucher');
      console.error('Failed to apply voucher:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeVoucher = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vouchers/remove', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setAppliedVoucher(null);
        setDiscountAmount(0);
      } else {
        setError(data.error || 'Failed to remove voucher');
      }
    } catch (error) {
      setError('Network error while removing voucher');
      console.error('Failed to remove voucher:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return (
    <VoucherContext.Provider
      value={{
        availableVouchers,
        appliedVoucher,
        discountAmount,
        isLoading,
        error,
        loadVouchers,
        applyVoucher,
        removeVoucher,
        clearError,
        calculateDiscount,
        isVoucherValid,
      }}
    >
      {children}
    </VoucherContext.Provider>
  );
}

export function useVoucher() {
  const context = useContext(VoucherContext);
  if (!context) {
    throw new Error('useVoucher must be used within VoucherProvider');
  }
  return context;
}