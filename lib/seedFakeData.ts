import { getFakeStores, getFakeProducts, getFakeOrders, getFakeDashboardStats } from './fakeData';
import { useStoreStore } from '@/store/store';
import { useAuthStore } from './auth-store';

// Lightweight seeder to populate client-side stores with fake data for UI testing.
export function seedFakeData(options?: { auth?: boolean; stores?: boolean; cart?: boolean }) {
  if (typeof window === 'undefined') return false;

  const opts = { auth: true, stores: true, cart: true, ...(options || {}) };

  // expose flag for other modules
  (window as any).__USE_FAKE_DATA__ = true;

  if (opts.stores) {
    const stores = getFakeStores();
    const products = getFakeProducts();
    // populate store Zustand
    useStoreStore.setState({ stores, products, categories: [] });
  }

  if (opts.cart) {
    const products = getFakeProducts();
    const first = products[0];
    if (first) {
      const item = {
        id: `${first.id}-seed`,
        productId: first.id,
        product: first,
        quantity: 2,
        subtotal: first.price * 2,
      };
      // Persist into localStorage so CartProvider picks it up on init
      localStorage.setItem('cart', JSON.stringify([item]));
      const cartId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `cart-seed-${Date.now()}`;
      localStorage.setItem('cartId', cartId);
    }
  }

  if (opts.auth) {
    // Create a lightweight fake user and login into the auth store
    const fakeUser = {
      id: 'user_seed',
      username: 'dev_seller',
      email: 'dev@example.com',
      role: 'Seller',
    } as any;

    try {
      useAuthStore.getState().login(fakeUser, 'seed-token');
    } catch (err) {
      // ignore
    }
  }

  return true;
}

// Convenience: expose to window for quick browser console usage
if (typeof window !== 'undefined') {
  (window as any).seedFakeData = seedFakeData;
}

export default seedFakeData;
