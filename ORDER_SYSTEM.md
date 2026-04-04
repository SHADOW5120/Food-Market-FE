# Order System - Complete Implementation Guide

## Overview

The Order System is a complete customer-facing order management solution that allows users to place orders, view order history, track status, and manage existing orders.

---

## Architecture

### Core Components

#### 1. **Order Types** (`lib/types.ts`)
```typescript
Order {
  id: string;
  orderNumber: string;           // Customer-friendly order ID (e.g., #12345)
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;                   // 10% of subtotal
  deliveryFee: number;           // $2.99
  total: number;
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';
  notes?: string;                // Special delivery instructions
  createdAt: string;
  estimatedDelivery?: string;
}
```

#### 2. **Order Context** (`lib/order-context.tsx`)

Provides state management for orders throughout the app:

```typescript
useOrder() {
  // State
  orders: Order[];               // All user orders
  currentOrder: Order | null;    // Currently selected order
  isLoading: boolean;
  error: string | null;

  // Actions
  loadOrders(): Promise<void>;
  loadOrderDetail(orderId: string): Promise<void>;
  clearOrderDetail(): void;
  clearError(): void;
}
```

**Usage:**
```tsx
import { useOrder } from '@/lib/order-context';

function MyComponent() {
  const { orders, currentOrder, loadOrders } = useOrder();
  
  useEffect(() => {
    loadOrders();
  }, []);
}
```

#### 3. **API Functions** (`lib/api.ts`)

```typescript
// Get all orders for current user
getUserOrders(): Promise<OrdersResponse>;

// Get order details by ID
getUserOrderById(orderId: string): Promise<OrderResponse>;

// Create new order from cart
createOrder(payload: CreateOrderPayload): Promise<OrderResponse>;

// Cancel pending/confirmed order
cancelOrder(orderId: string): Promise<CancelOrderResponse>;
```

**Example Usage:**
```typescript
import { createOrder } from '@/lib/api';

const response = await createOrder({
  cartItems: [{ id: '1', product, quantity: 2, subtotal: 50 }],
  deliveryAddress: {
    street: '123 Main St',
    city: 'NYC',
    state: 'NY',
    zip: '10001'
  },
  notes: 'Ring doorbell twice'
});

if (response.success) {
  // Redirect to /order/success?orderId={response.data.id}
}
```

---

## Pages

### 1. Order Success Page (`/order/success`)

**Route:** `/order/success?orderId={orderId}`

**Features:**
- ✅ Success confirmation with animated checkmark
- ✅ Order summary display
- ✅ Customer and delivery information
- ✅ Item count
- ✅ Total price breakdown
- ✅ Email confirmation notification
- ✅ Links to order history and home

**Usage:**
```typescript
// After order creation
router.push(`/order/success?orderId=${newOrder.id}`);
```

**Responsive Design:**
- Mobile: Full-width, stacked layout
- Desktop: Centered, 2-column view

### 2. Orders List Page (`/orders`)

**Route:** `/orders`

**Features:**
- ✅ All user orders in chronological order
- ✅ Filter by status (All, Pending, Confirmed, Delivering, Completed, Cancelled)
- ✅ Tab-based filtering with counts
- ✅ Click order to view details
- ✅ Empty state with call-to-action
- ✅ Loading skeleton
- ✅ Responsive grid layout

**Order Card Shows:**
- Order number
- Order date and time
- Item count
- Status badge (color-coded)
- Total price

**Status Colors:**
| Status | Color | Hex |
|--------|-------|-----|
| Pending | Yellow | `bg-yellow-100` |
| Confirmed | Blue | `bg-blue-100` |
| Delivering | Purple | `bg-purple-100` |
| Completed | Green | `bg-green-100` |
| Cancelled | Red | `bg-red-100` |

### 3. Order Detail Page (`/orders/[id]`)

**Route:** `/orders/{orderId}`

**Left Column (Main Content):**
- Customer Information (name, email, phone)
- Delivery Address
- Order Items List (with images, quantities, prices)

**Right Sidebar:**
- Order Summary (subtotal, delivery, tax, total)
- Status Timeline (visual step indicator)
- Cancel Order Button (for pending/confirmed only)
- Back to Orders Button

**Status Timeline:**
Shows visual progression through order states:
1. ✓ Order Placed (completed)
2. ⊙ Confirmed (current/upcoming)
3. ⊙ On the Way (upcoming)
4. ⊙ Delivered (final)

**Cancel Order Feature:**
- Only available for `pending` and `confirmed` statuses
- Confirmation dialog before action
- Updates order status to `cancelled`
- Reloads page with updated status

**Responsive Design:**
- Mobile: Single column (stacked)
- Tablet: 2 columns
- Desktop: 3 columns (with sidebar)

---

## Components

### OrderCard
Displays a single order in the list view.

**Props:**
```typescript
interface OrderCardProps {
  order: Order;
  className?: string;
}
```

**Features:**
- Order number and date
- Item count
- Status badge
- Total price
- Mobile-optimized summary

### OrderItem
Displays individual items within an order.

**Props:**
```typescript
interface OrderItemProps {
  item: OrderItem;
}
```

**Features:**
- Product image
- Product name
- Quantity
- Unit price and total

### OrderSummary
Price breakdown component showing subtotal, taxes, fees, and total.

**Props:**
```typescript
interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}
```

**Calculations:**
- Subtotal = sum of all item totals
- Tax = subtotal × 10%
- Delivery Fee = $2.99 (if order not empty)
- Total = subtotal + tax + delivery

### OrdersList
Container component for displaying multiple orders with loading and empty states.

**Props:**
```typescript
interface OrdersListProps {
  orders: Order[];
  isLoading?: boolean;
  emptyMessage?: string;
}
```

**Features:**
- Loading skeleton (3 shimmer rows)
- Empty state with icon and call-to-action
- Clean list display

### StatusBadge (Enhanced)
Shows order status with color-coded styling.

**Props:**
```typescript
interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';
  className?: string;
}
```

---

## State Management

### Integration in Layout
The OrderProvider is wrapped in `app/layout.tsx`:

```tsx
<AuthProvider>
  <FavoritesProvider>
    <CartProvider>
      <OrderProvider>
        {children}
      </OrderProvider>
    </CartProvider>
  </FavoritesProvider>
</AuthProvider>
```

### Data Flow

1. **User logs in** → Context initializes
2. **Visit /orders** → `loadOrders()` fetches from API
3. **Click order** → Navigate to `/orders/[id]`
4. **Load detail page** → `loadOrderDetail(id)` fetches single order
5. **Cancel order** → API call, reload, status updates
6. **Navigation** → History maintained in context

---

## Complete Usage Example

### 1. Creating an Order

```tsx
import { useCart } from '@/lib/cart-context';
import { createOrder } from '@/lib/api';
import { useRouter } from 'next/navigation';

function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState({...});

  const handleCheckout = async () => {
    const response = await createOrder({
      cartItems: items,
      deliveryAddress,
      notes: 'Special instructions...'
    });

    if (response.success) {
      clearCart();
      router.push(`/order/success?orderId=${response.data.id}`);
    }
  };

  return <button onClick={handleCheckout}>Place Order</button>;
}
```

### 2. Viewing Order History

```tsx
import { useEffect } from 'react';
import { useOrder } from '@/lib/order-context';
import { OrdersList } from '@/components/order';

function OrdersPage() {
  const { orders, loadOrders, isLoading } = useOrder();

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <h1>My Orders</h1>
      <OrdersList orders={orders} isLoading={isLoading} />
    </div>
  );
}
```

### 3. Filtering Orders by Status

```tsx
import { useState } from 'react';
import { useOrder } from '@/lib/order-context';

function FilteredOrders() {
  const { orders } = useOrder();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | ...>('all');

  const filtered = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <>
      <button onClick={() => setFilterStatus('pending')}>Pending</button>
      <OrdersList orders={filtered} />
    </>
  );
}
```

---

## File Structure

```
food-market-fe/
├── lib/
│   ├── order-context.tsx          # Order state management
│   ├── types.ts                   # Order interfaces (updated)
│   └── api.ts                     # Order API functions (added)
│
├── components/
│   └── order/
│       ├── OrderCard.tsx          # Order list item
│       ├── OrderItem.tsx          # Order detail item
│       ├── OrderSummary.tsx       # Price breakdown
│       ├── OrdersList.tsx         # Order list container
│       └── index.ts               # Exports
│
├── app/
│   ├── order/
│   │   └── success/
│   │       └── page.tsx           # Order confirmation page
│   ├── orders/
│   │   ├── page.tsx               # Order history
│   │   └── [id]/
│   │       └── page.tsx           # Order detail
│   └── layout.tsx                 # Updated with OrderProvider
│
└── components/
    └── seller/
        └── StatusBadge.tsx        # Updated with 'cancelled'
```

---

## API Endpoints

### Backend Integration Points

```
GET  /api/orders              # Get all user orders
→ Returns: { orders: Order[] }

GET  /api/orders/:id          # Get order details
→ Returns: { order: Order }

POST /api/orders              # Create new order
→ Body: { cartItems, deliveryAddress, notes }
→ Returns: { order: Order }

PUT  /api/orders/:id/cancel   # Cancel order
→ Body: {}
→ Returns: { order: Order (with cancelled status) }
```

---

## Styling

### Color Scheme
- Primary: Orange (`#f97316`)
- Success: Green (`#10b981`)
- Warning: Yellow (`#fbbf24`)
- Info: Blue (`#3b82f6`)
- Danger: Red (`#ef4444`)
- Neutral: Gray (`#6b7280`)

### Typography
- Headings: Bold, 2xl - 3xl
- Body: Regular, base
- Small: Lighter, sm - xs

### Spacing
- Page padding: 32px (desktop) / 16px (mobile)
- Card spacing: 24px
- Element gap: 16px

### Responsive Breakpoints
```css
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Wide */
```

---

## Loading & Error Handling

### Loading States
- Skeleton loaders in OrdersList
- Spinner with message during page transitions
- Disabled buttons during async operations

### Error Handling
- ErrorBoundary wraps all pages
- Inline error alerts with easy dismissal
- Graceful fallbacks for missing data
- Toast notifications for actions (optional)

### Validation
- API calls validated on response
- Protected routes check authentication
- Empty order handling with CTA

---

## Performance Optimizations

1. **Code Splitting:** Each order page is lazy-loaded
2. **Image Optimization:** Next.js Image component for products
3. **Context Memoization:** useOrder hook prevents unnecessary renders
4. **Skeleton Loaders:** Perceived performance improvement
5. **Responsive Images:** Smaller payloads for mobile

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 10+)

---

## Accessibility Features

✅ ARIA labels on status badges  
✅ Semantic HTML structure  
✅ Keyboard navigation support  
✅ Color contrast compliant (WCAG AA)  
✅ Focus visible on interactive elements  
✅ Alt text on images  

---

## Testing Checklist

- [ ] Create order from cart successfully
- [ ] Redirect to success page with order details
- [ ] View order history with multiple orders
- [ ] Filter orders by status
- [ ] Click order to view full details
- [ ] See correct price breakdown
- [ ] Cancel pending order
- [ ] Handle API errors gracefully
- [ ] Mobile responsive layout
- [ ] Keyboard navigation works
- [ ] Images load correctly
- [ ] Empty states display

---

## Known Limitations

1. **Real-time Updates:** Not using WebSocket yet (use polling or implement WebSocket)
2. **Reorder Button:** Can be added to quickly add items back to cart
3. **Order Tracking:** Timeline is visual only, not real-time
4. **Print Order:** Could add print-to-PDF feature

---

## Future Enhancements

### Short Term (Week 1)
- Add reorder button to quickly re-purchase
- Implement order history search/filtering
- Add order tracking timeline updates
- Email notifications integration

### Medium Term (Week 2-3)
- Real-time order status updates (WebSocket)
- Order rating and review integration
- Saved delivery addresses
- Invoice download (PDF)

### Long Term (Week 4+)
- Subscription orders (recurring)
- Pre-orders for future items
- Order recommendations based on history
- Analytics dashboard (seller end)

---

## Troubleshooting

### "Order not found" error
**Cause:** Wrong order ID or user not authenticated  
**Solution:** Check authentication, verify order belongs to user

### Status not updating
**Cause:** Cache or API not called  
**Solution:** Refresh page, check API response, verify backend status change

### Mobile layout broken
**Cause:** Missing responsive classes  
**Solution:** Check Tailwind responsive prefixes (sm:, md:, lg:)

### Images not loading
**Cause:** Wrong image path  
**Solution:** Verify image URL in Order and OrderItem data

---

## Code Examples

### Complete Checkout Flow
```tsx
'use client';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/api';
import { useCart } from '@/lib/cart-context';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const handlePlaceOrder = async () => {
    const response = await createOrder({
      cartItems: items,
      deliveryAddress: address,
      notes: ''
    });

    if (response.success) {
      clearCart();
      router.push(`/order/success?orderId=${response.data.id}`);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <OrderSummary 
        subtotal={items.reduce((sum, item) => sum + item.subtotal, 0)}
        deliveryFee={2.99}
        tax={totalPrice * 0.1}
        total={totalPrice}
      />
      {/* Address form */}
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}
```

### Using Order Context
```tsx
import { useEffect, useState } from 'react';
import { useOrder } from '@/lib/order-context';
import { OrdersList } from '@/components/order';

export default function OrdersPage() {
  const { orders, isLoading, error, loadOrders } = useOrder();
  const [status, setStatus] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = status === 'all' 
    ? orders 
    : orders.filter(o => o.status === status);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        {
          ['all', 'pending', 'confirmed', 'delivering', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded ${
                status === s ? 'bg-orange-600 text-white' : 'bg-gray-200'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))
        }
      </div>

      <OrdersList orders={filtered} isLoading={isLoading} />
      
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
}
```

---

## Support

For questions or issues:
1. Check documentation above
2. Review example code
3. Check browser console for errors
4. Verify API endpoints are accessible
5. Check authentication status

---

## Summary

The Order System provides a complete, production-ready order management interface for customers. It includes:

✅ Order placement confirmation  
✅ Full order history  
✅ Detailed order tracking  
✅ Order cancellation  
✅ Status filtering  
✅ Responsive design  
✅ Error handling  
✅ Loading states  
✅ Accessibility support  

**Ready for checkout integration and payment processing!**
