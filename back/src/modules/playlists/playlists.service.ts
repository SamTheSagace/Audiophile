import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MusicProvidersService } from '../music-providers/music-providers.service';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';
import {
  NormalizedPlaylist,
  PlaylistSummary,
} from '../music-providers/interfaces/music-provider.interface';
import { PlaylistCategorizerService } from './playlist-categorizer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ConnectedAccount } from '../users/entities/connected-account.entity';
import { CategorizedPlaylist } from './interfaces/categorized-playlist.interface';

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

  async findAllByProvider(
    provider: ProviderEnum,
    userId: string,
  ): Promise<PlaylistSummary[]> {
    const accessToken = await this.getAccessTokenOrThrow(userId, provider);
    return this.musicProvidersService.getUserPlaylists(provider, accessToken);
  }

  async findOneByProvider(
    provider: ProviderEnum,
    playlistId: string,
    userId: string,
  ): Promise<NormalizedPlaylist> {
    const accessToken = await this.getAccessTokenOrThrow(userId, provider);
    return this.musicProvidersService.getPlaylistDetails(
      provider,
      playlistId,
      accessToken,
    );
  }

  // Route: Catégoriser
  async categorizePlaylist(
    provider: ProviderEnum,
    playlistId: string,
    userId: string,
  ): Promise<CategorizedPlaylist> {
    const user = await this.getUserOrThrow(userId);
    const accessToken = await this.getAccessTokenOrThrow(userId, provider);

    const rawPlaylist = await this.musicProvidersService.getPlaylistDetails(
      provider,
      playlistId,
      accessToken,
    );

    const result =
      this.playlistCategorizer.classifyByGenreFamilies(rawPlaylist);

    await this.savePlaylistState(user, rawPlaylist, result);
    return result;
  }

  async exportPlaylistToProvider(
    provider: ProviderEnum,
    userId: string,
    sourcePlaylistId: string,
    categoryName: string,
    trackIds?: string[],
    customName?: string,
  ) {
    // 1. Connexion Provider
    const accessToken = await this.getAccessTokenOrThrow(userId, provider);
    const providerUserId = await this.musicProvidersService.getOwnerId(
      provider,
      accessToken,
    );

    // 2. Récupération de l'entité en BDD
    const playlistEntity = await this.playlistRepository.findOne({
      where: { originalId: sourcePlaylistId, userId: userId },
    });

    if (!playlistEntity?.categorizedResult) {
      throw new NotFoundException(
        `La playlist ${sourcePlaylistId} n'a pas encore été triée en base.`,
      );
    }

    const result = playlistEntity.categorizedResult;

    if (!result[categoryName]) {
      throw new NotFoundException(
        `La catégorie '${categoryName}' n'existe pas dans cette playlist.`,
      );
    }

    // 3. LOGIQUE DE PERSISTANCE
    let finalTrackIds: string[] = [];

    // CAS A : Modif utilisateur
    if (trackIds && trackIds.length > 0) {
      const updatedTracks = result[categoryName].filter((track) =>
        trackIds.includes(track.id),
      );

      result[categoryName] = updatedTracks;
      playlistEntity.categorizedResult = result;

      await this.playlistRepository.save(playlistEntity);
      finalTrackIds = trackIds;
    }
    // CAS B : Export complet
    else {
      finalTrackIds = result[categoryName].map((track) => track.id);
    }

    // 4. Export vers le Provider
    const newPlaylistName = customName || `Audiophile - ${categoryName}`;
    const description = `Généré automatiquement par Audiophile.`;

    const newPlaylistId = await this.musicProvidersService.createPlaylist(
      provider,
      newPlaylistName,
      description,
      accessToken,
      providerUserId,
    );

    // 5. Ajout des tracks
    if (finalTrackIds.length > 0) {
      const chunkSize = 100;
      for (let i = 0; i < finalTrackIds.length; i += chunkSize) {
        const chunk = finalTrackIds.slice(i, i + chunkSize);
        await this.musicProvidersService.addTracksToPlaylist(
          provider,
          newPlaylistId,
          chunk,
          accessToken,
        );
      }
    }

    return {
      success: true,
      newPlaylistId,
      message: `Playlist '${newPlaylistName}' créée avec ${finalTrackIds.length} titres !`,
    };
  }

  private async getAccessTokenOrThrow(
    userId: string,
    provider: ProviderEnum,
  ): Promise<string> {
    const account = await this.accountRepository.findOneBy({
      userId,
      provider,
    });
    if (!account?.accessToken) throw new UnauthorizedException('Non connecté');
    return account.accessToken;
  }

  private async getUserOrThrow(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User introuvable');
    return user;
  }

  private async savePlaylistState(
    user: User,
    rawPlaylist: NormalizedPlaylist,
    result: CategorizedPlaylist,
  ): Promise<void> {
    let entity = await this.playlistRepository.findOneBy({
      originalId: rawPlaylist.id,
      userId: user.id,
    });
    entity ??= this.playlistRepository.create({
      originalId: rawPlaylist.id,
      name: rawPlaylist.name,
      provider: rawPlaylist.provider,
      user: user,
    });
    entity.categorizedResult = result;
    await this.playlistRepository.save(entity);
  }
}
