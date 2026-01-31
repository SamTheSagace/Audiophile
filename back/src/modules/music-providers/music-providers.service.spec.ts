import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { createMock, DeepMocked } from '@golevelup/ts-jest'; // L'outil magique
import { MusicProvidersService } from './music-providers.service';
import { SpotifyAdapter } from './adapters/spotify/spotify.adapter';
import { NormalizedPlaylist } from './interfaces/music-provider.interface';
import { ProviderEnum } from './interfaces/provider.enum';

describe('MusicProvidersService', () => {
  let service: MusicProvidersService;
  let spotifyAdapterMock: DeepMocked<SpotifyAdapter>;

  beforeEach(async () => {
    spotifyAdapterMock = createMock<SpotifyAdapter>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MusicProvidersService,
        { provide: SpotifyAdapter, useValue: spotifyAdapterMock },
      ],
    }).compile();

    service = module.get<MusicProvidersService>(MusicProvidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //TEST DU PATTERN STRATEGY
  
  describe('getUserPlaylists', () => {
    it('should delegate the call to SpotifyAdapter when provider is SPOTIFY', async () => {
      // ARRANGE
      const mockToken = 'fake-token';
      const expectedPlaylists: NormalizedPlaylist[] = [
        { id: '1', name: 'Test PL', provider: ProviderEnum.SPOTIFY, tracks: [] }
      ];
      
      spotifyAdapterMock.getUserPlaylists.mockResolvedValue(expectedPlaylists);

      // ACT
      const result = await service.getUserPlaylists(ProviderEnum.SPOTIFY, mockToken);

      // ASSERT
      expect(result).toBe(expectedPlaylists);
      expect(spotifyAdapterMock.getUserPlaylists).toHaveBeenCalledWith(mockToken);
    });

    it('should throw BadRequestException for an unsupported provider', async () => {
      // ARRANGE
      const unknownProvider = 'TIDAL' as ProviderEnum;

      // ACT & ASSERT
      await expect(
        service.getUserPlaylists(unknownProvider, 'token')
      ).rejects.toThrow(BadRequestException);
    });
  });

  //TEST DE DELEGATION DE PARAMETRES
  
  describe('createPlaylist', () => {
    it('should pass all arguments correctly to the adapter', async () => {
      // ARRANGE
      const name = 'New Mix';
      const desc = 'Cool vibes';
      const token = 'xyz';
      const userId = 'user-123';
      
      spotifyAdapterMock.createPlaylist.mockResolvedValue('new-playlist-id');

      // ACT
      await service.createPlaylist(ProviderEnum.SPOTIFY, name, desc, token, userId);

      // ASSERT
      expect(spotifyAdapterMock.createPlaylist).toHaveBeenCalledWith(
        name,
        desc,
        token,
        userId
      );
    });
  });

  // TEST DE GESTION D'ERREUR INTERNE

  describe('Handling Adapter Errors', () => {
    it('should propagate errors thrown by the adapter', async () => {
      spotifyAdapterMock.getOwnerId.mockRejectedValue(new Error('Invalid Token'));

      await expect(
        service.getOwnerId(ProviderEnum.SPOTIFY, 'bad-token')
      ).rejects.toThrow('Invalid Token');
    });
  });
});