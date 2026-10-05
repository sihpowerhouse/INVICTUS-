import { ApiError } from './ApiError';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'arraybuffer';
}

function getAuthToken(): string | null {
  return localStorage.getItem('invictus_auth_token');
}

function handle401() {
  // Clear authenticated session completely.
  localStorage.removeItem('invictus_auth_token');
  localStorage.removeItem('invictus_user');
  localStorage.removeItem('invictus_session_expires');

  // Trigger global custom event so the UI/AuthContext can redirect without circular dependencies
  window.dispatchEvent(new Event('invictus:unauthorized'));
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, responseType = 'json', headers, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => searchParams.append(k, v));
    url += `?${searchParams.toString()}`;
  }

  const token = getAuthToken();
  const reqHeaders = new Headers(headers);

  if (token) {
    reqHeaders.set('Authorization', `Bearer ${token}`);
  }

  // Set default JSON Content-Type if there's a body and it's not FormData
  if (customConfig.body && !(customConfig.body instanceof FormData) && !reqHeaders.has('Content-Type')) {
    reqHeaders.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...customConfig,
    headers: reqHeaders,
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    // Network errors (CORS, offline, etc)
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
  }

  if (response.status === 401) {
    handle401();
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errorData;
    let message = 'An error occurred';
    try {
      errorData = await response.json();
      message = errorData.detail || errorData.message || message;
    } catch {
      message = response.statusText;
    }
    throw new ApiError(response.status, message, errorData);
  }

  if (responseType === 'blob') {
    return (await response.blob()) as unknown as T;
  } else if (responseType === 'arraybuffer') {
    return (await response.arrayBuffer()) as unknown as T;
  }

  // Some endpoints might return 204 No Content
  if (response.status === 204) {
    return null as unknown as T;
  }

  // Attempt to parse JSON for default responseType
  const text = await response.text();
  if (!text) {
    return null as unknown as T;
  }
  
  try {
    return JSON.parse(text);
  } catch {
    return text as unknown as T;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),
  
  put: <T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),
    
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
