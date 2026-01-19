import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { NormalizedPlaylist } from '../../interfaces/music-provider.interface';
import { ProviderEnum } from '../../interfaces/provider.enum';

// Ne pas modifié les anys ici, car les réponses de l'API Spotify sont dynamiques et non typées strictement.
// On pourrait créer des interfaces spécifiques pour chaque réponse, mais cela alourdirait le code inutilement. (j'ai essayé et c'est chiant)
// Le but ici est de garder la flexibilité tout en gérant les erreurs (et vous avez pas le choix c'est une dictature).
// Les anys sont confinés à ce service uniquement.
// Donc faites pas chier.

@Injectable()
export class DeezerBrowser {
  private readonly BASE_URL = 'https://api.deezer.com/';

  constructor(private readonly httpService: HttpService) {}

  async getOwnerId(accessToken: string): Promise<string> {
    try {
      const { data } = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.get(`${this.BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data.id;
    } catch (error) {
      console.error('Deezer: Erreur Owner ID', error.response?.data);
      throw error;
    }
  }

  async getUserPlaylists(accessToken: string): Promise<NormalizedPlaylist[]> {
    try {
      const { data } = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.get(`${this.BASE_URL}/me/playlists`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      return data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        provider: ProviderEnum.DEEZER,
        tracks: [],
      }));
    } catch (error) {
      console.error('Deezer: Erreur User Playlists', error.response?.data);
      throw new Error('Échec récupération playlists Deezer');
    }
  }

  async getPlaylistDetails(playlistId: string, accessToken: string): Promise<NormalizedPlaylist> {
    try {
      // 1. Récupérer la playlist brute
      const { data } = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.get(`${this.BASE_URL}/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      const rawTracks = data.tracks.items.filter((item: any) => item.track !== null);

      // 2. Logique des Genres
      const artistIds = [...new Set(rawTracks.map((item: any) => item.track!.artists[0]?.id))].filter(Boolean);
      
      const genresMap = await this.getArtistsGenres(artistIds as string[], accessToken);

      // 3. Mapping final
      const tracks = rawTracks.map((item: any) => {
        const trackData = item.track!; 
        const artistId = trackData.artists[0]?.id;
        const genres = genresMap.get(artistId) || [];
        
        return {
          id: trackData.id,
          title: trackData.name,
          artist: trackData.artists[0]?.name || 'Unknown',
          album: trackData.album.name,
          duration: Math.round(trackData.duration_ms / 1000),
          genre: genres[0] || 'Unknown',
        };
      });

      return {
        id: data.id,
        name: data.name,
        provider: ProviderEnum.DEEZER,
        tracks: tracks,
      };
    } catch (error) {
      console.error('Deezer: Erreur Playlist Details', error.response?.data);
      throw error;
    }
  }

  private async getArtistsGenres(artistIds: string[], accessToken: string): Promise<Map<string, string[]>> {
    if (artistIds.length === 0) return new Map();
    const idsToFetch = artistIds.slice(0, 50).join(',');

    try {
      const { data } = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.get(`${this.BASE_URL}/artists`, {
          params: { ids: idsToFetch },
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      
      const map = new Map<string, string[]>();
      data.artists.forEach((artist) => map.set(artist.id, artist.genres));
      return map;
    } catch (error) {
      console.warn('Deezer: Erreur Genres', error.message);
      return new Map();
    }
  }
}