import { apiClient } from '@/api/axios.client';
import type { PlaylistSummary } from '@/types/playlist.types';

export async function getPlaylists(provider: string) {
  // Exemple d'endpoint: GET /playlists/spotify
  const { data } = await apiClient.get<PlaylistSummary[]>(`/playlists/${provider}`);
  
  return data;
}

export async function getPlaylistById(provider: string, id: string) {
  // Exemple d'endpoint: GET /playlists/spotify/{id}
  const res = await apiClient.get(`/playlists/${provider}/${id}`);
  return res.data;
}

export async function categorizePlaylist(provider: string, id: string, category: string) {
  // Exemple d'endpoint: POST /playlists/spotify/{id}/categorize
  const res = await apiClient.post(`/playlists/${provider}/${id}/categorize`, { category });
  return res.data;
}

export default { getPlaylists, getPlaylistById, categorizePlaylist };