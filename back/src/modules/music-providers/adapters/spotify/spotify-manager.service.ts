import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


/**
 *  SpotifyManager
 * -----------------
 * Ce service est responsable de toutes les opérations d'ÉCRITURE (Write/Mutation)
 * vers l'API Spotify.
 * * Rôle :
 * - Créer de nouvelles playlists
 * - Ajouter des morceaux à une playlist
 * - (Futur) Modifier la description ou l'image d'une playlist
 * * IMPORTANT : Chaque méthode ici a un impact réel sur le compte de l'utilisateur.
 */
@Injectable()
export class SpotifyManager {
  private readonly BASE_URL = 'https://api.spotify.com/v1';

  constructor(private readonly httpService: HttpService) {}

  async createPlaylist(name: string, description: string, accessToken: string, providerUserId: string): Promise<string> {
    const url = `${this.BASE_URL}/users/${providerUserId}/playlists`;
    const body = { name, description, public: false };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, body, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data.id;
    } catch (error) {
      console.error('Spotify: Erreur Création', error.response?.data);
      throw error;
    }
  }

  async addTracksToPlaylist(playlistId: string, trackIds: string[], accessToken: string): Promise<void> {
    const url = `${this.BASE_URL}/playlists/${playlistId}/tracks`;
    const uris = trackIds.map(id => `spotify:track:${id}`);

    try {
      await firstValueFrom(
        this.httpService.post(url, { uris }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
    } catch (error) {
       console.error('Spotify: Erreur Ajout Tracks', error.response?.data);
       throw error;
    }
  }
}