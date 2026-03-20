const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${endpoint}`, { ...fetchOptions, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API error: ${res.status}`);
  }
  return res.json();
}

// Upload
export const uploadApi = {
  upload: async (files: File[], token: string): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload gagal' }));
      throw new Error(err.message);
    }
    const data = await res.json();
    return data.urls;
  },
};

// Auth
export const authApi = {
  register: (data: { email: string; password: string; fullName: string; phone?: string }) =>
    apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: (token: string) =>
    apiFetch('/api/auth/logout', { method: 'POST', token }),
};

// Fish Encyclopedia
export const fishApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/api/fish${query}`);
  },
  getById: (id: string) => apiFetch(`/api/fish/${id}`),
  getProtected: () => apiFetch('/api/fish/protected'),
};

// Products
export const productApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/api/products${query}`);
  },
  getById: (id: string) => apiFetch(`/api/products/${id}`),
  create: (data: any, token: string) =>
    apiFetch('/api/products', { method: 'POST', body: JSON.stringify(data), token }),
  getMyListings: (token: string) =>
    apiFetch('/api/products/my-listings', { token }),
};

// Orders
export const orderApi = {
  create: (data: any, token: string) =>
    apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(data), token }),
  getBuyerOrders: (token: string) => apiFetch('/api/orders/buyer', { token }),
  getSellerOrders: (token: string) => apiFetch('/api/orders/seller', { token }),
  getById: (id: string, token: string) => apiFetch(`/api/orders/${id}`, { token }),
  updateStatus: (id: string, data: any, token: string) =>
    apiFetch(`/api/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(data), token }),
};

// Users
export const userApi = {
  getProfile: (token: string) => apiFetch('/api/users/profile', { token }),
  updateProfile: (data: any, token: string) =>
    apiFetch('/api/users/profile', { method: 'PUT', body: JSON.stringify(data), token }),
  getWishlist: (token: string) => apiFetch('/api/users/wishlist', { token }),
};

// Payment
export const paymentApi = {
  createTransaction: (orderId: string, token: string) =>
    apiFetch<{ snapToken: string; redirectUrl: string }>(`/api/payment/create/${orderId}`, { method: 'POST', token }),
  getClientKey: () =>
    apiFetch<{ clientKey: string }>('/api/payment/client-key'),
};

// Reviews
export const reviewApi = {
  create: (data: { orderId: string; productId: string; rating: number; comment?: string }, token: string) =>
    apiFetch('/api/reviews', { method: 'POST', body: JSON.stringify(data), token }),
  getProductReviews: (productId: string) =>
    apiFetch(`/api/reviews/product/${productId}`),
};

// Chat
export const chatApi = {
  sendMessage: (data: any, token: string) =>
    apiFetch('/api/chat', { method: 'POST', body: JSON.stringify(data), token }),
  getConversations: (token: string) => apiFetch('/api/chat/conversations', { token }),
  getMessages: (otherUserId: string, token: string) =>
    apiFetch(`/api/chat/messages/${otherUserId}`, { token }),
  getUnreadCount: (token: string) => apiFetch('/api/chat/unread', { token }),
};

