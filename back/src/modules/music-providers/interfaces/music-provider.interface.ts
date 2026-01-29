import { ProviderEnum } from './provider.enum';

export interface NormalizedPlaylist {
  id: string;
  name: string;
  imageUrl?: string;
  provider: ProviderEnum;
  tracks: NormalizedTrack[];
}

export interface NormalizedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre?: string;
}

export interface MusicProviderInterface {
  getUserPlaylists(accessToken: string): Promise<NormalizedPlaylist[]>;
  getPlaylistDetails(playlistId: string, accessToken: string): Promise<NormalizedPlaylist>;
  createPlaylist(name: string, description: string, accessToken: string, providerUserId: string): Promise<string>;
  addTracksToPlaylist(playlistId: string, trackIds: string[], accessToken: string): Promise<void>;
  getOwnerId(accessToken: string): Promise<string>;
}