import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import axios from 'axios';
import { MusicProvidersService } from './music-providers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedAccount } from '../users/entities/connected-account.entity';
import { ProviderEnum } from './interfaces/provider.enum';
import { createHmac } from 'crypto';

function signPayload(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function makeState(userId: string, secret: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({ userId, iat: now });
  const token = Buffer.from(payload).toString('base64url');
  const sig = signPayload(token, secret);
  return `${token}.${sig}`;
}

function verifyState(state: string, secret: string, maxAgeSeconds = 600) {
  if (!state) throw new Error('Missing state');
  const parts = state.split('.');
  if (parts.length !== 2) throw new Error('Invalid state format');
  const [token, sig] = parts;
  const expected = signPayload(token, secret);
  if (!(sig === expected)) throw new Error('Invalid state signature');
  const payload = JSON.parse(
    Buffer.from(token, 'base64url').toString('utf8'),
  ) as { userId: string; iat: number };
  const now = Math.floor(Date.now() / 1000);
  if (payload.iat + maxAgeSeconds < now) throw new Error('State expired');
  return payload;
}

@Controller('auth/spotify')
export class SpotifyAuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly musicProvidersService: MusicProvidersService,
    @InjectRepository(ConnectedAccount)
    private readonly accountRepo: Repository<ConnectedAccount>,
  ) {}

  @Get('login')
  @UseGuards(AuthGuard('jwt'))
  login(@Req() req: express.Request, @Res() res: express.Response) {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const redirectUri = this.config.get<string>('SPOTIFY_REDIRECT_URI');
    const scopes = this.config.get<string>('SPOTIFY_SCOPES') || '';
    const stateSecret = this.config.get<string>('SPOTIFY_STATE_SECRET') || 'dev_secret';

    const user = req.user as any;
    const state = makeState(user.userId, stateSecret);

    const params = new URLSearchParams({
      client_id: clientId ?? '',
      response_type: 'code',
      redirect_uri: redirectUri ?? '',
      scope: scopes,
      state,
    });

    const url = `https://accounts.spotify.com/authorize?${params.toString()}`;
    return res.redirect(url);
  }

  // SPA-friendly endpoint: returns the authorize URL as JSON (authenticated)
  @Post('login-url')
  @UseGuards(AuthGuard('jwt'))
  async getLoginUrl(@Req() req: express.Request) {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const redirectUri = this.config.get<string>('SPOTIFY_REDIRECT_URI');
    const scopes = this.config.get<string>('SPOTIFY_SCOPES') || '';
    const stateSecret = this.config.get<string>('SPOTIFY_STATE_SECRET') || 'dev_secret';

    const user = req.user as any;
    const state = makeState(user.userId, stateSecret);

    const params = new URLSearchParams({
      client_id: clientId ?? '',
      response_type: 'code',
      redirect_uri: redirectUri ?? '',
      scope: scopes,
      state,
    });

    const url = `https://accounts.spotify.com/authorize?${params.toString()}`;
    return { url };
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: express.Response,
  ) {
    const clientId = this.config.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.config.get<string>('SPOTIFY_CLIENT_SECRET');
    const redirectUri = this.config.get<string>('SPOTIFY_REDIRECT_URI') || '';
    const frontend = this.config.get<string>('FRONTEND_URL') || '/';
    const stateSecret = this.config.get<string>('SPOTIFY_STATE_SECRET') || 'dev_secret';

    if (error) {
      return res.redirect(
        `${frontend}/?spotify_error=${encodeURIComponent(error)}`,
      );
    }

    if (!code) {
      return res.redirect(`${frontend}/?spotify_error=missing_code`);
    }

    // verify state
    let payload: { userId: string; iat: number };
    try {
      payload = verifyState(state, stateSecret);
    } catch (e) {
      throw new HttpException('Invalid state', HttpStatus.BAD_REQUEST);
    }

    try {
      const tokenRes = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          },
        },
      );

      const { access_token, refresh_token, expires_in } = tokenRes.data;

      // get provider user id
      const providerUserId = await this.musicProvidersService.getOwnerId(
        ProviderEnum.SPOTIFY,
        access_token,
      );

      // save connection (create or update connected_accounts)
      let account = await this.accountRepo.findOneBy({ userId: payload.userId, provider: ProviderEnum.SPOTIFY });
      if (!account) {
        account = this.accountRepo.create({ userId: payload.userId, provider: ProviderEnum.SPOTIFY, providerUserId });
      }
      account.accessToken = access_token;
      account.refreshToken = refresh_token;
      if (expires_in) {
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expires_in);
        account.expiresAt = expirationDate;
      }
      await this.accountRepo.save(account);

      // Build a safe redirect target based on FRONTEND_URL
      let redirectTarget: string;
      try {
        if (frontend.startsWith('http')) {
          redirectTarget = new URL('/profile?spotify=linked', frontend).toString();
        } else if (frontend.startsWith('/')) {
          redirectTarget = `${frontend.replace(/\/$/, '')}/profile?spotify=linked`;
        } else {
          // Fallback: assume hostname only, prefix with http://
          redirectTarget = `http://${frontend.replace(/\/$/, '')}/profile?spotify=linked`;
        }
      } catch (e) {
        redirectTarget = '/profile?spotify=linked';
      }

      return res.redirect(redirectTarget);
    } catch (err) {
      console.error(
        'Spotify callback error',
        err.response?.data || err.message,
      );
      // error redirect
      let errorTarget: string;
      try {
        if (frontend.startsWith('http')) {
          errorTarget = new URL('/?spotify_error=token_exchange_failed', frontend).toString();
        } else if (frontend.startsWith('/')) {
          errorTarget = `${frontend.replace(/\/$/, '')}/?spotify_error=token_exchange_failed`;
        } else {
          errorTarget = `http://${frontend.replace(/\/$/, '')}/?spotify_error=token_exchange_failed`;
        }
      } catch (e) {
        errorTarget = '/?spotify_error=token_exchange_failed';
      }

      return res.redirect(errorTarget);
    }
  }
}
