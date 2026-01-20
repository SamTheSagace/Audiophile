import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    displayName?: string;
    connectedAccounts?: Array<{
      provider: string;
      providerUserId: string;
      expiresAt?: Date;
    }>;
  };
}