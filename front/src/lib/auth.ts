type LoginResponse = {
  access_token: string;
};

const TOKEN_KEY = 'audiophile_token';

export async function login(email: string, password: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login failed');
  const data = (await res.json()) as LoginResponse;
  localStorage.setItem(TOKEN_KEY, data.access_token);
  return data.access_token;
}

export async function register(email: string, password: string, displayName: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Register failed: ${body}`);
  }

  // After successful registration, auto-login
  return login(email, password);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function authFetch(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers as HeadersInit || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  return res;
}

export async function getMe() {
  const res = await authFetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/me`);
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export default { login, register, logout, getToken, authFetch, getMe };
