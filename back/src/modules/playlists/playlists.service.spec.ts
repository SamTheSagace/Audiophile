import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsService } from './playlists.service';
import { MusicProvidersService } from '../music-providers/music-providers.service';
import { PlaylistCategorizerService } from './playlist-categorizer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { User } from '../users/entities/user.entity';
import { ConnectedAccount } from '../users/entities/connected-account.entity';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { NormalizedPlaylist } from '../music-providers/interfaces/music-provider.interface';

// JEU DE DONNÉES (FIXTURES)
const mockUser = { id: 'user-123', email: 'test@audio.com' } as User;
const mockAccount = {
  id: 'acc-1',
  userId: 'user-123',
  provider: ProviderEnum.SPOTIFY,
  accessToken: 'fake-token',
} as ConnectedAccount;
const mockRawPlaylist: NormalizedPlaylist = {
  id: 'pl-1',
  name: 'Raw PL',
  provider: ProviderEnum.SPOTIFY,
  tracks: [],
};
const mockCategorizedResult = {
  Rock: [{ id: 't1', title: 'Rock Song' } as any],
};

describe('PlaylistsService', () => {
  let service: PlaylistsService;

  let musicProviderMock: DeepMocked<MusicProvidersService>;
  let categorizerMock: DeepMocked<PlaylistCategorizerService>;
  let playlistRepoMock: DeepMocked<Repository<Playlist>>;
  let userRepoMock: DeepMocked<Repository<User>>;
  let accountRepoMock: DeepMocked<Repository<ConnectedAccount>>;

  beforeEach(async () => {
    musicProviderMock = createMock<MusicProvidersService>();
    categorizerMock = createMock<PlaylistCategorizerService>();
    playlistRepoMock = createMock<Repository<Playlist>>();
    userRepoMock = createMock<Repository<User>>();
    accountRepoMock = createMock<Repository<ConnectedAccount>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
        { provide: MusicProvidersService, useValue: musicProviderMock },
        { provide: PlaylistCategorizerService, useValue: categorizerMock },
        { provide: getRepositoryToken(Playlist), useValue: playlistRepoMock },
        { provide: getRepositoryToken(User), useValue: userRepoMock },
        {
          provide: getRepositoryToken(ConnectedAccount),
          useValue: accountRepoMock,
        },
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
  });

  describe('findAllByProvider', () => {
    it('should return playlists if token exists', async () => {
      // ARRANGE
      accountRepoMock.findOneBy.mockResolvedValue(mockAccount);
      musicProviderMock.getUserPlaylists.mockResolvedValue([mockRawPlaylist]);

      // ACT
      const result = await service.findAllByProvider(
        ProviderEnum.SPOTIFY,
        mockUser.id,
      );

      // ASSERT
      expect(result).toHaveLength(1);
      expect(musicProviderMock.getUserPlaylists).toHaveBeenCalledWith(
        ProviderEnum.SPOTIFY,
        'fake-token',
      );
    });

    it('should throw UnauthorizedException if no account found', async () => {
      // ARRANGE
      accountRepoMock.findOneBy.mockResolvedValue(null); // Pas de compte connecté

      // ACT & ASSERT
      await expect(
        service.findAllByProvider(ProviderEnum.SPOTIFY, mockUser.id),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('categorizePlaylist', () => {
    it('should fetch, categorize, and save state to DB', async () => {
      // ARRANGE
      userRepoMock.findOneBy.mockResolvedValue(mockUser);
      accountRepoMock.findOneBy.mockResolvedValue(mockAccount);

      musicProviderMock.getPlaylistDetails.mockResolvedValue(mockRawPlaylist);

      categorizerMock.classifyByGenreFamilies.mockReturnValue(
        mockCategorizedResult,
      );

      playlistRepoMock.findOneBy.mockResolvedValue(null); // N'existe pas encore
      playlistRepoMock.create.mockImplementation((dto) => dto as Playlist);
      playlistRepoMock.save.mockResolvedValue({} as Playlist);

      // ACT
      const result = await service.categorizePlaylist(
        ProviderEnum.SPOTIFY,
        'pl-1',
        mockUser.id,
      );

      // ASSERT
      expect(result).toEqual(mockCategorizedResult);
      // Vérifie que le résultat a bien été sauvegardé en base
      expect(playlistRepoMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          originalId: 'pl-1',
          categorizedResult: mockCategorizedResult,
        }),
      );
    });
  });

  describe('exportPlaylistToProvider', () => {
    let storedPlaylist: Playlist;

    beforeEach(() => {
      jest.clearAllMocks();

      accountRepoMock.findOne.mockResolvedValue(mockAccount);
      musicProviderMock.getOwnerId.mockResolvedValue('spotify-user-id');
      musicProviderMock.createPlaylist.mockResolvedValue('new-playlist-id');

      storedPlaylist = {
        id: '1',
        originalId: 'source-pl-1',
        userId: mockUser.id,
        categorizedResult: {
          'Rock': [{ id: 't1', title: 'Song 1' }, { id: 't2', title: 'Song 2' }],
          'Jazz': [{ id: 't3', title: 'Song 3' }]
        }
      } as unknown as Playlist;
    });

    it('Scenario A: Full Export (Automatic Mode)', async () => {
      // ARRANGE
      playlistRepoMock.findOne.mockResolvedValue(storedPlaylist);

      // ACT
      const result = await service.exportPlaylistToProvider(
        ProviderEnum.SPOTIFY,
        mockUser.id,
        'source-pl-1',
        'Rock'
      );

      // ASSERT
      expect(result.success).toBe(true);
      expect(musicProviderMock.createPlaylist).toHaveBeenCalled();
      
      // On vérifie que toutes les tracks de Rock (t1 et t2) sont envoyées
      expect(musicProviderMock.addTracksToPlaylist).toHaveBeenCalledWith(
        ProviderEnum.SPOTIFY,
        'new-playlist-id',
        ['t1', 't2'], 
        expect.anything()
      );

      // Vérifie qu'on n'a pas touché à la BDD
      expect(playlistRepoMock.save).not.toHaveBeenCalled();
    });

    it('Scenario B: Manual Mode (User selected specific tracks)', async () => {
      // ARRANGE
      playlistRepoMock.findOne.mockResolvedValue(storedPlaylist);
      const selectedTracks = ['t1'];

      // ACT
      await service.exportPlaylistToProvider(
        ProviderEnum.SPOTIFY,
        mockUser.id,
        'source-pl-1',
        'Rock',
        selectedTracks
      );

      // ASSERT
      expect(playlistRepoMock.save).toHaveBeenCalled();
      
      const savedEntity = playlistRepoMock.save.mock.calls[0][0];

      expect(savedEntity.categorizedResult!['Rock']).toHaveLength(1);
      expect(savedEntity.categorizedResult!['Rock']![0].id).toBe('t1');

      expect(musicProviderMock.addTracksToPlaylist).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        ['t1'],
        expect.anything()
      );
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // ARRANGE
      playlistRepoMock.findOne.mockResolvedValue(storedPlaylist);

      // ACT & ASSERT
      // 'Techno' doit déclencher l'erreur.
      await expect(service.exportPlaylistToProvider(
        ProviderEnum.SPOTIFY, mockUser.id, 'source-pl-1', 'Techno'
      )).rejects.toThrow(NotFoundException);
    });
  });
});
