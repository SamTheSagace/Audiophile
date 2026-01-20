import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    // Load the full user from DB so we can expose displayName and other fields
    const user = await this.usersService.findOneWithConnections(payload.sub);
    const connections = (user as any).connectedAccounts || [];
    return {
      userId: payload.sub,
      email: payload.email,
      displayName: (user as any).displayName,
      connectedAccounts: connections.map((c: any) => ({
        provider: c.provider,
        providerUserId: c.providerUserId,
        expiresAt: c.expiresAt,
      })),
    };
  }
}