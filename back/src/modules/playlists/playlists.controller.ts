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
   * GET /playlists/spotify/12345
   */
  @Get(':provider/:id')
  async findOne(
    @Param('provider', new ParseEnumPipe(ProviderEnum)) provider: ProviderEnum,
    @Param('id') playlistId: string,
    @Req() req: any,
  ) {
    return this.playlistsService.findOneByProvider(provider, playlistId, req.user.userId);
  }

  /**
   * GET /playlists/spotify/12345/categorize
   */
  @Get(':provider/:id/categorize')
  async categorize(
    @Param('provider', new ParseEnumPipe(ProviderEnum)) provider: ProviderEnum,
    @Param('id') playlistId: string,
    @Req() req: any, 
  ) {
    return this.playlistsService.categorizePlaylist(provider, playlistId, req.user.userId);
  }

  /**
   * POST /playlists/spotify/export
   * Body: { categoryName: "Rock", trackIds: ["id1", "id2"] }
   */
  @Post(':provider/export')
  async export(
    @Param('provider', new ParseEnumPipe(ProviderEnum)) provider: ProviderEnum,
    @Body() body: { sourcePlaylistId: string; categoryName: string; trackIds: string[] },
    @Req() req: any,
  ) {
    return this.playlistsService.exportPlaylistToProvider(
      provider,
      req.user.userId,
      body.sourcePlaylistId,
      body.categoryName,
      body.trackIds
    );
  }
}