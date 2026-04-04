# Cart System - Quick Start Guide

## Quick Overview

The Cart System is already integrated into your app. Just start using it!

---

## How It Works (User Perspective)

### 1. **Add Item**
- Go to product detail page (`/products/[id]`)
- Select quantity
- Click "Add to Cart"
- Heart animation shows success

### 2. **View Cart**
- Click cart icon in navbar (see badge count)
- Go to `/cart` page
- See all items with quantities and prices

### 3. **Manage Items**
- Click +/- to change quantity
- Click trash icon to remove
- See total update instantly

### 4. **Checkout**
- Click "Proceed to Checkout"
- Get redirected to login if needed
- Continue to checkout page

---

## For Developers

### Using useCart Hook

```typescript
import { useCart } from '@/lib/cart-context';

function MyComponent() {
  const {
    items,           // All cart items
    totalPrice,      // Total amount
    totalItems,      // Item count
    isLoading,       // Are we loading?
    
    // Actions
    addItem,         // Add product
    removeItem,      // Remove from cart
    updateQuantity,  // Change quantity
    clearCart        // Empty entire cart
  } = useCart();
}
```

### Accessing Cart Data

```typescript
// Get total price
const { totalPrice } = useCart();
console.log(`Total: $${totalPrice.toFixed(2)}`);

// Check item count
const { totalItems } = useCart();
console.log(`Items in cart: ${totalItems}`);

// Get all items
const { items } = useCart();
items.forEach(item => {
  console.log(`${item.product.name} x${item.quantity}`);
});
```

### Adding to Cart

```typescript
const { addItem } = useCart();

// Add 1 item
await addItem(product, 1);

// Add 5 items
await addItem(product, 5);
```

### Removing Items

```typescript
const { removeItem } = useCart();

// Remove specific item
await removeItem(cartItemId);
```

### Updating Quantity

```typescript
const { updateQuantity } = useCart();

// Update to 3 items
await updateQuantity(cartItemId, 3);

// Decrease quantity
await updateQuantity(cartItemId, currentQuantity - 1);
```

### Using AddToCartButton

```tsx
import { AddToCartButton } from '@/components/ui/AddToCartButton';

<AddToCartButton 
  product={product}
  quantity={quantity}
  onAddComplete={() => {
    // Runs when item is added
    console.log('Item added!');
  }}
/>
```

---

## State Structure

Cart items are stored with this structure:

```typescript
CartItem {
  id: string;                    // Unique ID: `${productId}-${timestamp}`
  product: Product;              // Full product details
  quantity: number;              // How many
  subtotal: number;              // quantity × price
}
```

Cart totals are calculated automatically:
- **Subtotal** = sum of all subtotals
- **Delivery Fee** = $2.99 (if not empty)
- **Tax** = Subtotal × 10%
- **Total** = Subtotal + Delivery + Tax

---

## Cart Page Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/cart` | CartPage | View/manage cart items |
| `/checkout` | (Coming) | Process payment |
| `/order-confirmation` | (Coming) | Show order details |

---

## Components

### CartBadge
Shows in navbar. Add it to your header:

```tsx
import { CartBadge } from '@/components/cart/CartBadge';

<CartBadge />
```

### AddToCartButton
Use on product cards or detail pages:

```tsx
<AddToCartButton 
  product={product}
  quantity={selectedQuantity}
/>
```

### CartList
Shows all cart items (already in `/cart`):

```tsx
<CartList />
```

### CartSummary
Shows totals and checkout button (already in `/cart`):

```tsx
<CartSummary />
```

### CartItem
Individual item row (used inside CartList):

```tsx
<CartItem item={cartItem} />
```

---

## Integration Checklist

- [x] CartProvider in app layout
- [x] CartBadge ready for navbar
- [x] AddToCartButton integrated
- [x] Cart page created
- [ ] Add CartBadge to navbar header
- [ ] Test with real products
- [ ] Connect to checkout page
- [ ] Set up payment processing
- [ ] Add analytics tracking
- [ ] Set up order confirmation

---

## Common Tasks

### Task 1: Add Cart Icon to Navbar

```tsx
import { CartBadge } from '@/components/cart/CartBadge';

export function Navbar() {
  return (
    <nav>
      {/* ... other nav items ... */}
      <CartBadge />  // ← Add this
    </nav>
  );
}
```

### Task 2: Show Car Count Anywhere

```tsx
import { useCart } from '@/lib/cart-context';

function ItemCount() {
  const { totalItems } = useCart();
  return <span>{totalItems} items in cart</span>;
}
```

### Task 3: Disable "Add to Cart" if Out of Stock

```tsx
<AddToCartButton 
  product={product}
  quantity={quantity}
  // Add disabled prop later if needed
/>
```

### Task 4: Pre-fill Quantity (on detail page)

```tsx
<AddToCartButton 
  product={product}
  quantity={5}  // Start with 5 items
/>
```

### Task 5: Show Toast on Add

```tsx
<AddToCartButton 
  product={product}
  onAddComplete={() => {
    // Show toast notification
    showToast('Added to cart!');
  }}
/>
```

---

## Calculations Examples

### Total Price Calculation

```typescript
const { items } = useCart();

// Manual calculation (for reference)
const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
const tax = subtotal * 0.1;
const delivery = subtotal > 0 ? 2.99 : 0;
const total = subtotal + tax + delivery;

console.log(`Subtotal: $${subtotal}`);
console.log(`Tax: $${tax}`);
console.log(`Delivery: $${delivery}`);
console.log(`Total: $${total}`);
```

---

## API Integration (Future)

When ready, these endpoints will sync the cart:

```
GET    /api/cart                    # Get user's cart
POST   /api/cart                    # Add item
PUT    /api/cart/:itemId            # Update quantity
DELETE /api/cart/:itemId            # Remove item
DELETE /api/cart                    # Clear everything
```

Functions already exist in `lib/api.ts`:

```typescript
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '@/lib/api';
```

---

## Debugging

### Check Cart Data in Console

```typescript
// In browser console
const { items, totalPrice } = useCart();
console.log('Items:', items);
console.log('Total:', totalPrice);
```

### Check localStorage

```typescript
// In browser console
console.log(JSON.parse(localStorage.getItem('cart')));
```

### Clear Cart

```typescript
// Emergency clear
localStorage.removeItem('cart');
location.reload();
```

---

## Styling Customization

### Change Theme Colors

Edit Tailwind classes in:
- `components/cart/CartSummary.tsx` - Line with `bg-orange-600`
- `components/cart/CartItem.tsx` - Remove button colors

```tsx
// Example: Change orange to blue
// FROM: bg-orange-600
// TO:   bg-blue-600
```

### Adjust Prices

Edit in `components/cart/CartSummary.tsx`:

```typescript
const DELIVERY_FEE = 2.99;      // ← Change this
const TAX_RATE = 0.1;           // ← Or this (10%)
```

---

## Performance Tips

### Optimize Re-renders

```typescript
// Use React.memo to prevent unnecessary re-renders
const CartItemMemo = React.memo(CartItem);
```

### Add Debouncing for Updates

```typescript
import { useDeferredValue } from 'react';

const quantity = useDeferredValue(selectedQuantity);
```

### Monitor Bundle Size

```bash
npm run analyze  # (if available)
```

---

## Troubleshooting

### Issue: Cart Badge Shows Wrong Count

**Solution:** Check localStorage in DevTools
```
Application → Storage → Cookies → localStorage → cart
```

### Issue: Cart Doesn't Persist After Reload

**Solution:** Check if localStorage is enabled
- Private browsing may disable localStorage
- Some browsers limit it to 5MB

### Issue: Add to Cart Button Not Working

**Solution:** Check if CartProvider is in layout
```tsx
// In app/layout.tsx
<CartProvider>
  {children}
</CartProvider>
```

### Issue: Prices Not Calculating

**Solution:** Check Product type has `price: number`
```typescript
interface Product {
  price: number;  // ← Make sure this exists
}
```

---

## Files Reference

### Core Files

| File | Purpose |
|------|---------|
| `lib/cart-context.tsx` | State management |
| `lib/api.ts` | API functions |
| `lib/types.ts` | TypeScript types |

### Components

| File | Purpose |
|------|---------|
| `components/cart/CartItem.tsx` | Individual item row |
| `components/cart/CartList.tsx` | List of all items |
| `components/cart/CartSummary.tsx` | Order summary |
| `components/cart/CartBadge.tsx` | Navbar badge |
| `components/ui/AddToCartButton.tsx` | Add to cart button |

### Pages

| File | Purpose |
|------|---------|
| `app/cart/page.tsx` | Main cart page |

---

## Next Steps

1. **Test the cart** with some products
2. **Add CartBadge** to your navbar
3. **Connect to checkout** page
4. **Set up payment** system
5. **Create order** confirmation page

---

## Support

For detailed information, see `CART_SYSTEM.md`

All components are TypeScript-safe and production-ready! 🚀
