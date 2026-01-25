import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicProvidersService } from './music-providers.service';
import { SpotifyAdapter } from './adapters/spotify/spotify.adapter';
import { SpotifyManager } from './adapters/spotify/spotify-manager.service';
import { SpotifyBrowser } from './adapters/spotify/spotify-browser.service';
import { SpotifyAuthService } from './spotify-auth.service';
import { SpotifyAuthController } from './spotify-auth.controller';
import { ProviderRegistry } from './auth/provider-registry.service';
import { SpotifyAuthHandler } from './auth/spotify-auth.handler';
import { GenericAuthController } from './auth/generic-auth.controller';
import { ConnectedAccount } from '../users/entities/connected-account.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ConnectedAccount])],
  controllers: [SpotifyAuthController, GenericAuthController],
  providers: [
    MusicProvidersService,
    SpotifyAdapter,
    SpotifyBrowser,
    SpotifyManager,
    SpotifyAuthService,
    ProviderRegistry,
    SpotifyAuthHandler,
    {
      provide: 'SPOTIFY_HANDLER_REGISTRATION',
      useFactory: (registry: ProviderRegistry, handler: SpotifyAuthHandler) => {
        registry.register(handler);
        return true;
      },
      inject: [ProviderRegistry, SpotifyAuthHandler],
    },
  ],
  exports: [MusicProvidersService],
})
export class MusicProvidersModule {}
