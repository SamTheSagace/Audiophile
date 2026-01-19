import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    this.logger.log(`Tentative de connexion pour ${email}`);

    // On cherche l'user dans la BDD
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Utilisateur non trouvé pour ${email}`);
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // On vérifie le mot de passe
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      this.logger.warn(`Mot de passe incorrect pour ${email}`);
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    // On crée le "payload"
    const payload = { email: user.email, sub: user.id };

    // On retourne le token signé
    const token = this.jwtService.sign(payload);
    this.logger.log(`Connexion réussie pour ${email} (userId=${user.id})`);

    return {
      access_token: token,
    };
  }
}
