import { useAuthStore } from './auth-store';
import toast from 'react-hot-toast';
import {
  AuthLoginResponse,
  ProductsResponse,
  ProductDetailResponse,
  CategoriesResponse,
  FavoritesResponse,
  AddToFavoritesResponse,
  RemoveFromFavoritesResponse,
  OrdersResponse,
  OrderResponse,
  CancelOrderResponse,
  CreateOrderPayload,
  CartResponse,
  Cart,
  AddToCartPayload,
  UpdateCartItemPayload,
  StoresResponse,
  StoreResponse,
  StoreProductsResponse,
  ProfileResponse,
  UpdateProfilePayload,
  ChangePasswordPayload,
  ReviewsResponse,
  CreateReviewPayload,
  CreateReviewResponse,
  UpdateReviewPayload,
  ProductReviewsData,
  ApiResponse,
  UserProfile,
  SellerDashboardStats,
  SellerAnalytics,
  CreateProductPayload,
  UpdateProductPayload,
  UpdateOrderStatusPayload,
  Order,
  Store,
  SellerNotification,
  PaginatedResponse,
  Product,
  VoucherDto,
  VoucherResponse,
  VouchersApiResponse,
  VoucherApiResponse,
  ApplyVoucherApiResponse,
  CreateStorePayload,
  UpdateStorePayload,
  ApplyVoucherPayload,
} from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7225/api';

export class ApiError extends Error {
  status: number;
  body: any;
  isAuthError: boolean;

  constructor(message: string, status: number, body: any = null, isAuthError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.isAuthError = isAuthError;
  }
}

interface RequestConfig {
  authRequired?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async parseJsonResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('Failed to parse JSON response:', error, text);
      return {} as T;
    }
  }

  private async waitForHydration(timeoutMs = 5000): Promise<void> {
    const state = useAuthStore.getState();
    if (state.hasHydrated) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const unsubscribe = useAuthStore.subscribe((nextState) => {
        if (nextState.hasHydrated) {
          unsubscribe();
          window.clearTimeout(timeout);
          resolve();
        }
      });

      const timeout = window.setTimeout(() => {
        unsubscribe();
        reject(new ApiError('Auth hydration timed out', 503, null, false));
      }, timeoutMs);
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const authRequired = config.authRequired === true;

    if (authRequired && !useAuthStore.getState().hasHydrated) {
      await this.waitForHydration();
    }

    const authState = useAuthStore.getState();
    const token = authState.accessToken && authState.accessToken !== 'null' ? authState.accessToken : null;
    const hadToken = Boolean(token);

    if (authRequired && (!authState.hasHydrated || !token || !authState.isAuthenticated)) {
      throw new ApiError('Authentication required', 401, null, false);
    }

    const headers = new Headers(options.headers || undefined);
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const configRequest: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, configRequest);
      const data = await this.parseJsonResponse<any>(response);

      if (response.status === 401) {
        throw new ApiError('Unauthorized', 401, data, hadToken);
      }

      if (response.status === 403) {
        toast.error('You do not have permission to perform this action');
        throw new ApiError('Forbidden', 403, data, false);
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}`;
        toast.error(errorMessage);
        throw new ApiError(errorMessage, response.status, data, false);
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error && error.message !== 'Unauthorized') {
        console.error('API Error:', error);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, config);
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, config);
  }

  async postText<T>(endpoint: string, data: string, options?: RequestInit, config?: RequestConfig): Promise<T> {
    const headers = new Headers(options?.headers || undefined);
    headers.set('Content-Type', 'text/plain');

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers,
      body: data,
    }, config);
  }

  async postForm<T>(endpoint: string, formData: FormData, options?: RequestInit, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    }, config);
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, config);
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, config);
  }

  async delete<T>(endpoint: string, options?: RequestInit, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' }, config);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth API functions
export const authApi = {
  login: async (payload: { email: string; password: string }): Promise<AuthLoginResponse> => {
    return apiClient.post('/auth/login', payload);
  },

  register: async (payload: { username: string; email: string; password: string }): Promise<AuthLoginResponse> => {
    return apiClient.post('/auth/register', payload);
  },

  forgotPassword: async (payload: { email: string }): Promise<ApiResponse<null>> => {
    return apiClient.post('/auth/forgot-password', payload);
  },

  resetPassword: async (payload: { token: string; password: string }): Promise<ApiResponse<null>> => {
    return apiClient.post('/auth/reset-password', payload);
  },
};

// Profile API functions
export const profileApi = {
  getProfile: async () => apiClient.get<ProfileResponse>('/user/me', undefined, { authRequired: true }),
  updateProfile: async (data: UpdateProfilePayload) => apiClient.put<ApiResponse<{ userProfile: UserProfile }>>('/user/profile', data, undefined, { authRequired: true }),
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.postForm<ApiResponse<{ url: string }>>('/user/avatar', formData, undefined, { authRequired: true });
  },
  changePassword: async (data: ChangePasswordPayload) => apiClient.put<ApiResponse<null>>('/user/change-password', data, undefined, { authRequired: true }),
};

// Product API functions
export const productApi = {
  getProducts: async (params?: any, page: number = 1, pageSize: number = 10): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    queryParams.append('page', String(page));
    queryParams.append('pageSize', String(pageSize));

    const query = queryParams.toString();
    return apiClient.get(`/products?${query}`);
  },

  getProduct: async (id: string): Promise<ProductDetailResponse> => {
    return apiClient.get(`/products/${id}`);
  },

  createProduct: async (data: any) => {
    return apiClient.post('/products', data, undefined, { authRequired: true });
  },

  updateProduct: async (id: string, data: any) => {
    return apiClient.put(`/products/${id}`, data, undefined, { authRequired: true });
  },

  deleteProduct: async (id: string) => {
    return apiClient.delete(`/products/${id}`, undefined, { authRequired: true });
  },

  toggleAvailability: async (id: string) => {
    return apiClient.patch(`/products/${id}/toggle-availability`, undefined, undefined, { authRequired: true });
  },
};

// Category API functions
export const categoryApi = {
  getCategories: async (): Promise<CategoriesResponse> => {
    return apiClient.get('/categories');
  },
  createCategory: async (name: string) => {
    return apiClient.postText<string>('/categories', name, undefined, { authRequired: true });
  },
};

// Voucher API functions
export const voucherApi = {
  getVouchers: async (): Promise<VouchersApiResponse> => apiClient.get<VouchersApiResponse>('/vouchers'),
  getVoucherByCode: async (code: string): Promise<VoucherApiResponse> => apiClient.get<VoucherApiResponse>(`/vouchers/code/${encodeURIComponent(code)}`),
  applyVoucher: async (payload: ApplyVoucherPayload): Promise<ApplyVoucherApiResponse> => apiClient.post<ApplyVoucherApiResponse>('/vouchers/apply', payload),
  removeVoucher: async (): Promise<VoucherResponse> => apiClient.delete<VoucherResponse>('/vouchers/remove'),
};

// Favorites API functions
export const favoriteApi = {
  getFavorites: async (): Promise<FavoritesResponse> => apiClient.get<FavoritesResponse>('/favorites', undefined, { authRequired: true }),
  addToFavorites: async (productId: string): Promise<AddToFavoritesResponse> => apiClient.post<AddToFavoritesResponse>('/favorites', { productId }, undefined, { authRequired: true }),
  removeFromFavorites: async (productId: string): Promise<RemoveFromFavoritesResponse> => apiClient.delete<RemoveFromFavoritesResponse>(`/favorites/${productId}`, undefined, { authRequired: true }),
};

// Cart API functions
export const cartApi = {
  getCart: async (): Promise<CartResponse> => apiClient.get<CartResponse>('/cart', undefined, { authRequired: true }),
  addToCart: async (payload: AddToCartPayload): Promise<CartResponse> => apiClient.post<CartResponse>('/cart', payload, undefined, { authRequired: true }),
  updateCartItem: async (productId: string, payload: UpdateCartItemPayload): Promise<CartResponse> => apiClient.put<CartResponse>(`/cart/${encodeURIComponent(productId)}`, payload, undefined, { authRequired: true }),
  removeItem: async (productId: string): Promise<CartResponse> => apiClient.delete<CartResponse>(`/cart/${encodeURIComponent(productId)}`, undefined, { authRequired: true }),
  clearCart: async (): Promise<CartResponse> => apiClient.delete<CartResponse>('/cart', undefined, { authRequired: true }),
};

// Order API functions
export const orderApi = {
  getUserOrders: async (page = 1, pageSize = 10): Promise<OrdersResponse> => apiClient.get<OrdersResponse>(`/orders?page=${page}&pageSize=${pageSize}`, undefined, { authRequired: true }),
  getUserOrderById: async (orderId: string): Promise<OrderResponse> => apiClient.get<OrderResponse>(`/orders/${encodeURIComponent(orderId)}`, undefined, { authRequired: true }),
  cancelOrder: async (orderId: string): Promise<CancelOrderResponse> => apiClient.put<CancelOrderResponse>(`/orders/${encodeURIComponent(orderId)}/cancel`, undefined, undefined, { authRequired: true }),
  createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => apiClient.post<OrderResponse>('/orders', payload, undefined, { authRequired: true }),
};

// Store API functions
export const storeApi = {
  getStores: async (params?: { page?: number; pageSize?: number; search?: string; minRating?: number }): Promise<StoresResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.pageSize !== undefined) queryParams.append('pageSize', String(params.pageSize));
      if (params.search) queryParams.append('search', params.search);
      if (params.minRating !== undefined) queryParams.append('minRating', String(params.minRating));
    }
    const query = queryParams.toString();
    return apiClient.get(`/stores${query ? `?${query}` : ''}`);
  },
  getStoreById: async (storeId: string): Promise<StoreResponse> => apiClient.get<StoreResponse>(`/stores/${storeId}`),
  getStoreProducts: async (storeId: string): Promise<StoreProductsResponse> => apiClient.get<StoreProductsResponse>(`/stores/${storeId}/products`),
};

// Review API functions
export const reviewApi = {
  getProductReviews: async (productId: string, page = 1, pageSize = 10, sortBy: string = 'newest') =>
    apiClient.get<ReviewsResponse>(`/products/${encodeURIComponent(productId)}/reviews?page=${page}&pageSize=${pageSize}&sortBy=${encodeURIComponent(sortBy)}`),
  getProductRatingSummary: async (productId: string) =>
    apiClient.get<ApiResponse<ProductReviewsData>>(`/products/${encodeURIComponent(productId)}/rating-summary`),
  getProductReviewsPaged: async (productId: string, page = 1, pageSize = 10) =>
    apiClient.get<ReviewsResponse>(`/products/${encodeURIComponent(productId)}/reviews/paged?page=${page}&pageSize=${pageSize}`),
  createReview: async (payload: CreateReviewPayload) => apiClient.post<CreateReviewResponse>('/reviews', payload, undefined, { authRequired: true }),
  updateReview: async (reviewId: string, payload: UpdateReviewPayload) => apiClient.put<CreateReviewResponse>(`/reviews/${encodeURIComponent(reviewId)}`, payload, undefined, { authRequired: true }),
  deleteReview: async (reviewId: string) => apiClient.delete<ApiResponse<null>>(`/reviews/${encodeURIComponent(reviewId)}`, undefined, { authRequired: true }),
  markReviewHelpful: async (reviewId: string) => apiClient.post<ApiResponse<null>>(`/reviews/${encodeURIComponent(reviewId)}/helpful`, undefined, undefined, { authRequired: true }),
};

// Seller Dashboard API functions
export const sellerApi = {
  // Dashboard - matching backend contract
  getDashboardSummary: async (): Promise<ApiResponse<SellerDashboardStats>> => 
    apiClient.get('/seller/dashboard/summary', undefined, { authRequired: true }),
  
  getDashboardStats: async (): Promise<ApiResponse<SellerDashboardStats>> => 
    apiClient.get('/seller/dashboard/summary', undefined, { authRequired: true }),
  
  getAnalytics: async (period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<SellerAnalytics[]>> => 
    apiClient.get(`/seller/dashboard/analytics?period=${period}`, undefined, { authRequired: true }),

  // Chart endpoints matching backend contract
  getStoreRevenueChart: async (params?: { from?: string; to?: string; groupBy?: 'day' | 'week' | 'month' | 'year' }): Promise<ApiResponse<any[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
    }
    return apiClient.get(`/seller/dashboard/charts/store-revenue${queryParams.toString() ? `?${queryParams}` : ''}`, undefined, { authRequired: true });
  },

  getProductRevenueChart: async (params?: { from?: string; to?: string; groupBy?: string }): Promise<ApiResponse<any[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
    }
    return apiClient.get(`/seller/dashboard/charts/product-revenue${queryParams.toString() ? `?${queryParams}` : ''}`, undefined, { authRequired: true });
  },

  getOrderRevenueChart: async (params?: { from?: string; to?: string; groupBy?: string }): Promise<ApiResponse<any[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);
      if (params.groupBy) queryParams.append('groupBy', params.groupBy);
    }
    return apiClient.get(`/seller/dashboard/charts/order-revenue${queryParams.toString() ? `?${queryParams}` : ''}`, undefined, { authRequired: true });
  },

  getOrderStatusPieChart: async (): Promise<ApiResponse<any>> =>
    apiClient.get('/seller/dashboard/pie/order-status', undefined, { authRequired: true }),

  getStoreRevenuePie: async (): Promise<ApiResponse<any>> =>
    apiClient.get('/seller/dashboard/pie/store-revenue', undefined, { authRequired: true }),

  getProductRevenuePie: async (): Promise<ApiResponse<any>> =>
    apiClient.get('/seller/dashboard/pie/product-revenue', undefined, { authRequired: true }),

  // Top statistics
  getTopRevenue: async (top = 5): Promise<ApiResponse<any[]>> =>
    apiClient.get(`/seller/stores/top-revenue?top=${top}`, undefined, { authRequired: true }),

  getTopProducts: async (top = 5): Promise<ApiResponse<any[]>> =>
    apiClient.get(`/seller/products/top-revenue?top=${top}`, undefined, { authRequired: true }),

  // Count APIs
  getCustomerCount: async (): Promise<ApiResponse<number>> =>
    apiClient.get('/seller/counts/customers', undefined, { authRequired: true }),

  getProductCount: async (): Promise<ApiResponse<number>> =>
    apiClient.get('/seller/counts/products', undefined, { authRequired: true }),

  getStoreCount: async (): Promise<ApiResponse<number>> =>
    apiClient.get('/seller/counts/stores', undefined, { authRequired: true }),

  getOrderCount: async (): Promise<ApiResponse<number>> =>
    apiClient.get('/seller/counts/orders', undefined, { authRequired: true }),

  // Products (use existing Product type with storeId)
  getSellerProducts: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (status) params.append('status', status);
    return apiClient.get(`/seller/products?${params}`, undefined, { authRequired: true });
  },

  getSellerProductById: async (productId: string): Promise<ApiResponse<Product>> => 
    apiClient.get(`/seller/products/${encodeURIComponent(productId)}`, undefined, { authRequired: true }),

  createSellerProduct: async (data: CreateProductPayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if ((value as any) instanceof File) {
          formData.append(key, value as unknown as File);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return apiClient.postForm<ApiResponse<Product>>('/seller/products', formData, undefined, { authRequired: true });
  },

  updateSellerProduct: async (productId: string, data: UpdateProductPayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if ((value as any) instanceof File) {
          formData.append(key, value as unknown as File);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return apiClient.postForm<ApiResponse<Product>>(`/seller/products/${encodeURIComponent(productId)}`, formData, undefined, { authRequired: true });
  },

  deleteSellerProduct: async (productId: string): Promise<ApiResponse<null>> => 
    apiClient.delete(`/seller/products/${encodeURIComponent(productId)}`, undefined, { authRequired: true }),

  // Orders
  getSellerOrders: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (status) params.append('status', status);
    return apiClient.get(`/orders/seller?${params}`, undefined, { authRequired: true });
  },

  getSellerOrderById: async (orderId: string): Promise<ApiResponse<Order>> => 
    apiClient.get<ApiResponse<Order>>(`/orders/seller/${encodeURIComponent(orderId)}`, undefined, { authRequired: true }),

  updateOrderStatus: async (orderId: string, data: UpdateOrderStatusPayload): Promise<ApiResponse<Order>> => 
    apiClient.put(`/orders/seller/${encodeURIComponent(orderId)}/status`, data, undefined, { authRequired: true }),

  // Store Profile (use existing Store type)
  getSellerStores: async (sellerId: string, params?: { page?: number; pageSize?: number; search?: string; minRating?: number }): Promise<ApiResponse<Store[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.pageSize !== undefined) queryParams.append('pageSize', String(params.pageSize));
      if (params.search) queryParams.append('search', params.search);
      if (params.minRating !== undefined) queryParams.append('minRating', String(params.minRating));
    }
    const query = queryParams.toString();
    return apiClient.get(`/stores/seller/${encodeURIComponent(sellerId)}${query ? `?${query}` : ''}`, undefined, { authRequired: true });
  },

  getSellerStore: async (): Promise<ApiResponse<Store[]>> =>
    apiClient.get('/seller/stores', undefined, { authRequired: true }),

  getSellerStoreById: async (sellerId: string, storeId: string): Promise<ApiResponse<Store>> => 
    apiClient.get(`/stores/seller/${encodeURIComponent(sellerId)}/${encodeURIComponent(storeId)}`, undefined, { authRequired: true }),

  createSellerStore: async (data: CreateStorePayload): Promise<ApiResponse<Store>> => 
    apiClient.post('/stores', data, undefined, { authRequired: true }),

  updateSellerStore: async (storeId: string, data: UpdateStorePayload): Promise<ApiResponse<Store>> => 
    apiClient.put(`/stores/${encodeURIComponent(storeId)}`, data, undefined, { authRequired: true }),

  deleteSellerStore: async (storeId: string): Promise<ApiResponse<null>> => 
    apiClient.delete(`/stores/${encodeURIComponent(storeId)}`, undefined, { authRequired: true }),

  // Notifications
  getNotifications: async (): Promise<ApiResponse<SellerNotification[]>> => 
    apiClient.get('/seller/notifications', undefined, { authRequired: true }),

  markNotificationAsRead: async (notificationId: string): Promise<ApiResponse<null>> => 
    apiClient.put(`/seller/notifications/${encodeURIComponent(notificationId)}/read`, {}, undefined, { authRequired: true }),
};

// Top-level convenience export helpers
export const login = authApi.login;
export const register = authApi.register;
export const forgotPassword = authApi.forgotPassword;
export const resetPassword = authApi.resetPassword;

// User convenience exports
export const getProducts = productApi.getProducts;
export const getProductById = productApi.getProduct;
export const getCategories = categoryApi.getCategories;

export const getFavorites = favoriteApi.getFavorites;
export const addToFavorites = favoriteApi.addToFavorites;
export const removeFromFavorites = favoriteApi.removeFromFavorites;

export const getUserOrders = orderApi.getUserOrders;
export const getUserOrderById = orderApi.getUserOrderById;
export const cancelOrder = orderApi.cancelOrder;
export const createOrder = orderApi.createOrder;

export const getStores = storeApi.getStores;
export const getStoreById = storeApi.getStoreById;
export const getStoreProducts = storeApi.getStoreProducts;

export const getProfile = profileApi.getProfile;
export const updateProfile = profileApi.updateProfile;
export const uploadAvatar = profileApi.uploadAvatar;
export const changePassword = profileApi.changePassword;

export const getProductReviews = reviewApi.getProductReviews;
export const createReview = reviewApi.createReview;
export const updateReview = reviewApi.updateReview;
export const deleteReview = reviewApi.deleteReview;
export const markReviewHelpful = reviewApi.markReviewHelpful;

// Seller convenience exports
export const getDashboardStats = sellerApi.getDashboardStats;
export const getAnalytics = sellerApi.getAnalytics;

export const getSellerProducts = sellerApi.getSellerProducts;
export const getSellerProductById = sellerApi.getSellerProductById;
export const createSellerProduct = sellerApi.createSellerProduct;
export const updateSellerProduct = sellerApi.updateSellerProduct;
export const deleteSellerProduct = sellerApi.deleteSellerProduct;

export const getSellerOrders = sellerApi.getSellerOrders;
export const getSellerOrderById = sellerApi.getSellerOrderById;
export const updateOrderStatus = sellerApi.updateOrderStatus;

export const getSellerStore = sellerApi.getSellerStore;
export const getSellerStores = sellerApi.getSellerStores;
export const getSellerStoreById = sellerApi.getSellerStoreById;
export const createSellerStore = sellerApi.createSellerStore;
export const updateSellerStore = sellerApi.updateSellerStore;
export const deleteSellerStore = sellerApi.deleteSellerStore;

export const getNotifications = sellerApi.getNotifications;
export const markNotificationAsRead = sellerApi.markNotificationAsRead;

