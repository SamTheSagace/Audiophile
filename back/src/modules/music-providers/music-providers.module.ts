import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicProvidersService } from './music-providers.service';
import { SpotifyAdapter } from './adapters/spotify/spotify.adapter';
import { SpotifyManager } from './adapters/spotify/spotify-manager.service';
import { SpotifyBrowser } from './adapters/spotify/spotify-browser.service';
import { ProviderRegistry } from './auth/provider-registry.service';
import { GenericAuthController } from './auth/generic-auth.controller';
import { ConnectedAccount } from '../users/entities/connected-account.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ConnectedAccount])],
  controllers: [GenericAuthController],
  providers: [
    MusicProvidersService,
    SpotifyAdapter,
    SpotifyBrowser,
    SpotifyManager,
    ProviderRegistry,
  ],
  exports: [MusicProvidersService],
})
export class MusicProvidersModule {}
