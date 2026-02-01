import { apiClient } from '@/api/axios.client';
import type { PlaylistSummary } from '@/types/playlist.types';

export async function getPlaylists(provider: string) {
  // Exemple d'endpoint: GET /playlists/spotify
  const res = await apiClient.get<PlaylistSummary[]>(`/playlists/${provider}`);
  return res.data;
}

export async function getPlaylistById(provider: string, id: string) {
  // Exemple d'endpoint: GET /playlists/spotify/{id}
  const res = await apiClient.get(`/playlists/${provider}/${id}`);
  return res.data;
}

export default { getPlaylists, getPlaylistById };