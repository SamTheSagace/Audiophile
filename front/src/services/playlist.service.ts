import { apiClient } from '@/api/axios.client';
import type { NormalizedPlaylist, ProviderType } from '@/types/playlist.types';

/**
 * Récupère la liste des playlists pour un provider donné.
 * @param provider 'spotify' | 'deezer'
 */
export const fetchPlaylists = async (provider: ProviderType): Promise<NormalizedPlaylist[]> => {
  const response = await apiClient.get<NormalizedPlaylist[]>(`/playlists/${provider}`);
  return response.data;
};