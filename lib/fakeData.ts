import { Product, Store, Order, SellerDashboardStats } from './types';

const sampleStores: Store[] = [
  {
    id: 'store_1',
    name: "Sunny Street Deli",
    logoUrl: '/images/sample/store-1.png',
    bannerUrl: '/images/sample/store-banner-1.jpg',
    description: 'Neighborhood deli serving fresh sandwiches and coffee.',
    rating: 4.6,
    isOpen: true,
    city: 'Springfield',
    state: 'IL',
    productCount: 24,
  },
  {
    id: 'store_2',
    name: "Green Garden Grocery",
    logoUrl: '/images/sample/store-2.png',
    bannerUrl: '/images/sample/store-banner-2.jpg',
    description: 'Organic produce and pantry staples.',
    rating: 4.8,
    isOpen: true,
    city: 'Springfield',
    state: 'IL',
    productCount: 98,
  },
  {
    id: 'store_3',
    name: "Pete's Pizza",
    logoUrl: '/images/sample/store-3.png',
    bannerUrl: '/images/sample/store-banner-3.jpg',
    description: 'Hand-tossed pies and sides.',
    rating: 4.4,
    isOpen: false,
    city: 'Springfield',
    state: 'IL',
    productCount: 12,
  },
];

const sampleProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Classic BLT Sandwich',
    description: 'Crispy bacon, lettuce, and tomato on toasted sourdough.',
    price: 7.99,
    imageUrl: '/images/sample/prod-blt.jpg',
    storeId: 'store_1',
    rating: 4.7,
    reviewCount: 53,
    status: 'available',
  },
  {
    id: 'prod_2',
    name: 'Organic Avocado',
    description: 'Fresh Hass avocado from local suppliers.',
    price: 1.99,
    imageUrl: '/images/sample/prod-avocado.jpg',
    storeId: 'store_2',
    rating: 4.9,
    reviewCount: 12,
    status: 'available',
  },
  {
    id: 'prod_3',
    name: 'Pepperoni Large Pizza',
    description: 'Large pepperoni pizza with our signature sauce.',
    price: 15.5,
    imageUrl: '/images/sample/prod-pizza.jpg',
    storeId: 'store_3',
    rating: 4.3,
    reviewCount: 88,
    status: 'unavailable',
  },
];

const sampleCategories = [
  { id: 'c1', name: 'Sandwiches' },
  { id: 'c2', name: 'Produce' },
  { id: 'c3', name: 'Pizza' },
];

const sampleUser = {
  id: 'user_seed',
  username: 'dev_seller',
  email: 'dev@example.com',
  role: 'Seller',
};

const sampleFavorites = sampleProducts.slice(0, 1).map((p) => ({ id: `fav_${p.id}`, productId: p.id }));

const sampleOrders: Order[] = [
  {
    id: 'order_1',
    orderNumber: '1001',
    customer: { name: 'Alice Brown', email: 'alice@example.com', phone: '555-0101' },
    deliveryAddress: { street: '12 Main St', city: 'Springfield', state: 'IL', zip: '62701' },
    items: [ { id: 'i1', name: 'Classic BLT Sandwich', quantity: 1, price: 7.99 } ],
    subtotal: 7.99,
    tax: 0.64,
    deliveryFee: 2.5,
    total: 11.13,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'order_2',
    orderNumber: '1002',
    customer: { name: 'Carlos Vega', email: 'carlos@example.com', phone: '555-0123' },
    deliveryAddress: { street: '55 Oak Ave', city: 'Springfield', state: 'IL', zip: '62702' },
    items: [ { id: 'i2', name: 'Pepperoni Large Pizza', quantity: 1, price: 15.5 } ],
    subtotal: 15.5,
    tax: 1.24,
    deliveryFee: 3,
    total: 19.74,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const sampleStats: SellerDashboardStats = {
  totalOrders: 120,
  totalRevenue: 10234,
  totalProducts: 134,
  activeProducts: 128,
  averageRating: 4.7,
  totalCustomers: 860,
  pendingOrders: 6,
  completedOrders: 110,
};

export function getFakeStores() {
  return sampleStores;
}

export function getFakeProducts(storeId?: string) {
  if (!storeId) return sampleProducts;
  return sampleProducts.filter((p) => p.storeId === storeId);
}

export function getFakeOrders() {
  return sampleOrders;
}

export function getFakeDashboardStats() {
  return sampleStats;
}

export function getFakeCategories() {
  return sampleCategories;
}

export function getFakeUser() {
  return sampleUser;
}

export function getFakeFavorites() {
  return sampleFavorites;
}

export default {
  getFakeStores,
  getFakeProducts,
  getFakeOrders,
  getFakeDashboardStats,
};
