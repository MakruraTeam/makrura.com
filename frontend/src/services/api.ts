import { ApiError } from './api.model';
import { useAuthStore } from '@/stores/auth';

export const BACKEND_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://makrura.com';
const BACKEND_URL = `${BACKEND_HOST}/api`;

export async function request<T = unknown>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', endpoint: string, body?: any, auth = false): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;
  const headers: Record<string, string> = {};

  const isFormData = body instanceof FormData;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = useAuthStore().getToken;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = res.status === 204 ? undefined : await res.json().catch(() => undefined);

  if (!res.ok) {
    if (auth && (res.status === 401 || res.status === 403)) {
      try {
        useAuthStore().removeToken();
      } catch {
        console.warn('Failed to remove invalid auth token from store.');
      }
    }

    const message = (data && typeof data === 'object' && 'error' in (data as any) ? (data as any).error : res.statusText) || 'Request failed';
    throw new ApiError(String(message), res.status, data);
  }

  return data as T;
}

export function defaultGet<T>(endpoint: string, auth = false) {
  return request<T>('GET', endpoint, undefined, auth);
}

export function defaultPost<T>(endpoint: string, body?: any, auth = false) {
  return request<T>('POST', endpoint, body, auth);
}

export function defaultPatch<T>(endpoint: string, body?: any, auth = false) {
  return request<T>('PATCH', endpoint, body, auth);
}

export function defaultDelete<T>(endpoint: string, body?: any, auth = false) {
  return request<T>('DELETE', endpoint, body, auth);
}
