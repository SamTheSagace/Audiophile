import { Injectable } from '@nestjs/common';
import { ProviderEnum } from '../interfaces/provider.enum';
import { ProviderAuthHandler } from './provider-auth.interface';

@Injectable()
export class ProviderRegistry {
  private handlers = new Map<ProviderEnum, ProviderAuthHandler>();

  register(handler: ProviderAuthHandler) {
    this.handlers.set(handler.provider, handler);
  }

  get(provider: ProviderEnum): ProviderAuthHandler | undefined {
    return this.handlers.get(provider);
  }

  has(provider: ProviderEnum) {
    return this.handlers.has(provider);
  }
}
