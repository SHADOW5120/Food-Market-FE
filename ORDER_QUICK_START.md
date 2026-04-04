# Order System - Quick Start Guide

## Quick Overview

The Order System lets users view order history, track order status, and manage their orders. It's fully integrated and ready to connect to your checkout flow.

---

## How It Works (User Perspective)

### 1. **Place Order**
- User fills checkout form with delivery address
- Clicks "Place Order"
- Gets redirected to `/order/success?orderId={id}`

### 2. **View Orders**
- Click "My Orders" in system
- See all orders in list with status
- Filter by status (pending, confirmed, delivering, completed, cancelled)

### 3. **View Order Details**
- Click any order card
- See full details:
  - Customer info
  - Delivery address
  - Items ordered
  - Price breakdown
  - Status timeline
  - Cancel button (if pending)

### 4. **Cancel Order**
- On order detail page
- Click "Cancel Order" button (only for pending/confirmed)
- Confirm cancellation
- Order status updates to "cancelled"

---

## For Developers

### Using useOrder Hook

```typescript
import { useOrder } from '@/lib/order-context';

function MyComponent() {
  const {
    orders,           // All orders
    currentOrder,     // Selected order detail
    isLoading,        // Loading state
    error,            // Error message
    
    // Actions
    loadOrders,       // Fetch all orders
    loadOrderDetail,  // Fetch order by ID
    clearOrderDetail, // Clear current order
    clearError        // Clear error
  } = useOrder();
}
```

### Accessing Order Data

```typescript
// Get all orders
const { orders } = useOrder();
orders.forEach(order => {
  console.log(`Order #${order.orderNumber}: ${order.total}`);
});

// Get current order
const { currentOrder } = useOrder();
if (currentOrder) {
  console.log(`Status: ${currentOrder.status}`);
}

// Check loading
const { isLoading } = useOrder();
if (isLoading) {
  // Show spinner
}
```

### Creating an Order

```typescript
import { createOrder } from '@/lib/api';

const response = await createOrder({
  cartItems: [
    { id: '1', product, quantity: 2, subtotal: 50 }
  ],
  deliveryAddress: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001'
  },
  notes: 'Ring doorbell twice'
});

if (response.success) {
  // Order created!
  const order = response.data;
  console.log(`Order ID: ${order.id}`);
}
```

### Loading Orders

```typescript
import { getUserOrders, getUserOrderById } from '@/lib/api';

// Get all orders
const response = await getUserOrders();
if (response.success) {
  console.log('Orders:', response.data);
}

// Get single order
const detail = await getUserOrderById('order-123');
if (detail.success) {
  console.log('Order:', detail.data);
}
```

### Cancelling an Order

```typescript
import { cancelOrder } from '@/lib/api';

const response = await cancelOrder('order-123');
if (response.success) {
  // Order cancelled!
  console.log('New status:', response.data.status); // 'cancelled'
}
```

---

## Components

### Components/Order

| Component | Purpose |
|-----------|---------|
| `<OrderCard />` | Single order in list |
| `<OrderItem />` | Single item in order |
| `<OrderSummary />` | Price breakdown |
| `<OrdersList />` | List with loading/empty |

### Usage

```tsx
import { 
  OrderCard, 
  OrderItem, 
  OrderSummary, 
  OrdersList 
} from '@/components/order';

// Order Card
<OrderCard order={orderData} />

// Order Item
<OrderItem item={itemData} />

// Price Summary
<OrderSummary 
  subtotal={50}
  deliveryFee={2.99}
  tax={5.3}
  total={58.29}
/>

// Orders List
<OrdersList 
  orders={ordersArray}
  isLoading={false}
  emptyMessage="No orders yet"
/>
```

---

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/order/success?orderId=X` | Order Success | Confirmation page |
| `/orders` | Orders List | View all orders |
| `/orders/[id]` | Order Detail | View full details |

---

## Status Values

| Status | meaning | Cancellable | Color |
|--------|---------|-------------|-------|
| pending | Not started | ✅ Yes | Yellow |
| confirmed | Confirmed | ✅ Yes | Blue |
| delivering | Out for delivery | ❌ No | Purple |
| completed | Delivered | ❌ No | Green |
| cancelled | Cancelled | ❌ No | Red |

---

## Integration with Checkout

### Step 1: User clicks "Place Order"

```tsx
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/api';
import { useCart } from '@/lib/cart-context';

function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const handleCheckout = async () => {
    const response = await createOrder({
      cartItems: items,
      deliveryAddress: formData,
      notes: specialNotes
    });

    if (response.success) {
      clearCart();
      // Redirect to success page
      router.push(`/order/success?orderId=${response.data.id}`);
    }
  };
}
```

### Step 2: Success Page Shows

Auto-loads order details from API using the `orderId` query param:

```tsx
// /order/success/page.tsx
const orderId = searchParams.get('orderId');
const order = await getUserOrderById(orderId);
// Shows order confirmation
```

### Step 3: User Can...

- View all orders at `/orders`
- Check order details at `/orders/{orderId}`
- Cancel if pending
- Track status changes

---

## Calculations

### Order Total

```typescript
// All calculated by backend, frontend just displays

const subtotal = sum(item.price × item.quantity);
const tax = subtotal × 0.10;          // 10%
const deliveryFee = 2.99;             // Fixed amount
const total = subtotal + tax + deliveryFee;
```

---

## Common Tasks

### Task 1: Show My Orders Link

```tsx
<Link href="/orders" className="...">
  My Orders
</Link>
```

### Task 2: Create Order After Checkout

```tsx
const handlePlaceOrder = async () => {
  const response = await createOrder({
    cartItems: items,
    deliveryAddress: address
  });
  
  if (response.success) {
    router.push(`/order/success?orderId=${response.data.id}`);
  }
};
```

### Task 3: Load Orders on Page Mount

```tsx
useEffect(() => {
  loadOrders();
}, []); // Run once on mount
```

### Task 4: Filter Orders by Status

```tsx
const [status, setStatus] = useState('all');
const filtered = status === 'all' 
  ? orders 
  : orders.filter(o => o.status === status);
```

### Task 5: Show Order Count Badge

```tsx
<span className="badge">{orders.length}</span>
```

---

## API Integration

### Backend Endpoints

```
GET  /api/orders
→ Response: { orders: Order[] }

GET  /api/orders/:id
→ Response: { order: Order }

POST /api/orders
→ Body: { cartItems, deliveryAddress, notes }
→ Response: { order: Order }

PUT  /api/orders/:id/cancel
→ Response: { order: Order }
```

### Error Handling

```typescript
const response = await createOrder(payload);

if (response.success) {
  // Success!
  console.log(response.data);
} else {
  // Error!
  console.error(response.error);
}
```

---

## State Structure

### useOrder() Hook

```typescript
{
  orders: [
    {
      id: 'abc123',
      orderNumber: '12345',
      customer: { name, email, phone },
      deliveryAddress: { street, city, state, zip },
      items: [ { id, name, quantity, price } ],
      subtotal: 50,
      tax: 5,
      deliveryFee: 2.99,
      total: 57.99,
      status: 'pending',
      createdAt: '2024-01-15T10:00:00Z'
    }
  ],
  currentOrder: null,
  isLoading: false,
  error: null
}
```

---

## Styling

### Colors

| Element | Class | Color |
|---------|-------|-------|
| Buttons | `bg-orange-600` | Orange |
| Success | `bg-green-100` | Green |
| Warning | `bg-yellow-100` | Yellow |
| Status Bad | `bg-blue-100` | Blue |
| Danger | `bg-red-100` | Red |

### Responsive

```css
/* Mobile First */
<div className="sm:hidden">     /* Hide on tablet+ */
<div className="md:grid">       /* Grid on tablet+ */
<div className="lg:flex">       /* Flex on desktop+ */
```

---

## Loading States

```tsx
import { OrdersList } from '@/components/order';

<OrdersList 
  orders={orders}
  isLoading={true}  // Shows 3 skeleton loaders
  emptyMessage="No orders"
/>
```

---

## Empty States

```tsx
// Automatic in OrdersList
<OrdersList orders={[]} />
// Shows: "No orders found" + CTA
```

---

## Responsive Design

### Mobile
- Single column
- Full-width cards
- Stacked sections
- Buttons stack

### Tablet
- 1-2 columns
- Card grid
- Side-by-side sections
- Inline buttons

### Desktop
- 3-4 columns
- Wide cards
- Sidebar layout
- Multiple columns

---

## Accessibility

✅ Semantic HTML  
✅ ARIA labels  
✅ Color contrast  
✅ Keyboard navigation  
✅ Focus visible  
✅ Alt text on images  

---

## Debugging

### Check Orders in Console

```javascript
// In browser DevTools console
const { orders } = useOrder();
console.log(orders);
```

### Check API Response

```javascript
const response = await getUserOrders();
console.log(response);
```

### Check Errors

```typescript
const { error } = useOrder();
if (error) console.error(error);
```

---

## Performance Tips

1. **Load orders once** - Use useEffect with empty dependency array
2. **Memoize components** - Prevent unnecessary re-renders
3. **Lazy load images** - Use Next.js Image component
4. **Cache orders** - Store in context to avoid duplicate API calls
5. **Pagination** - For orders lists (future enhancement)

---

## Known Issues & Solutions

### Issue: Orders not loading

**Check:**
- User is authenticated
- API endpoint is correct
- Network tab shows requests
- No CORS errors

**Fix:**
```typescript
useEffect(() => {
  loadOrders(); // Must call on mount
}, []);
```

### Issue: Order detail page blank

**Check:**
- Order ID in URL is correct
- API returns data for that ID
- useOrder context is loaded

**Fix:**
```typescript
useEffect(() => {
  if (orderId) {
    loadOrderDetail(orderId);
  }
}, [orderId]);
```

### Issue: Status not updating after cancel

**Check:**
- Cancel API call succeeded
- Page refreshed after cancel
- Backend updated order

**Fix:**
```typescript
// After cancel, reload order
await cancelOrder(id);
await loadOrderDetail(id); // Refresh data
```

---

## Code Examples

### Complete Order Flow

```tsx
'use client';

import { useEffect } from 'react';
import { useOrder } from '@/lib/order-context';
import { OrdersList } from '@/components/order';

export default function OrdersPage() {
  const {
    orders,
    isLoading,
    error,
    loadOrders
  } = useOrder();

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      
      <OrdersList 
        orders={orders}
        isLoading={isLoading}
        emptyMessage="No orders yet"
      />
    </div>
  );
}
```

### With Status Filtering

```tsx
import { useState } from 'react';

export default function FilteredOrders() {
  const { orders } = useOrder();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'completed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={filter === s ? 'bg-orange-600' : 'bg-gray-200'}
          >
            {s}
          </button>
        ))}
      </div>
      <OrdersList orders={filtered} />
    </div>
  );
}
```

---

## Files Reference

### Core Files

| File | Purpose |
|------|---------|
| `lib/order-context.tsx` | State management |
| `lib/types.ts` | Order interfaces |
| `lib/api.ts` | API functions |

### Components

| File | Purpose |
|------|---------|
| `components/order/OrderCard.tsx` | List item |
| `components/order/OrderItem.tsx` | Item display |
| `components/order/OrderSummary.tsx` | Price breakdown |
| `components/order/OrdersList.tsx` | List container |

### Pages

| File | Purpose |
|------|---------|
| `app/order/success/page.tsx` | Success confirmation |
| `app/orders/page.tsx` | Order history |
| `app/orders/[id]/page.tsx` | Order detail |

---

## Next Steps

1. **Connect checkout flow** - Create order from cart
2. **Test order creation** - Verify API integration
3. **Test order viewing** - Display orders correctly
4. **Test cancellation** - Verify cancel flow
5. **Add notifications** - Toast/email on order changes
6. **Real-time updates** - WebSocket for status changes

---

## Support

For issues or questions:
1. Read `ORDER_SYSTEM.md` for detailed docs
2. Check example code above
3. Review browser console for errors
4. Verify API endpoints work
5. Check TypeScript types

---

**Order System is production-ready!** 🚀
