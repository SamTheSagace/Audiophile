import { Playlist } from 'src/modules/playlists/entities/playlist.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ConnectedAccount } from './connected-account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  displayName: string;

  @Column({ select: false }) //invisible par défault lors des requêtes
  password: string;

  @OneToMany(() => ConnectedAccount, (account) => account.user, { cascade: true })
  connectedAccounts: ConnectedAccount[];
  
  @OneToMany(() => Playlist, (playlist) => playlist.user, { cascade: true })
  playlists: Playlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}