import { getFakeStores, getFakeProducts, getFakeOrders, getFakeDashboardStats, getFakeCategories, getFakeUser, getFakeFavorites } from '../fakeData';

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function randomLatency() {
  return 200 + Math.floor(Math.random() * 600);
}

function ensureMockState() {
  const win = window as any;
  if (!win.__MOCK_STATE__) {
    win.__MOCK_STATE__ = {
      favorites: getFakeFavorites(),
      users: [getFakeUser()],
      stores: getFakeStores(),
      products: getFakeProducts(),
      orders: getFakeOrders(),
      cart: {
        id: 'cart_seed',
        items: [],
        totalPrice: 0,
      },
    };
  }
  return win.__MOCK_STATE__;
}

export async function mockFetch(endpoint: string, method = 'GET', body?: any) {
  // Normalize endpoint path (strip query and base)
  const url = endpoint.split('?')[0];
  const path = url.replace(/^https?:\/\/[\w\.:\-]+/i, '');
  const ms = randomLatency();
  await delay(ms);

  const state = ensureMockState();

  // Routes
  // Stores list
  if (/^\/stores(\/)?$/.test(path) && method === 'GET') {
    return { success: true, data: state.stores };
  }

  // Store by id
  const storeById = path.match(/^\/stores\/([^\/]+)$/);
  if (storeById && method === 'GET') {
    const store = state.stores.find((s: any) => s.id === storeById[1]);
    return { success: true, data: store || null };
  }

  // Store products (my)
  const storeProducts = path.match(/^\/stores\/([^\/]+)\/products(\/my)?$/);
  if (storeProducts && method === 'GET') {
    const storeId = storeProducts[1];
    const products = state.products.filter((p: any) => p.storeId === storeId);
    return { success: true, data: { products, categories: getFakeCategories() } };
  }

  // Products list
  if (/^\/products(\/)?$/.test(path) && method === 'GET') {
    const items = state.products.map((p: any) => ({ id: p.id, name: p.name, price: p.price, isAvailable: p.status === 'available', imageUrl: p.imageUrl }));
    return { success: true, data: { items, total: items.length, page: 1, pageSize: items.length } };
  }

  // Product detail
  const prodMatch = path.match(/^\/products\/([^\/]+)$/);
  if (prodMatch && method === 'GET') {
    const prod = state.products.find((p: any) => p.id === prodMatch[1]);
    if (!prod) return { success: false, error: 'Not found' };
    return { success: true, data: { ...prod, images: prod.images || [], options: prod.options || [] } };
  }

  // Favorites
  if (/^\/favorites(\/)?$/.test(path)) {
    if (method === 'GET') {
      return { success: true, data: state.favorites };
    }
    if (method === 'POST') {
      const productId = body?.productId;
      if (!productId) return { success: false, error: 'productId required' };
      const newFav = { id: `fav_${productId}`, productId };
      state.favorites.push(newFav);
      return { success: true, data: newFav };
    }
    if (method === 'DELETE') {
      const idMatch = path.match(/^\/favorites\/(.+)$/);
      const pid = idMatch ? idMatch[1] : null;
      if (!pid) return { success: false, error: 'id required' };
      state.favorites = state.favorites.filter((f: any) => f.productId !== pid && f.id !== pid);
      return { success: true };
    }
  }

  // Cart (simple)
  if (/^\/cart(?:\/.*)?$/.test(path)) {
    const cart = state.cart;

    if (method === 'GET') {
      return { success: true, data: cart };
    }

    if (method === 'POST') {
      const productId = body?.productId;
      const quantity = Number(body?.quantity ?? 0);
      if (!productId || quantity < 1) {
        return { success: false, error: 'productId and quantity are required' };
      }
      const product = state.products.find((p: any) => p.id === productId);
      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      const existingItem = state.cart.items.find((item: any) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * product.price;
      } else {
        state.cart.items.push({
          id: `${productId}-${Date.now()}`,
          productId,
          product,
          quantity,
          subtotal: quantity * product.price,
        });
      }
      state.cart.totalPrice = state.cart.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
      return { success: true, data: state.cart };
    }

    if (method === 'PUT') {
      const itemMatch = path.match(/^\/cart\/([^\/]+)$/);
      const productId = itemMatch ? itemMatch[1] : null;
      const quantity = Number(body?.quantity ?? 0);
      if (!productId || quantity < 0) {
        return { success: false, error: 'productId and non-negative quantity are required' };
      }
      const item = state.cart.items.find((i: any) => i.productId === productId);
      if (!item) {
        return { success: false, error: 'Cart item not found' };
      }
      if (quantity === 0) {
        state.cart.items = state.cart.items.filter((i: any) => i.productId !== productId);
      } else {
        item.quantity = quantity;
        item.subtotal = quantity * item.product.price;
      }
      state.cart.totalPrice = state.cart.items.reduce((sum: number, i: any) => sum + i.subtotal, 0);
      return { success: true, data: state.cart };
    }

    if (method === 'DELETE') {
      const idMatch = path.match(/^\/cart\/([^\/]+)$/);
      if (idMatch) {
        const productId = idMatch[1];
        state.cart.items = state.cart.items.filter((item: any) => item.productId !== productId);
      } else {
        state.cart.items = [];
      }
      state.cart.totalPrice = 0;
      return { success: true, data: state.cart };
    }
  }

  // Seller dashboard summary
  if (/^\/seller\/dashboard\/summary/.test(path) && method === 'GET') {
    return { success: true, data: getFakeDashboardStats() };
  }

  // Categories
  if (/^\/categories(\/)?$/.test(path) && method === 'GET') {
    return { success: true, data: getFakeCategories() };
  }

  // Seller charts
  if (/^\/seller\/dashboard\/charts\/.+/.test(path) && method === 'GET') {
    // return sample analytics for last 7 days
    const out = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toISOString(), revenue: Math.floor(200 + Math.random() * 200), orders: Math.floor(5 + Math.random() * 15) };
    });
    return { success: true, data: out };
  }

  // Seller orders
  if (/^\/seller\/orders/.test(path)) {
    if (method === 'GET') {
      const items = state.orders;
      return { success: true, data: { items, total: items.length, page: 1, limit: items.length, totalPages: 1 } };
    }
  }

  // Orders
  if (/^\/orders(\/?).*$/ .test(path)) {
    if (path === '/orders' && method === 'GET') {
      return { success: true, data: state.orders };
    }

    const orderById = path.match(/^\/orders\/([^\/]+)$/);
    if (orderById && method === 'GET') {
      const order = state.orders.find((o: any) => o.id === orderById[1]);
      return { success: true, data: order || null };
    }

    if (path === '/orders' && method === 'POST') {
      const cart = state.cart;
      const payloadItems = Array.isArray(body?.items) ? body.items : [];
      const orderItems = payloadItems.length > 0 ? payloadItems : cart.items;
      if (!orderItems || orderItems.length === 0) {
        return { success: false, error: 'Cart is empty' };
      }
      const address = body?.deliveryAddress;
      if (!address || !address.street || !address.city || !address.state || !address.zip) {
        return { success: false, error: 'Delivery address is required' };
      }

      const subtotal = orderItems.reduce((sum: number, item: any) => sum + ((item.subtotal as number) ?? (item.quantity * item.price)), 0);
      const tax = parseFloat((subtotal * 0.1).toFixed(2));
      const deliveryFee = 2.5;
      const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));
      const newOrder = {
        id: `order_${Date.now()}`,
        orderNumber: `${1000 + state.orders.length + 1}`,
        customer: {
          name: state.users[0]?.username || 'Guest User',
          email: state.users[0]?.email || 'guest@example.com',
          phone: state.users[0]?.phone || '000-000-0000',
        },
        deliveryAddress: address,
        items: orderItems.map((item: any) => ({
          id: item.id,
          name: item.product?.name || item.name || 'Unknown item',
          quantity: item.quantity,
          price: item.product?.price ?? item.price,
        })),
        subtotal,
        tax,
        deliveryFee,
        total,
        status: 'pending',
        notes: body?.notes || '',
        createdAt: new Date().toISOString(),
      };
      state.orders.push(newOrder);
      state.cart.items = [];
      state.cart.totalPrice = 0;
      return { success: true, data: newOrder };
    }
  }

  // Admin endpoints
  if (/^\/admin\/.+/.test(path)) {
    if (/^\/admin\/users/.test(path)) {
      return { success: true, data: state.users };
    }
    if (/^\/admin\/stores/.test(path)) {
      return { success: true, data: state.stores };
    }
    if (/^\/admin\/products/.test(path)) {
      return { success: true, data: state.products };
    }
  }

  // Default fallback: try to return something sensible
  // Provide storefront summary
  if (method === 'GET') {
    return { success: true, data: getFakeDashboardStats() };
  }

  return { success: false, error: 'No mock handler for endpoint' };
}

export function initMocking() {
  if (typeof window === 'undefined') return;
  const win = window as any;
  if (win.__MOCK_INIT__) return;
  win.__MOCK_INIT__ = true;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = init?.method || (input instanceof Request ? input.method : 'GET');

    // If explicit env var enables mock, always serve mock
    const useMock = (process.env.NEXT_PUBLIC_USE_MOCK === 'true') || !!win.__USE_FAKE_DATA__;

    if (!useMock) {
      try {
        const resp = await originalFetch(input, init);
        // If server responds 5xx/404, fall back to mock
        if (resp.ok) return resp;
        // else fall through to mock
      } catch (err) {
        // network error: fall back to mock
      }
    }

    // Build body
    let body = undefined as any;
    if (init?.body) {
      try {
        body = JSON.parse(init.body as string);
      } catch (e) {
        body = init.body;
      }
    }

    const mock = await mockFetch(url.replace(API_BASE_PREFIX(), ''), method.toUpperCase(), body);
    const text = JSON.stringify(mock);
    return new Response(text, { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
}

function API_BASE_PREFIX() {
  // Use same base as ApiClient: NEXT_PUBLIC_API_URL or default
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7225/api';
  // Ensure trailing slash trimmed
  return base.replace(/https?:\/\/[\w\.:\-]+/, '').replace(/\/$/, '') || '';
}
