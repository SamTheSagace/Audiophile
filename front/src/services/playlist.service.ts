import { apiClient } from '@/api/axios.client';

export async function getPlaylists(provider: string) {
  // Exemple d'endpoint: GET /playlists/spotify
  const res = await apiClient.get(`/playlists/${provider}`);
  return res.data;
}

export default { getPlaylists };