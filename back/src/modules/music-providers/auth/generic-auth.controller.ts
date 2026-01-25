import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProviderRegistry } from './provider-registry.service';
import { ProviderEnum } from '../interfaces/provider.enum';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedAccount } from '../../users/entities/connected-account.entity';

@Controller('auth')
export class GenericAuthController {
  constructor(
    private readonly registry: ProviderRegistry,
    @InjectRepository(ConnectedAccount)
    private readonly accountRepo: Repository<ConnectedAccount>,
  ) {}

  @Post(':provider/login-url')
  @UseGuards(AuthGuard('jwt'))
  async getLoginUrl(
    @Param('provider') provider: ProviderEnum,
    @Req() req: express.Request,
  ) {
    if (!this.registry.has(provider))
      throw new HttpException('Provider not supported', HttpStatus.BAD_REQUEST);
    const handler = this.registry.get(provider)!;
    const user = req.user as any;
    const url = await handler.buildAuthorizeUrl(user.userId);
    return { url };
  }

  @Get(':provider/login')
  @UseGuards(AuthGuard('jwt'))
  async loginRedirect(
    @Param('provider') provider: ProviderEnum,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    if (!this.registry.has(provider))
      throw new HttpException('Provider not supported', HttpStatus.BAD_REQUEST);
    const handler = this.registry.get(provider)!;
    const user = req.user as any;
    const url = await handler.buildAuthorizeUrl(user.userId);
    return res.redirect(url);
  }

  @Get(':provider/callback')
  async callback(
    @Param('provider') provider: ProviderEnum,
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: express.Response,
  ) {
    const frontend = process.env.FRONTEND_URL || '/';
    if (error) return res.redirect(`${frontend}/?${provider}=error`);
    if (!this.registry.has(provider))
      throw new HttpException('Provider not supported', HttpStatus.BAD_REQUEST);
    const handler = this.registry.get(provider)!;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || '';

    if (!code) return res.redirect(`${frontend}/?${provider}=missing_code`);

    try {
      const token = await handler.exchangeCode(code, redirectUri);

      // Attempt to get provider user id via handler/browser if available
      let providerUserId = '';
      try {
        // some handlers may expose getOwnerId via other means; try to read via handler.getAccessTokenForUser fallback not possible here
      } catch {}

      // Persist connected account: userId must be encoded in state or handled by provider-specific state mechanism.
      // Here we try to extract userId from state if possible (simple format: base.payload.sig)
      let userId = '';
      try {
        const parts = state.split('.');
        const token = parts[0];
        const payload = Buffer.from(token, 'base64url').toString('utf8');
        userId = payload.split(':')[0];
      } catch (e) {
        // can't determine userId
      }

      if (!userId) {
        // we cannot save without user context; redirect with error
        return res.redirect(`${frontend}/?${provider}=no_user`);
      }

      let account = await this.accountRepo.findOneBy({ userId, provider });
      if (!account) {
        account = this.accountRepo.create({ userId, provider, providerUserId });
      }
      account.accessToken = token.accessToken;
      account.refreshToken = token.refreshToken;
      if (token.expiresIn) {
        const exp = new Date();
        exp.setSeconds(exp.getSeconds() + token.expiresIn);
        account.expiresAt = exp;
      }
      await this.accountRepo.save(account);

      return res.redirect(`${frontend}/profile?${provider}=linked`);
    } catch (err) {
      console.error('Generic callback error', err);
      return res.redirect(`${frontend}/?${provider}=token_exchange_failed`);
    }
  }
}
