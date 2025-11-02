import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from './auth.model';
import { defaultPost } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

export async function login(payload: LoginPayload, rememberMe: boolean): Promise<LoginResponse> {
  const res = await defaultPost<LoginResponse>('/auth/login', payload, false);
  useAuthStore().saveToken(res.token, { remember: rememberMe });
  return res;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const auth = useAuthStore();
  if (!auth.getToken) {
    throw new Error('You must be logged in to register a new user.');
  }
  return await defaultPost<RegisterResponse>('/auth/register', payload, true);
}
