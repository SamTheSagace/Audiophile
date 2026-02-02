import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

@Controller('playlists')
@UseGuards(AuthGuard('jwt')) //toutes les routes ici nécessitent une authentification JWT
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  /**
   * GET /playlists/spotify
   * Plus besoin de header spécial, juste le JWT d'Audiophile.
   */
  @Get(':provider')
  async findAll(
    @Param('provider', new ParseEnumPipe(ProviderEnum)) provider: ProviderEnum,
    @Req() req: any,
  ) {
    return this.playlistsService.findAllByProvider(provider, req.user.userId);
  }

  /**
   * GET /playlists/spotify/12345/categorize
   */
  @Get(':provider/:id/categorize')
  async categorize(
    @Param('provider', new ParseEnumPipe(ProviderEnum)) provider: ProviderEnum,
    @Param('id') playlistId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playlistsService.categorizePlaylist(
      provider,
      playlistId,
      req.user.userId,
    );
  }

  /**
   * GET /playlists/spotify/12345
   */
  @Get(':provider/:id')
  async findOne(
    @Param('provider', new ParseEnumPipe(ProviderEnum)) provider: ProviderEnum,
    @Param('id') playlistId: string,
    @Req() req: any,
  ) {
    return this.playlistsService.findOneByProvider(
      provider,
      playlistId,
      req.user.userId,
    );
  }

  /**
   * POST /playlists/:provider/export
   * * Exporte une catégorie de musique vers une nouvelle playlist réelle sur la plateforme (Spotify/Deezer).
   * * Deux modes de fonctionnement :
   * 1. Mode "Automatique" : On envoie juste l'ID source et la catégorie. Le backend retrouve les sons en BDD.
   * 2. Mode "Manuel" : On envoie la liste 'trackIds' explicite.
   *  IMPORTANT : Dans ce mode, la BDD est mise à jour pour sauvegarder la sélection de l'utilisateur avant l'export.
   * * * Body: {
   * sourcePlaylistId: "...",
   * categoryName: "Rock",
   * trackIds?: ["id1", "id2"], // Optionnel (Déclenche la mise à jour BDD)
   * customName?: "Svp une bonne note ca serait le top" // Optionnel
   * }
   */
  @Post(':provider/export')
  async export(
    @Param('provider', new ParseEnumPipe(ProviderEnum)) provider: ProviderEnum,
    @Body()
    body: {
      sourcePlaylistId: string;
      categoryName: string;
      trackIds?: string[]; // Si présent : met à jour la BDD puis exporte
      customName?: string; //Pour renommer la playlist
    },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playlistsService.exportPlaylistToProvider(
      provider,
      req.user.userId,
      body.sourcePlaylistId,
      body.categoryName,
      body.trackIds,
      body.customName,
    );
  }
}
