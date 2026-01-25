import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ProviderAuthHandler, TokenResult } from './provider-auth.interface';
import { ProviderEnum } from '../interfaces/provider.enum';
import { SpotifyBrowser } from '../adapters/spotify/spotify-browser.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedAccount } from '../../users/entities/connected-account.entity';

@Injectable()
export class SpotifyAuthHandler implements ProviderAuthHandler {
  provider = ProviderEnum.SPOTIFY;

  constructor(
    private readonly config: ConfigService,
    private readonly browser: SpotifyBrowser,
    @InjectRepository(ConnectedAccount)
    private readonly accountRepo: Repository<ConnectedAccount>,
  ) {}

  buildAuthorizeUrl(userId: string): string {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID') ?? '';
    const redirectUri = this.config.get<string>('SPOTIFY_REDIRECT_URI') ?? '';
    const scopes = this.config.get<string>('SPOTIFY_SCOPES') || '';
    const stateSecret = this.config.get<string>('SPOTIFY_STATE_SECRET') || 'dev_secret';

    // Simple state: userId:timestamp signed
    const payload = `${userId}:${Date.now()}`;
    const sig = Buffer.from(payload + stateSecret).toString('base64url');
    const state = `${Buffer.from(payload).toString('base64url')}.${sig}`;

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopes,
      state,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<TokenResult> {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');

    const res = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      },
    );

    const data = res.data;
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      scope: data.scope,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenResult> {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');

    const res = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      },
    );

    const data = res.data;
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      scope: data.scope,
    };
  }

  async getAccessTokenForUser(userId: string): Promise<string> {
    const account = await this.accountRepo.findOneBy({ userId, provider: ProviderEnum.SPOTIFY });
    if (!account) throw new Error('No spotify account');

    const now = new Date();
    if (account.expiresAt && account.expiresAt.getTime() > now.getTime() + 60 * 1000) {
      return account.accessToken;
    }

    if (!account.refreshToken) throw new Error('No refresh token');

    const token = await this.refreshToken(account.refreshToken);
    account.accessToken = token.accessToken;
    if (token.refreshToken) account.refreshToken = token.refreshToken;
    if (token.expiresIn) {
      const exp = new Date();
      exp.setSeconds(exp.getSeconds() + token.expiresIn);
      account.expiresAt = exp;
    }
    await this.accountRepo.save(account);
    return account.accessToken;
  }
}
