import { ProviderEnum } from '../interfaces/provider.enum';

export type TokenResult = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  scope?: string;
};

export interface ProviderAuthHandler {
  provider: ProviderEnum;
  buildAuthorizeUrl(userId: string): Promise<string> | string;
  exchangeCode(code: string, redirectUri: string): Promise<TokenResult>;
  refreshToken(refreshToken: string): Promise<TokenResult>;
  getAccessTokenForUser?(userId: string): Promise<string>;
}
