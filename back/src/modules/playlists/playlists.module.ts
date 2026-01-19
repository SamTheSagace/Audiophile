import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { MusicProvidersModule } from '../music-providers/music-providers.module';
import { PlaylistCategorizerService } from './playlist-categorizer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { User } from '../users/entities/user.entity';
import { ConnectedAccount } from '../users/entities/connected-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, User, ConnectedAccount]), MusicProvidersModule],
  controllers: [PlaylistsController],
  providers: [PlaylistsService, PlaylistCategorizerService],
})
export class PlaylistsModule {}
