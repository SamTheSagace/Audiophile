import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  MusicProviderInterface,
  NormalizedPlaylist,
} from '../interfaces/music-provider.interface';
import { ProviderEnum } from '../interfaces/provider.enum';

@Injectable()
export class SpotifyAdapter implements MusicProviderInterface {
  private readonly BASE_URL = 'https://api.spotify.com/v1';

  constructor(private readonly httpService: HttpService) {}

  async getUserPlaylists(accessToken: string): Promise<NormalizedPlaylist[]> {
    try {
      const { data }: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.BASE_URL}/me/playlists`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      // Mapping de la réponse Spotify vers notre format normalisé
      return data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        provider: ProviderEnum.SPOTIFY,
        tracks: [],
      }));
    } catch (error) {
      // TODO: Améliorer le logging (Sentry ou Logger NestJS)
      console.error(
        'Erreur API Spotify:',
        error.response?.data || error.message,
      );
      throw new Error('Échec de la récupération des playlists Spotify.');
    }
  }

  async getPlaylistDetails(playlistId: string, accessToken: string): Promise<NormalizedPlaylist> {
    try {
      //Récupérer la playlist et ses tracks
      const { data }: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.BASE_URL}/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      const rawTracks = data.tracks.items.filter((item: any) => item.track);

      //Extraire les IDs des artistes (sans doublons) pour limiter les appels API
      // On utilise un Set pour dédoublonner automatiquement
      const artistIds = [...new Set(rawTracks.map((item: any) => item.track.artists[0]?.id))].filter(id => id);

      //Récupérer les genres via notre méthode dédiée (voir plus bas)
      const genresMap = await this.getArtistsGenres(artistIds as string[], accessToken);

      //Construction du résultat final en fusionnant les infos
      const tracks = rawTracks.map((item: any) => {
        const artistId = item.track.artists[0]?.id;
        const artistGenres = genresMap.get(artistId) || [];
        
        return {
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists[0]?.name || 'Unknown',
          album: item.track.album.name,
          duration: Math.round(item.track.duration_ms / 1000),
          // On prend le premier genre de la liste (souvent le plus représentatif) mais peut etre plus tard on pourrait envisager une logique plus complexe
          genre: artistGenres.length > 0 ? artistGenres[0] : 'Unknown', 
        };
      });

      return {
        id: data.id,
        name: data.name,
        provider: ProviderEnum.SPOTIFY,
        tracks: tracks,
      };

    } catch (error) {
      console.error('Erreur Playlist Details:', error.response?.data || error.message);
      throw new Error('Impossible de récupérer les détails de la playlist');
    }
  }

  async createPlaylist(name: string, description: string, accessToken: string, providerUserId: string): Promise<string> {
    const url = `${this.BASE_URL}/users/${providerUserId}/playlists`;
    
    const body = {
      name: name,
      description: description,
      public: false 
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, body, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data.id;
    } catch (error) {
      console.error('Erreur creation Spotify', error.response?.data);
      throw error;
    }
  }

  async addTracksToPlaylist(playlistId: string, trackIds: string[], accessToken: string): Promise<void> {
    const url = `${this.BASE_URL}/playlists/${playlistId}/tracks`;

    // Spotify a besoin de "uris" au format "spotify:track:ID"
    const uris = trackIds.map(id => `spotify:track:${id}`);

    const body = { uris };

    try {
      await firstValueFrom(
        this.httpService.post(url, body, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
    } catch (error) {
       console.error('Erreur ajout tracks Spotify', error.response?.data);
       throw error;
    }
  }

  async getOwnerId(accessToken: string): Promise<string> {
    try {
      // On appelle /me pour avoir le profil
      const { data } = await firstValueFrom(
        this.httpService.get('https://api.spotify.com/v1/me', { // Attention URL v1
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data.id;
    } catch (error) {
      console.error('Erreur récupération profil Spotify', error.response?.data);
      throw error;
    }
  }

  /**
   * Helper pour récupérer les genres d'une liste d'artistes.
   * Spotify permet de récupérer jusqu'à 50 artistes d'un coup via l'endpoint /artists?ids=...
   */
  private async getArtistsGenres(artistIds: string[], accessToken: string): Promise<Map<string, string[]>> {
    if (artistIds.length === 0) return new Map();

    // Note pour le futur : Si > 50 artistes, il faudra faire des "chunks" (paquets) de 50.
    // Pour l'instant, on prend les 50 premiers pour l'exemple.
    const idsToFetch = artistIds.slice(0, 50).join(',');

    try {
      const { data }: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.BASE_URL}/artists`, {
          params: { ids: idsToFetch },
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      // On transforme le tableau en Map pour un accès rapide (O(1)) par ID ensuite
      const map = new Map<string, string[]>();
      data.artists.forEach((artist: any) => {
        map.set(artist.id, artist.genres); // Spotify renvoie un tableau de genres ex: ["power metal", "symphonic metal"]
      });
      
      return map;

    } catch (error) {
      console.warn('Impossible de récupérer les genres des artistes', error.message);
      return new Map(); // Si ça échoue, on renverra juste sans genre
    }
  }
}
