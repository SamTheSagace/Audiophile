import { Injectable } from '@nestjs/common';
import { DeezerManager } from './deezer-manager.service';
import { DeezerBrowser } from './deezer-browser.service';
import {
  MusicProviderInterface,
  NormalizedPlaylist,
  PlaylistSummary,
} from '../../interfaces/music-provider.interface';

@Injectable()
export class DeezerAdapter implements MusicProviderInterface {
  constructor(
    private readonly browser: DeezerBrowser,
    private readonly manager: DeezerManager,
  ) {}

  async getOwnerId(accessToken: string): Promise<string> {
    return this.browser.getOwnerId(accessToken);
  }

  async getUserPlaylists(accessToken: string): Promise<PlaylistSummary[]> {
    return this.browser.getUserPlaylists(accessToken);
  }

  async getPlaylistDetails(
    playlistId: string,
    accessToken: string,
  ): Promise<NormalizedPlaylist> {
    return this.browser.getPlaylistDetails(playlistId, accessToken);
  }

  async createPlaylist(
    name: string,
    description: string,
    accessToken: string,
    providerUserId: string,
  ): Promise<string> {
    return this.manager.createPlaylist(
      name,
      description,
      accessToken,
      providerUserId,
    );
  }

  async addTracksToPlaylist(
    playlistId: string,
    trackIds: string[],
    accessToken: string,
  ): Promise<void> {
    return this.manager.addTracksToPlaylist(playlistId, trackIds, accessToken);
  }
}
