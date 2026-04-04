'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useVoucher } from '@/lib/voucher-context';
import { CartList } from '@/components/cart/CartList';
import { VoucherSection } from '@/components/voucher';
import { createOrder } from '@/lib/api';

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.1;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { appliedVoucher, discountAmount } = useVoucher();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [items.length, cartLoading, router]);

  const subtotal = totalPrice;
  const tax = subtotal * TAX_RATE;
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + deliveryFee - discountAmount;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || items.length === 0) return;

    setIsProcessing(true);
    try {
      const orderPayload = {
        cartItems: items,
        deliveryAddress,
        notes: specialInstructions,
        voucherCode: appliedVoucher?.code,
      };

      const response = await createOrder(orderPayload);

      if (response.success && response.data) {
        // Clear cart and redirect to success page
        clearCart();
        router.push(`/order/success?orderId=${response.data.id}`);
      } else {
        alert('Failed to place order: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || cartLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl">🍽️</div>
              <h1 className="text-2xl font-bold text-gray-900">Food Market</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium">
                Menu
              </Link>
              <Link href="/cart" className="text-orange-600 hover:text-orange-700 font-medium">
                Cart
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <Link href="/cart" className="text-gray-500 hover:text-gray-700">
                Cart
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">Checkout</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
              </div>
              <div className="p-6">
                <CartList />
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="NY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.zip}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-gray-900">${deliveryFee.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount ({appliedVoucher?.code})</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-orange-600">${total.toFixed(2)}</p>
              </div>

              {/* Voucher Section */}
              <div className="mb-6">
                <VoucherSection compact={true} />
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zip}
                className={`w-full py-3 font-bold rounded-lg transition-colors mb-3 ${
                  isProcessing || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zip
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {isProcessing ? 'Placing Order...' : 'Place Order'}
              </button>

              <Link
                href="/cart"
                className="block w-full py-3 font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-center"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}