import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  NormalizedPlaylist,
  NormalizedTrack,
  PlaylistSummary,
} from '../../interfaces/music-provider.interface';
import { ProviderEnum } from '../../interfaces/provider.enum';
import {
  SpotifyPlaylist,
  SpotifyPlaylistSummary,
  SpotifyTrack,
  SpotifyPlaylistTracksResponse,
  SpotifyPlaylistTrackItem,
} from '../../interfaces/spotify.interface';

@Injectable()
export class SpotifyBrowser {
  private readonly BASE_URL = 'https://api.spotify.com/v1';

  constructor(private readonly httpService: HttpService) {}

  async getOwnerId(accessToken: string): Promise<string> {
    try {
      const { data } = await firstValueFrom<AxiosResponse<any>>(
        this.httpService.get(`${this.BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data.id;
    } catch (error) {
      console.error('Spotify: Erreur Owner ID', error.response?.data);
      throw error;
    }
  }

  async getUserPlaylists(accessToken: string): Promise<PlaylistSummary[]> {
    try {
      const { data } = await firstValueFrom<
        AxiosResponse<SpotifyPlaylistSummary>
      >(
        this.httpService.get(`${this.BASE_URL}/me/playlists`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      const playlists: PlaylistSummary[] = data.items.map((item) => {
        return {
          id: item.id,
          name: item.name,
          imageUrl: item.images?.[0]?.url,
          provider: ProviderEnum.SPOTIFY,
          trackCount: item.tracks.total,
        };
      });

      return playlists;
    } catch (error) {
      console.error('Spotify: Erreur User Playlists', error.response?.data);
      throw new Error('Échec récupération playlists Spotify');
    }
  }

  async getPlaylistDetails(
    playlistId: string,
    accessToken: string,
  ): Promise<NormalizedPlaylist> {
    const maxTracksToFetchPerCall = 50;

    try {
      let playlistTrackItems: SpotifyPlaylistTrackItem[] = [];

      const {
        data: initialData,
        status,
        statusText,
      } = await firstValueFrom<AxiosResponse<SpotifyPlaylist>>(
        this.httpService.get(`${this.BASE_URL}/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      if (status !== 200) {
        throw new Error(
          `Spotify: Échec récupération playlist ${playlistId}, statut ${status}, ${statusText}`,
        );
      }

      const totalTracks = initialData.tracks.total;
      const totalCalls = Math.ceil(totalTracks / maxTracksToFetchPerCall) || 1;

      for (let callIndex = 0; callIndex < totalCalls; callIndex++) {
        const offset = callIndex * maxTracksToFetchPerCall;

        const { data } = await firstValueFrom<
          AxiosResponse<SpotifyPlaylistTracksResponse>
        >(
          this.httpService.get(
            `${this.BASE_URL}/playlists/${playlistId}/tracks`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              params: {
                limit: maxTracksToFetchPerCall,
                offset: offset,
              },
            },
          ),
        );

        playlistTrackItems = playlistTrackItems.concat(data.items);
      }

      // Extraire uniquement les objets `track` (certains items peuvent être null ou avoir track=null)
      const rawTracks = playlistTrackItems
        .map((item) => item.track)
        .filter((t): t is SpotifyTrack => !!t);

      // 2. Logique des Genres
      const artistIds = [
        ...new Set(rawTracks.map((track) => track.artists?.[0]?.id)),
      ].filter(Boolean) as string[];

      const genresMap = await this.getArtistsGenres(artistIds, accessToken);

      // 3. Mapping final
      const tracks = rawTracks.map((trackData) => {
        const artistId = trackData.artists?.[0]?.id;
        const genres = artistId ? genresMap.get(artistId) : [];

        return {
          id: trackData.id ?? '',
          title: trackData.name ?? 'Unknown',
          artist: trackData.artists?.[0]?.name ?? 'Unknown',
          album: trackData.album?.name ?? 'Unknown',
          duration: trackData.duration_ms
            ? Math.round(trackData.duration_ms / 1000)
            : 0,
          genre: genres && genres.length > 0 ? genres[0] : 'Indéfini',
        };
      });

      if (tracks.length === 0) {
        console.warn(
          `Spotify: Playlist ${playlistId} vide ou sans tracks valides.`,
        );
      }

      return {
        id: playlistId,
        imageUrl: initialData.images?.[0]?.url || '',
        provider: ProviderEnum.SPOTIFY,
        name: initialData.name,
        tracks: tracks as NormalizedTrack[],
      };
    } catch (error) {
      console.error('Spotify: Erreur Playlist Details', error.response?.data);
      throw error;
    }
  }

  private async getArtistsGenres(
    artistIds: string[],
    accessToken: string,
  ): Promise<Map<string, string[]>> {
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
      console.warn('Spotify: Erreur Genres', error.message);
      return new Map();
    }
  }
}
