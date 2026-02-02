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
    if (!res.ok) throw new Error(`Impossible d'obtenir l'URL de connexion pour ${provider}`);
    const body = await res.json();

    if (body.url) window.location.href = body.url;

  } catch (e) {
    console.error(`Connexion avec ${provider} impossible`, e);
    window.alert(`Impossible d'initier la connexion ${provider}, ${provider} est peut-être pas encore intégré.`);
  }
};

export async function handleDisconnect(provider: typeof ProviderEnum[keyof typeof ProviderEnum]) {
  try {
    const res = await auth.authFetch(`${api}/users/me/providers/${provider}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Impossible de déconnecter ${provider}`);
    return true;
  } catch (e) {
    console.error(`${provider} déconnexion échouée`, e);
    window.alert(`Impossible de déconnecter ${provider}`);
    return false;
  }
}