import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MusicProvidersService } from './music-providers.service';
import { SpotifyAdapter } from './adapters/spotify/spotify.adapter';
import { SpotifyManager } from './adapters/spotify/spotify-manager.service';
import { SpotifyBrowser } from './adapters/spotify/spotify-browser.service';

@Module({
  imports: [HttpModule],
  providers: [
    MusicProvidersService,
    SpotifyAdapter,
    SpotifyBrowser,
    SpotifyManager
  ],
  exports: [MusicProvidersService],
})
export class MusicProvidersModule {}