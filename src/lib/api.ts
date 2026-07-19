const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://98.85.34.11:5000/api';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'user';
  isBanned?: boolean;
  subscriptionStatus?: 'inactive' | 'active' | 'trial' | 'expired';
  currentPlan?: 'basic' | 'premium';
  hasSelectedSubscription?: boolean;
  hasCompletedOnboarding?: boolean;
  createdAt: string;
  lastActiveAt?: string;
  age?: number;
  gender?: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  type: 'basic' | 'premium';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  dailyLimits: {
    foodScans: number;
    productScans: number;
  };
  isActive: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUsersResponse {
  users: AdminUser[];
  pagination: Pagination;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'superadmin' | 'admin' | 'user';
  };
}

const getHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const authToken = token || localStorage.getItem('gocal_admin_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to log in as admin');
  }
  return data;
}

export async function fetchAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<GetUsersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search);
  if (params.role && params.role !== 'all') query.append('role', params.role);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/admin/users?${query.toString()}`, {
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch users');
  }
  return data;
}

export async function updateUserRole(userId: string, role: 'superadmin' | 'admin' | 'user'): Promise<{ message: string; user: AdminUser }> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ role }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update user role');
  }
  return data;
}

export async function updateUserDetails(userId: string, updates: Partial<AdminUser>): Promise<{ message: string; user: AdminUser }> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update user');
  }
  return data;
}

export async function deleteUserAccount(userId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete user');
  }
  return data;
}

export async function fetchAdminSubscriptionPlans(): Promise<{ plans: SubscriptionPlan[] }> {
  const response = await fetch(`${API_BASE_URL}/admin/subscription-plans`, {
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch subscription plans');
  }
  return data;
}

export async function updateSubscriptionPlan(
  planId: string,
  updates: Partial<SubscriptionPlan>
): Promise<{ message: string; plan: SubscriptionPlan }> {
  const response = await fetch(`${API_BASE_URL}/admin/subscription-plans/${planId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update subscription plan');
  }
  return data;
}
