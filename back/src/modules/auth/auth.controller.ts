import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
