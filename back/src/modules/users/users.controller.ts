import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  ParseEnumPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';

// 👇 PRÉFIXE GLOBAL : Toutes les routes ici commenceront par "/users"
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 👇 POST /users
  // Action : CRÉER (Inscription). On reçoit les données (email, pass...) dans le Body (JSON).
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 👇 GET /users
  // Action : LIRE TOUT. Récupère la liste complète des utilisateurs.
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 👇 GET /users/:id (ex: /users/a0eebc99-...)
  // Action : LIRE UN SEUL. Récupère un user spécifique via son UUID dans l'URL.
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // 👇 PATCH /users/:id
  // Action : MODIFIER PARTIELLEMENT. On change juste ce qui est envoyé (ex: juste le mot de passe).
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // 👇 DELETE /users/:id
  // Action : SUPPRIMER. Efface définitivement l'utilisateur ciblé.
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  // 👇 PUT /users/me/connections/:provider (ex: /users/me/connections/spotify)
  // Action : LIER UN COMPTE. Sauvegarde ou met à jour le token d'un service tiers (Spotify, Deezer...) pour l'utilisateur connecté.
  @Put('me/connections/:provider')
  @UseGuards(AuthGuard('jwt'))
  async connectProvider(
    @Param('provider', new ParseEnumPipe(ProviderEnum)) provider: ProviderEnum,
    @Body() body: { accessToken: string; refreshToken?: string; providerUserId: string; expiresIn?: number },
    @Req() req,
  ) {
    return this.usersService.saveProviderConnection(
      req.user.userId,
      provider,
      body.accessToken,
      body.providerUserId,
      body.refreshToken,
      body.expiresIn
    );
  }
}