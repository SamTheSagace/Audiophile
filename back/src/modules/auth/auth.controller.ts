import { Controller, Post, Body, UseGuards, Get, Req, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  /**
   * DELETE /auth/providers/:provider
   * Déconnecte un provider externe (Spotify, etc.) en supprimant la connexion de la BDD
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete('providers/:provider')
  async disconnectProvider(
    @Param('provider') provider: ProviderEnum,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.disconnectProvider(req.user.userId, provider);
  }
}
