/**
 * API utility functions for authentication and requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7225/api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      username: string;
      email: string;
    };
    accessToken: string;
    refreshToken?: string;
  };
  message?: string;
  error?: string;
}

/**
 * Get the authorization header with token
 */
export function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Login user
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred during login',
    };
  }
}

/**
 * Register user
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred during registration',
    };
  }
}

/**
 * Request password reset
 */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to process request',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to reset password',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred',
    };
  }
}

/**
 * Make authenticated request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...options.headers,
    ...getAuthHeader(),
  };

  return fetch(url, { ...options, headers });
}

/**
 * Fetch current user profile
 */
export async function getProfile(): Promise<AuthResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/user/me`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch profile',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching profile',
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(payload: {
  username?: string;
  phone?: string;
}): Promise<AuthResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to update profile',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while updating profile',
    };
  }
}

/**
 * Change user password
 */
export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<AuthResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/user/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to change password',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while changing password',
    };
  }
}

/**
 * Upload avatar
 */
export async function uploadAvatar(file: File): Promise<{
  success: boolean;
  data?: { url: string };
  error?: string;
}> {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await authenticatedFetch(`${API_BASE_URL}/user/avatar`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to upload avatar',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while uploading avatar',
    };
  }
}

/**
 * Seller API Functions
 */

/**
 * Get seller dashboard stats
 */
export async function getSellerDashboard(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/seller/dashboard`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching dashboard',
    };
  }
}

/**
 * Get seller products
 */
export async function getSellerProducts(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/seller/products`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch products',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching products',
    };
  }
}

/**
 * Add new product
 */
export async function createProduct(payload: FormData): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/seller/products`, {
      method: 'POST',
      body: payload,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to create product',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while creating product',
    };
  }
}

/**
 * Update product
 */
export async function updateProduct(
  productId: string,
  payload: FormData
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/seller/products/${productId}`, {
      method: 'PUT',
      body: payload,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to update product',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while updating product',
    };
  }
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/seller/products/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to delete product',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while deleting product',
    };
  }
}

/**
 * Get seller orders
 */
export async function getSellerOrders(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/seller/orders`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch orders',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching orders',
    };
  }
}

/**
 * Get order details
 */
export async function getOrderDetail(orderId: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/seller/orders/${orderId}`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch order details',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching order details',
    };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/seller/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to update order status',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while updating order status',
    };
  }
}

/**
 * Food Browsing API Functions
 */

import type {
  ProductsResponse,
  ProductDetailResponse,
  CategoriesResponse,
  ProductFilters
} from './types';

/**
 * Get products with filters
 */
export async function getProducts(filters: ProductFilters = {}, page = 1, limit = 12): Promise<ProductsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch products',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching products',
    };
  }
}

/**
 * Get product details by ID
 */
export async function getProductById(id: string): Promise<ProductDetailResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch product',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching product',
    };
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch categories',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching categories',
    };
  }
}

/**
 * Review & Rating System API Functions
 */

import type {
  ReviewsResponse,
  CreateReviewResponse,
  CreateReviewPayload,
  UpdateReviewPayload
} from './types';

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string, page = 1, limit = 10): Promise<ReviewsResponse> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch reviews',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching reviews',
    };
  }
}

/**
 * Create a new review
 */
export async function createReview(payload: CreateReviewPayload): Promise<CreateReviewResponse> {
  try {
    const formData = new FormData();
    formData.append('productId', payload.productId);
    formData.append('rating', payload.rating.toString());
    if (payload.title) formData.append('title', payload.title);
    formData.append('content', payload.content);

    if (payload.images) {
      payload.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }

    const response = await authenticatedFetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to create review',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while creating review',
    };
  }
}

/**
 * Update an existing review
 */
export async function updateReview(reviewId: string, payload: UpdateReviewPayload): Promise<CreateReviewResponse> {
  try {
    const formData = new FormData();
    if (payload.rating !== undefined) formData.append('rating', payload.rating.toString());
    if (payload.title !== undefined) formData.append('title', payload.title);
    if (payload.content !== undefined) formData.append('content', payload.content);

    if (payload.images) {
      payload.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }

    const response = await authenticatedFetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to update review',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while updating review',
    };
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to delete review',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while deleting review',
    };
  }
}

/**
 * Mark review as helpful
 */
export async function markReviewHelpful(reviewId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to mark review as helpful',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while marking review as helpful',
    };
  }
}

/**
 * Favorite/Wishlist System API Functions
 */

import type {
  FavoritesResponse,
  AddToFavoritesResponse,
  RemoveFromFavoritesResponse
} from './types';

/**
 * Get all favorites for the user
 */
export async function getFavorites(): Promise<FavoritesResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/favorites`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch favorites',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching favorites',
    };
  }
}

/**
 * Add a product to favorites
 */
export async function addToFavorites(productId: string): Promise<AddToFavoritesResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to add to favorites',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while adding to favorites',
    };
  }
}

/**
 * Remove a product from favorites
 */
export async function removeFromFavorites(productId: string): Promise<RemoveFromFavoritesResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/favorites/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to remove from favorites',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while removing from favorites',
    };
  }
}

/**
 * Cart System API Functions
 */

import type {
  CartResponse,
  AddToCartPayload,
  UpdateCartItemPayload
} from './types';

/**
 * Get user's cart
 */
export async function getCart(): Promise<CartResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/cart`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch cart',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching cart',
    };
  }
}

/**
 * Add item to cart
 */
export async function addItemToCart(payload: AddToCartPayload): Promise<CartResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to add item to cart',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while adding item to cart',
    };
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(itemId: string, payload: UpdateCartItemPayload): Promise<CartResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to update cart item',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while updating cart item',
    };
  }
}

/**
 * Remove item from cart
 */
export async function removeCartItem(itemId: string): Promise<CartResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to remove item from cart',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while removing item from cart',
    };
  }
}

/**
 * Clear the entire cart
 */
export async function clearCart(): Promise<CartResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to clear cart',
      };
    }

    return { success: true, data: { items: [], total: 0 } };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while clearing cart',
    };
  }
}

/**
 * Voucher & Promotion System API Functions
 */

import type {
  VouchersResponse,
  VoucherResponse,
  ApplyVoucherPayload,
  ApplyVoucherResponse,
  RemoveVoucherResponse
} from './types';

/**
 * Get all available vouchers
 */
export async function getVouchers(): Promise<VouchersResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/vouchers`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch vouchers',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching vouchers',
    };
  }
}

/**
 * Get voucher by code
 */
export async function getVoucherByCode(code: string): Promise<VoucherResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/vouchers/code/${code}`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch voucher',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching voucher',
    };
  }
}

/**
 * Apply voucher to cart
 */
export async function applyVoucher(payload: ApplyVoucherPayload): Promise<ApplyVoucherResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/vouchers/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to apply voucher',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while applying voucher',
    };
  }
}

/**
 * Remove applied voucher
 */
export async function removeVoucher(): Promise<RemoveVoucherResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/vouchers/remove`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to remove voucher',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while removing voucher',
    };
  }
}

/**
 * Order System API Functions
 */

import type {
  OrderResponse,
  OrdersResponse,
  CreateOrderPayload,
  CancelOrderResponse
} from './types';

/**
 * Get all orders for the current user
 */
export async function getUserOrders(): Promise<OrdersResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch orders',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching orders',
    };
  }
}

/**
 * Get order details by ID
 */
export async function getUserOrderById(orderId: string): Promise<OrderResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}`);

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to fetch order',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while fetching order',
    };
  }
}

/**
 * Create a new order from cart
 */
export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to create order',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while creating order',
    };
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string): Promise<CancelOrderResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to cancel order',
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while cancelling order',
    };
  }
}

