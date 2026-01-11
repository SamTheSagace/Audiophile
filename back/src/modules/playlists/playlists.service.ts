import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MusicProvidersService } from '../music-providers/music-providers.service';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';
import { NormalizedPlaylist } from '../music-providers/interfaces/music-provider.interface';
import {
  PlaylistCategorizerService,
  CategorizedPlaylist,
} from './playlist-categorizer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ConnectedAccount } from '../users/entities/connected-account.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly musicProvidersService: MusicProvidersService,
    private readonly playlistCategorizer: PlaylistCategorizerService,

    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ConnectedAccount)
    private readonly accountRepository: Repository<ConnectedAccount>,
  ) {}

 // Route: Lister les playlists
  async findAllByProvider(provider: ProviderEnum, userId: string): Promise<NormalizedPlaylist[]> {
    const accessToken = await this.getAccessTokenOrThrow(userId, provider);
    return this.musicProvidersService.getUserPlaylists(provider, accessToken);
  }

  // Route: Détail d'une playlist
  async findOneByProvider(provider: ProviderEnum, playlistId: string, userId: string): Promise<NormalizedPlaylist> {
    const accessToken = await this.getAccessTokenOrThrow(userId, provider);
    return this.musicProvidersService.getPlaylistDetails(provider, playlistId, accessToken);
  }

  // Route: Catégoriser (déjà fait, mais on utilise le helper maintenant)
  async categorizePlaylist(provider: ProviderEnum, playlistId: string, userId: string): Promise<CategorizedPlaylist> {
    const user = await this.getUserOrThrow(userId);
    const accessToken = await this.getAccessTokenOrThrow(userId, provider); // Utilisation du helper

    const rawPlaylist = await this.musicProvidersService.getPlaylistDetails(provider, playlistId, accessToken);
    const categorizedResult = this.playlistCategorizer.classifyByGenreFamilies(rawPlaylist);
    
    await this.savePlaylistState(user, rawPlaylist, categorizedResult);
    return categorizedResult;
  }

  async exportPlaylistToProvider(
    provider: ProviderEnum,
    userId: string,
    sourcePlaylistId: string,
    categoryName: string, // Ex: "Rock & Metal"
    trackIds: string[]    // La liste des IDs filtrés
  ) {
    // 1. On récupère les infos de connexion
    const account = await this.accountRepository.findOneBy({ userId, provider });
    if (!account || !account.accessToken) throw new UnauthorizedException('Compte non relié');
    const accessToken = account.accessToken;
    const providerUserId = account.providerUserId;

    // 2. On génère un nom cool pour la nouvelle playlist
    // Ex: "Strong Like a Dwarf (Rock & Metal)"
    // Pour ça, il faudrait idéalement récupérer le nom de la playlist source, 
    // mais pour faire simple on va juste mettre le nom de la catégorie pour l'instant.
    const newPlaylistName = `Audiophile - ${categoryName}`;
    const description = `Généré automatiquement par Audiophile depuis la playlist source.`;

    // 3. Création de la playlist vide
    const newPlaylistId = await this.musicProvidersService.createPlaylist(
        provider, 
        newPlaylistName, 
        description, 
        accessToken, 
        providerUserId // Besoin de l'ID User Spotify pour créer une playlist
    );

    // 4. Ajout des tracks
    if (trackIds.length > 0) {
        await this.musicProvidersService.addTracksToPlaylist(provider, newPlaylistId, trackIds, accessToken);
    }

    return { success: true, newPlaylistId, message: `Playlist '${newPlaylistName}' créée avec succès !` };
  }

  /**
   * Récupère le token Spotify/Deezer en base de données.
   * Si pas de token => Erreur 401.
   */
  private async getAccessTokenOrThrow(userId: string, provider: ProviderEnum): Promise<string> {
    const account = await this.accountRepository.findOneBy({ userId, provider });

    if (!account || !account.accessToken) {
      throw new UnauthorizedException(`Vous devez d'abord connecter votre compte ${provider} pour effectuer cette action.`);
    }

    return account.accessToken;
  }

  private async getUserOrThrow(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`Utilisateur introuvable.`);
    return user;
  }

  private async savePlaylistState(user: User, rawPlaylist: NormalizedPlaylist, result: CategorizedPlaylist): Promise<void> {
    let entity = await this.playlistRepository.findOneBy({ originalId: rawPlaylist.id, userId: user.id });
    if (!entity) {
      entity = this.playlistRepository.create({
        originalId: rawPlaylist.id,
        name: rawPlaylist.name,
        provider: rawPlaylist.provider,
        user: user,
      });
    }
    entity.categorizedResult = result;
    await this.playlistRepository.save(entity);
  }
}
