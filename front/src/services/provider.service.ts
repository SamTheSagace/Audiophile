import auth from '@/lib/auth';
import type { ProviderEnum } from '@/types/playlist.types';

const api = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const REDIRECT_URL_COOKIE = 'provider_redirect_url';

export async function handleConnect(provider: typeof ProviderEnum[keyof typeof ProviderEnum], redirectUrl?: string) {
  try {
    // Stocker l'URL de redirection dans un cookie
    if (redirectUrl) {
      document.cookie = `${REDIRECT_URL_COOKIE}=${encodeURIComponent(redirectUrl)}; path=/; max-age=3600`;
    }

    const res = await auth.authFetch(`${api}/auth/${provider}/login-url`, { method: 'POST', body: JSON.stringify({ redirectUrl }) });
    if (!res.ok) throw new Error(`Failed to get ${provider} url`);
    const body = await res.json();

    if (body.url) window.location.href = body.url;

  } catch (e) {
    console.error(`${provider} connect failed`, e);
    window.alert(`Impossible d'initier la connexion ${provider}`);
  }
};
