import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProviderEnum } from '../../music-providers/interfaces/provider.enum';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  originalId: string;

  @Column({
    type: 'enum',
    enum: ProviderEnum,
    default: ProviderEnum.SPOTIFY
  })
  provider: ProviderEnum;

  @Column({ type: 'jsonb', nullable: true })
  categorizedResult: any; 

  @ManyToOne(() => User, (user) => user.playlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}