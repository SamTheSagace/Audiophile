import { Injectable, BadRequestException } from '@nestjs/common';
import { MusicProviderInterface, NormalizedPlaylist } from './interfaces/music-provider.interface';
import { ProviderEnum } from './interfaces/provider.enum';
import { SpotifyAdapter } from './adapters/spotify.adapter';

/**
 * Service pour les providers de musique.
 * Utilise le pattern Strategy pour déléguer les appels au bon adapter.
 */
@Injectable()
export class MusicProvidersService {
  // Registre interne associant l'Enum du provider à son instance
  private providers: Map<ProviderEnum, MusicProviderInterface> = new Map();

  constructor(
    private readonly spotifyAdapter: SpotifyAdapter,
  ) {
    this.registerProviders();
  }

  private registerProviders() {
    this.providers.set(ProviderEnum.SPOTIFY, this.spotifyAdapter);
    // Ajouter les futurs adapters ici 
  }

  /**
   * Récupère l'instance de l'adapter demandé ou lève une erreur si non supporté.
   */
  private getProvider(provider: ProviderEnum): MusicProviderInterface {
    const adapter = this.providers.get(provider);
    if (!adapter) {
      throw new BadRequestException(`Le provider ${provider} n'est pas supporté.`);
    }
    return adapter;
  }

  async getUserPlaylists(providerType: ProviderEnum, accessToken: string): Promise<NormalizedPlaylist[]> {
    const provider = this.getProvider(providerType);
    return provider.getUserPlaylists(accessToken);
  }

  async getPlaylistDetails(providerType: ProviderEnum, playlistId: string, accessToken: string): Promise<NormalizedPlaylist> {
    const provider = this.getProvider(providerType);
    return provider.getPlaylistDetails(playlistId, accessToken);
  }

  async createPlaylist(providerType: ProviderEnum, name: string, desc: string, accessToken: string, providerUserId: string) {
    return this.getProvider(providerType).createPlaylist(name, desc, accessToken, providerUserId);
  }

  async addTracksToPlaylist(providerType: ProviderEnum, playlistId: string, trackIds: string[], accessToken: string) {
    return this.getProvider(providerType).addTracksToPlaylist(playlistId, trackIds, accessToken);
  }

  async getOwnerId(providerType: ProviderEnum, accessToken: string): Promise<string> {
    return this.getProvider(providerType).getOwnerId(accessToken);
  }
}