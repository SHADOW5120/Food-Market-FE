'use client';

import { ChevronRight, ShoppingCart } from 'lucide-react';
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
  const { cartId, items, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
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
      router.push('/login?redirect=/checkout');
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
    if (!isAuthenticated || items.length === 0 || !cartId) return;

    setIsProcessing(true);
    try {
      const orderPayload = {
        cartId,
        deliveryAddress,
        paymentMethod: 'COD',
        notes: specialInstructions,
        voucherCode: appliedVoucher?.code,
        items: items.map((item) => ({
          id: item.id,
          productId: item.productId,
          product: item.product,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
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
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground mb-4 flex items-center justify-center">
            <ShoppingCart className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </li>
            <li>
              <Link href="/cart" className="text-muted-foreground hover:text-foreground">
                Cart
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </li>
            <li className="text-foreground font-medium">Checkout</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-card rounded-xl border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] overflow-hidden">
              <div className="p-6 border-b border-[color:hsl(var(--border))]">
                <h2 className="text-xl font-bold text-foreground">Order Items</h2>
              </div>
              <div className="p-6">
                <CartList />
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-card rounded-xl border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-4 py-3 border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="NY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.zip}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full px-4 py-3 border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-3 border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted rounded-xl border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] p-6 sticky top-20">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-[color:hsl(var(--border))]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-semibold text-foreground">${deliveryFee.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-success">
                    <span>Discount ({appliedVoucher?.code})</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))]">
                <p className="text-muted-foreground text-sm mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-primary">${total.toFixed(2)}</p>
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
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary'
                }`}
              >
                {isProcessing ? 'Placing Order...' : 'Place Order'}
              </button>

              <Link
                href="/cart"
                className="block w-full py-3 font-semibold text-foreground border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg hover:bg-muted transition-colors text-center"
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


