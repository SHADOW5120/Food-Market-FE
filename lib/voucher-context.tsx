'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useCart } from '@/lib/cart-context';
import { voucherApi } from './api';
import { Voucher, VoucherDto, CartItem } from './types';

interface VoucherContextType {
  availableVouchers: Voucher[];
  appliedVoucher: Voucher | null;
  discountAmount: number;
  isLoading: boolean;
  error: string | null;
  loadVouchers: () => Promise<void>;
  applyVoucher: (code: string, cartItems: CartItem[], cartTotal: number) => Promise<boolean>;
  removeVoucher: () => Promise<void>;
  clearError: () => void;
  calculateDiscount: (voucher: Voucher, cartItems: CartItem[], cartTotal: number) => number;
  isVoucherValid: (voucher: Voucher, cartItems: CartItem[], cartTotal: number) => { valid: boolean; reason?: string };
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

function mapVoucherDto(dto: VoucherDto): Voucher {
  const isFixed = dto.discountAmount !== null && dto.discountAmount !== undefined;
  return {
    id: dto.voucherId,
    code: dto.code,
    name: dto.code,
    description: dto.description,
    discountType: isFixed ? 'fixed' : 'percentage',
    discountValue: isFixed ? dto.discountAmount! : dto.discountPercent ?? 0,
    maxDiscount: dto.maxDiscountAmount ?? undefined,
    minOrderValue: dto.minOrderAmount ?? undefined,
    expiryDate: dto.expiryDate,
    isActive: true,
    usageLimit: undefined,
    usedCount: 0,
    applicableCategories: [],
    applicableProducts: [],
    createdAt: new Date().toISOString(),
  };
}

export function VoucherProvider({ children }: { children: ReactNode }) {
  const { items, totalPrice } = useCart();
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define calculateDiscount before it's used in useEffect
  const calculateDiscount = useCallback((voucher: Voucher, cartItems: CartItem[], cartTotal: number): number => {
    if (voucher.discountType === 'fixed') {
      return Math.min(voucher.discountValue, cartTotal);
    }

    const discount = (cartTotal * voucher.discountValue) / 100;
    return voucher.maxDiscount ? Math.min(discount, voucher.maxDiscount) : discount;
  }, []);

  // Define isVoucherValid before it's used in useEffect
  const isVoucherValid = useCallback((voucher: Voucher, cartItems: CartItem[], cartTotal: number): { valid: boolean; reason?: string } => {
    if (!voucher.isActive) {
      return { valid: false, reason: 'Voucher is not active' };
    }

    if (new Date(voucher.expiryDate) < new Date()) {
      return { valid: false, reason: 'Voucher has expired' };
    }

    if (voucher.minOrderValue && cartTotal < voucher.minOrderValue) {
      return { valid: false, reason: `Minimum order value is $${voucher.minOrderValue}` };
    }

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return { valid: false, reason: 'Voucher usage limit exceeded' };
    }

    if (voucher.applicableCategories && voucher.applicableCategories.length > 0) {
      const hasApplicableCategory = cartItems.some(item => {
        const categoryId = item.product.categoryId ?? item.product.category?.id;
        return categoryId && voucher.applicableCategories!.includes(categoryId);
      });
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

  const loadVouchers = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await voucherApi.getVouchers();
      if (response.success && response.data) {
        setAvailableVouchers(response.data.map(mapVoucherDto));
      } else {
        setError(response.error || 'Failed to load vouchers');
      }
    } catch (err) {
      setError('Network error while loading vouchers');
      console.error('Failed to load vouchers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadVouchers();
  }, []);

  useEffect(() => {
    if (appliedVoucher) {
      setDiscountAmount(calculateDiscount(appliedVoucher, items, totalPrice));
    } else {
      setDiscountAmount(0);
    }
  }, [appliedVoucher, items, totalPrice, calculateDiscount]);

  useEffect(() => {
    const storedVoucher = localStorage.getItem('appliedVoucher');
    if (storedVoucher) {
      try {
        setAppliedVoucher(JSON.parse(storedVoucher));
      } catch (parseError) {
        console.error('Failed to parse stored voucher:', parseError);
        localStorage.removeItem('appliedVoucher');
      }
    }
  }, []);

  useEffect(() => {
    if (appliedVoucher) {
      localStorage.setItem('appliedVoucher', JSON.stringify(appliedVoucher));
    } else {
      localStorage.removeItem('appliedVoucher');
    }
  }, [appliedVoucher]);

  const applyVoucher = async (code: string, cartItems: CartItem[], cartTotal: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await voucherApi.getVoucherByCode(code);
      if (!response.success || !response.data) {
        setError(response.error || 'Invalid voucher code');
        return false;
      }

      const voucher = mapVoucherDto(response.data);
      const validation = isVoucherValid(voucher, cartItems, cartTotal);
      if (!validation.valid) {
        setError(validation.reason || 'Voucher is not valid');
        return false;
      }

      const applyResponse = await voucherApi.applyVoucher({ voucherCode: code, cartTotal });
      if (!applyResponse.success || !applyResponse.data) {
        setError(applyResponse.error || 'Failed to apply voucher');
        return false;
      }

      if (!applyResponse.data.isValid) {
        setError('Voucher not valid for this cart');
        return false;
      }

      setAppliedVoucher(voucher);
      setDiscountAmount(applyResponse.data.discountApplied);
      return true;
    } catch (err) {
      setError('Network error while applying voucher');
      console.error('Failed to apply voucher:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeVoucher = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await voucherApi.removeVoucher();
      if (response.success) {
        setAppliedVoucher(null);
        setDiscountAmount(0);
      } else {
        setError(response.error || 'Failed to remove voucher');
      }
    } catch (err) {
      setError('Network error while removing voucher');
      console.error('Failed to remove voucher:', err);
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
