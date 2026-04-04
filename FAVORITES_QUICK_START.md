# Favorite System - Quick Start Guide

## Getting Started

### 1. **Enable Provider**
The `FavoritesProvider` is already integrated in `app/layout.tsx`. No additional setup needed!

### 2. **Using FavoriteButton Component**

#### In Product Cards (Icon Variant)
```tsx
import { FavoriteButton } from '@/components/favorite/FavoriteButton';
import { Product } from '@/lib/types';

function MyCard({ product }: { product: Product }) {
  return (
    <div>
      <FavoriteButton 
        product={product} 
        variant="icon"  // Minimal heart icon
        size="md"
      />
      {/* Rest of card */}
    </div>
  );
}
```

#### As Action Button (Button Variant)
```tsx
<FavoriteButton 
  product={product}
  variant="button"  // Full button with text
  className="w-full"
/>
```

### 3. **Accessing Favorites**

```tsx
import { useFavorites } from '@/lib/favorites-context';

function MyComponent() {
  const { 
    favorites,      // Favorite[]
    favoriteIds,    // Set<string>
    isFavorited,    // (productId: string) => boolean
    toggleFavorite, // (product: Product) => Promise<boolean>
    addFavorite,    // (product: Product) => Promise<boolean>
    removeFavorite  // (productId: string) => Promise<boolean>
  } = useFavorites();

  return (
    <>
      {/* Display favorites count */}
      <span>{favorites.length} favorites</span>

      {/* Check if specific product is favorited */}
      {isFavorited('product-123') && <span>♥</span>}
    </>
  );
}
```

---

## Component Variants

### FavoriteButton Options

**Icon Variant (Minimal)**
- Size: Choose from `'sm'`, `'md'`, `'lg'`
- Best for: Product cards, dense layouts
- No text, just heart icon

```tsx
<FavoriteButton product={product} variant="icon" size="md" />
```

**Button Variant (Full)**
- Text label changes based on state
- Best for: Detail pages, CTAs
- Shows "Add to Favorites" or "Favorited"

```tsx
<FavoriteButton product={product} variant="button" />
```

---

## Page Structure

### `/favorites` - Complete Favorites Page

```
Header
  └─ Navigation with Favorites Link
Breadcrumb
  └─ Home > Favorites
Page Title
  └─ "My Favorites"
FavoriteList
  └─ Grid of Products
    └─ Each with Remove button
  └─ Empty state if no favorites
Action Buttons
  └─ Continue Shopping
  └─ View All Products
```

**Access:** Navigate to `/favorites` (protected route)

---

## User Flows

### Flow 1: Add to Favorites (Not Logged In)
1. User clicks heart icon on product
2. Redirected to `/auth/login`
3. After login, favorite is saved
4. Heart becomes filled

### Flow 2: Add to Favorites (Logged In)
1. User clicks heart icon
2. Instant feedback: heart fills
3. API request syncs to backend
4. localStorage updated
5. All pages reflect change immediately

### Flow 3: View All Favorites
1. User navigates to `/favorites`
2. Page loads all favorited products
3. Grid displays with options
4. Can remove from hover menu
5. Can click to view product details

### Flow 4: Remove from Favorites
**Option A: From Product Card**
- Click filled heart → API request → Heart becomes outline

**Option B: From Favorites Page**
- Hover over product → Click "Remove" button
- Product removed from grid immediately

---

## API Integration

### Backend Endpoints Required

```
POST /api/favorites
├─ Body: { productId: string }
└─ Response: Favorite object

GET /api/favorites
└─ Response: Favorite[]

DELETE /api/favorites/:productId
└─ Response: { success: boolean }
```

### Error Handling

The system automatically handles:
- Network errors
- Missing tokens
- API failures
- Invalid product IDs

**User feedback:**
- Loading state shown
- Error logged to console
- UI remains functional

---

## Customization

### Change Heart Icon Color
Edit `components/favorite/FavoriteButton.tsx`:
```tsx
// Line ~110 - Change text-red-500 to your color
<svg className={`${sizeClasses[size]} text-red-500 fill-current`}>
```

### Change Button Styling
Edit `components/favorite/FavoriteButton.tsx`:
```tsx
// Line ~120 - Modify button variant styling
className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ...`}
```

### Change Empty State Message
In `/app/favorites/page.tsx`:
```tsx
<FavoriteList 
  favorites={favorites}
  emptyMessage="Your custom message here"
/>
```

---

## Troubleshooting

### Heart Icon Not Appearing
- Check `FavoritesProvider` is wrapped in layout
- Verify component imports are correct
- Check console for errors

### Favorites Not Persisting
- For logged-out users: Check localStorage in DevTools
- For logged-in users: Check API endpoint is correct
- Verify token is being sent with requests

### Loading State Stuck
- Check network tab for failed API requests
- Verify back end endpoint is responding
- Check console for error messages

### Redirect to Login Not Working
- Ensure user is not authenticated
- Check `useAuth()` hook returns correct state
- Verify `/auth/login` route exists

---

## Performance Tips

### Optimize Re-renders
Use React memo for frequently rendered components:
```tsx
const FavoriteButtonMemo = React.memo(FavoriteButton);
```

### Batch API Calls
If adding multiple favorites:
```tsx
await Promise.all(
  products.map(p => addFavorite(p))
);
```

### Monitor Storage Size
localStorage is limited (~5MB). With lots of favorites:
```tsx
// Check usage
const size = JSON.stringify(...).length;
console.log(`Favorites storage: ${size} bytes`);
```

---

## State Management Flow

```
User Action (Click Heart)
         ↓
    useFavorites()
         ↓
  toggleFavorite()
         ↓
    [Is Logged In?]
       /      \
     YES      NO
     /          \
   API          localStorage
   ↓             ↓
Backend       Updated
  ↓            ↓
Context State Updated
     ↓
UI Re-renders
```

---

## Mobile Responsive Behavior

### Mobile View (< 768px)
- FavoriteButton: Icon variant recommended
- Grid: 1-2 columns
- Text: Smaller sizes
- Touch-friendly hit targets (44px minimum)

### Desktop View (> 768px)
- FavoriteButton: Button variant works well
- Grid: 3-4 columns
- Full feature set
- Hover effects enabled

---

## Testing Examples

### Test Adding Favorite
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoriteButton } from '@/components/favorite/FavoriteButton';
import { FavoritesProvider } from '@/lib/favorites-context';

test('adds favorite on click', async () => {
  const product = { id: '1', name: 'Pizza', ... };
  render(
    <FavoritesProvider>
      <FavoriteButton product={product} variant="button" />
    </FavoritesProvider>
  );
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  await screen.findByText('Favorited');
});
```

---

## Common Patterns

### Pattern 1: Show Favorite Status
```tsx
const { isFavorited } = useFavorites();

<div className={isFavorited(productId) ? 'ring-2 ring-red-500' : ''}>
  {/* Product card */}
</div>
```

### Pattern 2: Quick Actions
```tsx
const { addFavorite } = useFavorites();

<button onClick={() => addFavorite(product)}>
  Save for Later
</button>
```

### Pattern 3: Favorites Count Badge
```tsx
const { favorites } = useFavorites();

<button className="relative">
  <Heart />
  {favorites.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
      {favorites.length}
    </span>
  )}
</button>
```

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- localStorage support required for offline usage
- localStorage quota: ~5MB per domain

---

## Security Notes

✅ **Implemented:**
- Token-based authentication on all API calls
- Secure localStorage usage
- Input validation (productId)
- Error handling without exposing sensitive data

⚠️ **Best Practices:**
- Never store sensitive data in localStorage
- Always validate on backend
- Use HTTPS for all API calls
- Implement rate limiting on favorites endpoint

---

## Next Steps

1. **Test the system** with real data
2. **Configure backend endpoints** to match your API
3. **Customize styling** to match your brand
4. **Add analytics** to track favorite actions
5. **Implement notifications** for favorite updates

---

## Support

For issues or questions:
1. Check the main `FAVORITES_SYSTEM.md` documentation
2. Review component code comments
3. Check console for error messages
4. Verify backend endpoints are responding
