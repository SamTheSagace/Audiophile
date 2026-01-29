import { Injectable } from '@nestjs/common';
import { SpotifyManager } from './spotify-manager.service';
import { SpotifyBrowser } from './spotify-browser.service';
import {
  MusicProviderInterface,
  NormalizedPlaylist,
} from '../../interfaces/music-provider.interface';

@Injectable()
export class SpotifyAdapter implements MusicProviderInterface {
  
  constructor(
    private readonly browser: SpotifyBrowser,
    private readonly manager: SpotifyManager,
  ) {}


  async getOwnerId(accessToken: string): Promise<string> {
    return this.browser.getOwnerId(accessToken);
  }

  async getUserPlaylists(accessToken: string): Promise<NormalizedPlaylist[]> {
    return this.browser.getUserPlaylists(accessToken);
  }

  async getPlaylistDetails(playlistId: string, accessToken: string): Promise<NormalizedPlaylist> {
    return this.browser.getPlaylistDetails(playlistId, accessToken);
  }


  async createPlaylist(name: string, description: string, accessToken: string, providerUserId: string): Promise<string> {
    return this.manager.createPlaylist(name, description, accessToken, providerUserId);
  }

  async addTracksToPlaylist(playlistId: string, trackIds: string[], accessToken: string): Promise<void> {
    return this.manager.addTracksToPlaylist(playlistId, trackIds, accessToken);
  }
}