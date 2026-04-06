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
  StoresResponse,
  StoreResponse,
  StoreProductsResponse,
  ProfileResponse,
  UpdateProfilePayload,
  User,
  ChangePasswordPayload,
  ReviewsResponse,
  CreateReviewPayload,
  CreateReviewResponse,
  UpdateReviewPayload,
  ApiResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7225/api';

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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = useAuthStore.getState().accessToken;

    const headers = new Headers(options.headers || undefined);
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await this.parseJsonResponse<any>(response);

      if (response.status === 401) {
        // Unauthorized - logout and redirect
        useAuthStore.getState().logout();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      if (response.status === 403) {
        toast.error('You do not have permission to perform this action');
        throw new Error('Forbidden');
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}`;
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error && error.message !== 'Unauthorized') {
        console.error('API Error:', error);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async postForm<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
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

  me: async (): Promise<ProfileResponse> => {
    return apiClient.get('/auth/me');
  },
};

// User API functions
export const userApi = {
  updateProfile: async (data: any) => {
    return apiClient.put('/user/profile', data);
  },

  changePassword: async (data: any) => {
    return apiClient.put('/user/change-password', data);
  },
};

// Product API functions
export const productApi = {
  getProducts: async (params?: any, page?: number, limit?: number): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    if (page) queryParams.append('page', String(page));
    if (limit) queryParams.append('limit', String(limit));

    const query = queryParams.toString();
    return apiClient.get(`/products${query ? `?${query}` : ''}`);
  },

  getProduct: async (id: string): Promise<ProductDetailResponse> => {
    return apiClient.get(`/products/${id}`);
  },

  createProduct: async (data: any) => {
    return apiClient.post('/products', data);
  },

  updateProduct: async (id: string, data: any) => {
    return apiClient.put(`/products/${id}`, data);
  },

  deleteProduct: async (id: string) => {
    return apiClient.delete(`/products/${id}`);
  },
};

// Category API functions
export const categoryApi = {
  getCategories: async (): Promise<CategoriesResponse> => {
    return apiClient.get('/categories');
  },
};

// Favorites API functions
export const favoriteApi = {
  getFavorites: async (): Promise<FavoritesResponse> => apiClient.get<FavoritesResponse>('/favorites'),
  addToFavorites: async (productId: string): Promise<AddToFavoritesResponse> => apiClient.post<AddToFavoritesResponse>('/favorites', { productId }),
  removeFromFavorites: async (productId: string): Promise<RemoveFromFavoritesResponse> => apiClient.delete<RemoveFromFavoritesResponse>(`/favorites/${productId}`),
};

// Order API functions
export const orderApi = {
  getUserOrders: async (): Promise<OrdersResponse> => apiClient.get<OrdersResponse>('/orders'),
  getUserOrderById: async (orderId: string): Promise<OrderResponse> => apiClient.get<OrderResponse>(`/orders/${orderId}`),
  cancelOrder: async (orderId: string): Promise<CancelOrderResponse> => apiClient.post<CancelOrderResponse>(`/orders/${orderId}/cancel`),
  createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => apiClient.post<OrderResponse>('/orders', payload),
};

// Store API functions
export const storeApi = {
  getStores: async (): Promise<StoresResponse> => apiClient.get<StoresResponse>('/stores'),
  getStoreById: async (storeId: string): Promise<StoreResponse> => apiClient.get<StoreResponse>(`/stores/${storeId}`),
  getStoreProducts: async (storeId: string): Promise<StoreProductsResponse> => apiClient.get<StoreProductsResponse>(`/stores/${storeId}/products`),
};

// Profile API functions
export const profileApi = {
  getProfile: async () => apiClient.get<ProfileResponse>('/user/profile'),
  updateProfile: async (data: UpdateProfilePayload) => apiClient.put<ApiResponse<{ user: User }>>('/user/profile', data),
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.postForm<ApiResponse<{ url: string }>>('/user/avatar', formData);
  },
  changePassword: async (data: ChangePasswordPayload) => apiClient.put<ApiResponse<null>>('/user/change-password', data),
};

// Review API functions
export const reviewApi = {
  getProductReviews: async (productId: string, page = 1, limit = 10) =>
    apiClient.get<ReviewsResponse>(`/products/${productId}/reviews?page=${page}&limit=${limit}`),
  createReview: async (payload: CreateReviewPayload) => apiClient.post<CreateReviewResponse>('/reviews', payload),
  updateReview: async (reviewId: string, payload: UpdateReviewPayload) => apiClient.put<CreateReviewResponse>(`/reviews/${reviewId}`, payload),
  deleteReview: async (reviewId: string) => apiClient.delete<ApiResponse<null>>(`/reviews/${reviewId}`),
  markReviewHelpful: async (reviewId: string) => apiClient.post<ApiResponse<null>>(`/reviews/${reviewId}/helpful`),
};

// Top-level convenience export helpers
export const login = authApi.login;
export const register = authApi.register;
export const forgotPassword = authApi.forgotPassword;
export const resetPassword = authApi.resetPassword;
export const me = authApi.me;

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

