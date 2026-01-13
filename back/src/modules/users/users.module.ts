import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { ConnectedAccount } from './entities/connected-account.entity';
import { MusicProvidersModule } from '../music-providers/music-providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ConnectedAccount]),
    MusicProvidersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule], 
})
export class UsersModule {}