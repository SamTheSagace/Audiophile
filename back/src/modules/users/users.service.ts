import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConnectedAccount } from './entities/connected-account.entity';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ConnectedAccount)
    private readonly accountRepository: Repository<ConnectedAccount>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findOneWithConnections(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['connectedAccounts'],
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'displayName'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const result = await this.userRepository.update(id, updateUserDto);

    if (result.affected === 0) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User #${id} not found`);
    }
    
    return { deleted: true, id };
  }

  
  //Sauvegarde ou met à jour la connexion à un provider externe (Spotify, Deezer...)
  async saveProviderConnection(userId: string, provider: ProviderEnum, accessToken: string, providerUserId: string, refreshToken?: string, expiresIn?: number) {
    //On cherche si ce lien existe déjà
    let account = await this.accountRepository.findOneBy({
      userId,
      provider
    });

    if (!account) {
      // Création
      account = this.accountRepository.create({
        userId,
        provider,
        providerUserId
      });
    }

    // 2. Mise à jour des tokens
    account.accessToken = accessToken;
    account.refreshToken = refreshToken;
    
    // Calcul de la date d'expiration (si fournie)
    if (expiresIn) {
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
      account.expiresAt = expirationDate;
    }

    return this.accountRepository.save(account);
  }
}