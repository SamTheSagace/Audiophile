import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MusicProvidersService } from './music-providers.service';
import { SpotifyAdapter } from './adapters/spotify.adapter';

@Module({
  imports: [HttpModule],
  providers: [
    MusicProvidersService,
    SpotifyAdapter,
  ],
  exports: [MusicProvidersService],
})
export class MusicProvidersModule {}