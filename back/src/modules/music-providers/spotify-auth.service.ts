import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedAccount } from '../users/entities/connected-account.entity';
import { ProviderEnum } from './interfaces/provider.enum';

@Injectable()
export class SpotifyAuthService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(ConnectedAccount)
    private readonly accountRepo: Repository<ConnectedAccount>,
  ) {}

  async refreshAccessToken(refreshToken: string) {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const res = await axios.post(
      'https://accounts.spotify.com/api/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      },
    );

    return res.data; // { access_token, expires_in, scope, (maybe) refresh_token }
  }

  /**
   * Retourne un access token valide pour l'utilisateur (refresh automatique si nécessaire)
   */
  async getAccessTokenForUser(userId: string): Promise<string> {
    const account = await this.accountRepo.findOneBy({ userId, provider: ProviderEnum.SPOTIFY });
    if (!account) throw new NotFoundException('Spotify account not linked for user');

    const now = new Date();
    const bufferSeconds = 60; // refresh 60s before expiry

    if (account.expiresAt && account.expiresAt.getTime() > now.getTime() + bufferSeconds * 1000) {
      // still valid
      return account.accessToken;
    }

    if (!account.refreshToken) {
      throw new BadRequestException('No refresh token available for Spotify account');
    }

    // Refresh
    const data = await this.refreshAccessToken(account.refreshToken);

    if (!data.access_token) throw new BadRequestException('Failed to refresh Spotify access token');

    account.accessToken = data.access_token;
    if (data.refresh_token) account.refreshToken = data.refresh_token; // sometimes Spotify rotates
    if (data.expires_in) {
      const exp = new Date();
      exp.setSeconds(exp.getSeconds() + Number(data.expires_in));
      account.expiresAt = exp;
    }

    await this.accountRepo.save(account);
    return account.accessToken;
  }
}
