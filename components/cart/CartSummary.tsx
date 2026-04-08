'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useVoucher } from '@/lib/voucher-context';
import { VoucherSection } from '@/components/voucher';

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.1; // 10%

export function CartSummary() {
  const { items, totalPrice, totalItems, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { discountAmount } = useVoucher();
  const router = useRouter();

  const subtotal = totalPrice;
  const tax = subtotal * TAX_RATE;
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + deliveryFee - discountAmount;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-20">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
        {/* Items */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
          <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        {/* Delivery Fee */}
        {!isEmpty && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-semibold text-gray-900">${deliveryFee.toFixed(2)}</span>
          </div>
        )}

        {/* Tax */}
        {!isEmpty && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tax (10%)</span>
            <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
          </div>
        )}

        {/* Discount (if any) */}
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Discount</span>
            <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-gray-600 text-sm mb-1">Total Amount</p>
        <p className="text-3xl font-bold text-orange-600">${total.toFixed(2)}</p>
      </div>

      {/* Voucher Section */}
      {!isEmpty && (
        <div className="mb-6">
          <VoucherSection />
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isEmpty}
        className={`w-full py-3 font-bold rounded-lg transition-colors mb-3 ${
          isEmpty
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-orange-600 text-white hover:bg-orange-700'
        }`}
      >
        {!isAuthenticated ? 'Login to Checkout' : 'Proceed to Checkout'}
      </button>

      {/* Continue Shopping */}
      <button
        onClick={() => router.push('/products')}
        className="w-full py-3 font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Continue Shopping
      </button>

      {/* Info */}
      {!isEmpty && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            ✓ Free delivery on orders above $50
          </p>
        </div>
      )}
    </div>
  );
}
