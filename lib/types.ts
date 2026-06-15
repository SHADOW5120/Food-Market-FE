/**
 * Shared type definitions for the authentication system
 */

export type UserRole = 'User' | 'Seller' | 'Admin';

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  bio?: string;
  gender?: string;
  birthday?: string;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  username?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword?: string;
}

export interface ProfileResponse {
  success: boolean;
  data?:  UserProfile;
  message?: string;
  error?: string;
}

export interface AuthResponse<T = User> {
  success: boolean;
  data?: {
    user: T;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  };
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export type AuthLoginResponse = AuthResponse<User>;

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ProductDto {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface ProductOptionValue {
  id: string;
  name: string;
  priceModifier: number;
}

export interface ProductOption {
  id: string;
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  values: ProductOptionValue[];
}

export interface ProductDetailDto {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  images: ProductImage[];
  options: ProductOption[];
  category: CategoryDto;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  imageUrl?: string;
  categoryId?: string;
  category?: CategoryDto;
  storeId?: string;
  rating?: number;
  reviewCount?: number;
  status?: 'available' | 'unavailable';
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  images?: ProductImage[];
  options?: ProductOption[];
}

export interface PagedProductResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export type ProductsResponse = PagedProductResponse;
export type ProductDetailResponse = Product;

export interface CategoryDto {
  id: string;
  name: string;
}

export interface Category extends CategoryDto {
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  errors?: ValidationError[];
}

export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Seller/Store types for store management
 */

export interface CreateStorePayload {
  name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  logo?: File;
  coverImage?: File;
}

export interface UpdateStorePayload {
  name?: string;
  description?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  logo?: File;
  coverImage?: File;
}

/**
 * Seller/Product types for store management
 */

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  storeId: string;
  status?: 'available' | 'unavailable';
  stock?: number;
  image?: File;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  storeId?: string;
  status?: 'available' | 'unavailable';
  image?: File;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
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
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Seller-specific types (seller extends user with role: 'seller')
 * A seller can have many stores, each store has many products
 */

export interface SellerDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
  averageRating: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface SellerAnalytics {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  products: number;
}

export interface SellerRegisterPayload {
  username: string;
  email: string;
  password: string;
  storeName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface UpdateOrderStatusPayload {
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';
  notes?: string;
}

export interface SellerNotification {
  id: string;
  type: 'order' | 'review' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UpdateSellerProfilePayload {
  storeName?: string;
  description?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  logo?: File;
  coverImage?: File;
}

export interface UpdateOrderStatusPayload {
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';
}

/**
 * Food browsing system types
 */

export interface ProductFilters {
  categoryId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'popularity' | 'newest';
}

export type CategoriesResponse = CategoryDto[];

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  subtotal: number; // price * quantity
  options?: Array<{ optionId: string; valueId: string }>;
}

export interface Cart {
  id?: string;
  items: CartItem[];
  totalPrice: number;
}

export interface CartResponse {
  success: boolean;
  data?: Cart;
  message?: string;
  error?: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  selectedOptions?: Array<{ optionId: string; valueId: string }>;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

/**
 * Review & Rating System Types
 */

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  rating: number; // 1-5 stars
  title?: string;
  content: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpful: number; // number of helpful votes
  createdAt: string;
  updatedAt?: string;
}

export interface RatingBreakdown {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ProductReviewsData {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown;
  canReview: boolean;
  userReview?: Review;
}

/**
 * Voucher & Promotion System Types
 */

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (0-100) or fixed amount
  maxDiscount?: number; // max discount for percentage vouchers
  minOrderValue?: number; // minimum order value to apply
  expiryDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  applicableCategories?: string[]; // category IDs this voucher applies to
  applicableProducts?: string[]; // product IDs this voucher applies to
  createdAt: string;
  updatedAt?: string;
}

export interface VoucherDto {
  voucherId: string;
  code: string;
  description: string;
  discountAmount: number | null;
  discountPercent: number | null;
  expiryDate: string;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
}

export interface VoucherResponse {
  success: boolean;
  data?: Voucher;
  message?: string;
  error?: string;
}

export interface VouchersResponse {
  success: boolean;
  data?: Voucher[];
  message?: string;
  error?: string;
}

export interface VouchersApiResponse {
  success: boolean;
  data?: VoucherDto[];
  message?: string;
  error?: string;
}

export interface ApplyVoucherPayload {
  voucherCode: string;
  cartTotal: number;
}

export interface ApplyVoucherApiResponse {
  success: boolean;
  data?: {
    isValid: boolean;
    voucherCode: string;
    cartTotal: number;
    discountApplied: number;
    finalTotal: number;
  };
  message?: string;
  error?: string;
}

export interface VoucherApiResponse {
  success: boolean;
  data?: VoucherDto;
  message?: string;
  error?: string;
}

export interface ApplyVoucherResponse {
  success: boolean;
  data?: {
    voucher: Voucher;
    discountAmount: number;
    finalTotal: number;
    message?: string;
  };
  message?: string;
  error?: string;
}

export interface RemoveVoucherResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  title?: string;
  content: string;
  images?: File[];
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  content?: string;
  images?: File[];
}

export interface ReviewsResponse {
  success: boolean;
  data?: ProductReviewsData;
  message?: string;
  error?: string;
}

export interface CreateReviewResponse {
  success: boolean;
  data?: Review;
  message?: string;
  error?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown;
}

export interface SellerStats {
  totalOrders: number;
  revenue: number;
  products: number;
  rating: number;
  trend: {
    orders: number;
    revenue: number;
  };
}

export interface SellerDashboard {
  stats: SellerStats;
  recentOrders: Order[];
  topProducts: Product[];
}

/**
 * Favorite/Wishlist System Types
 */

export interface Favorite {
  id: string;
  productId: string;
  product: Product;
  userId: string;
  createdAt: string;
}

export interface FavoritesResponse {
  success: boolean;
  data?: Favorite[];
  message?: string;
  error?: string;
}

export interface AddToFavoritesResponse {
  success: boolean;
  data?: Favorite;
  message?: string;
  error?: string;
}

export interface RemoveFromFavoritesResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Order System Types
 */

export interface OrderResponse {
  success: boolean;
  data?: Order;
  message?: string;
  error?: string;
}

export interface OrdersResponse {
  success: boolean;
  data?: Order[];
  message?: string;
  error?: string;
}

export interface CreateOrderPayload {
  cartId: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: 'COD' | string;
  notes?: string;
  voucherCode?: string;
  items?: CartItem[];
}

export interface CancelOrderResponse {
  success: boolean;
  data?: Order;
  message?: string;
  error?: string;
}

/**
 * Store System Types
 */

export interface StoreListItemDto {
  id: string;
  name: string;
  logoUrl: string;
  rating: number;
  isOpen: boolean;
}

export interface StoreResponseDto {
  id: string;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  rating: number;
  isOpen: boolean;
}

export interface PagedStoreResponse {
  items: StoreListItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface Store {
  id: string;
  name: string;
  logoUrl: string;
  bannerUrl?: string;
  description?: string;
  rating: number;
  isOpen: boolean;
  logo?: string;
  banner?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  deliveryTime?: string;
  productCount?: number;
}

export type StoreResponse = StoreResponseDto;
export type StoresResponse = PagedStoreResponse;

export interface StoreProductsResponse {
  success: boolean;
  data?: {
    products: Product[];
    categories: Category[];
  };
  message?: string;
  error?: string;
}
