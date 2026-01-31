import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsController } from './playlists.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AuthGuard } from '@nestjs/passport';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';
import { PlaylistsService } from './playlists.service';

describe('PlaylistsController', () => {
  let controller: PlaylistsController;
  let playlistsServiceMock: DeepMocked<PlaylistsService>;

  const mockUserReq = {
    user: { userId: 'user-123', email: 'test@audiophile.com' },
  } as any;

  beforeEach(async () => {
    playlistsServiceMock = createMock<PlaylistsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistsController],
      providers: [
        {
          provide: PlaylistsService,
          useValue: playlistsServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PlaylistsController>(PlaylistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAllByProvider with correct params', async () => {
      // ARRANGE
      const provider = ProviderEnum.SPOTIFY;
      const expectedResult = [];
      playlistsServiceMock.findAllByProvider.mockResolvedValue(expectedResult);

      // ACT
      const result = await controller.findAll(provider, mockUserReq);

      // ASSERT
      expect(result).toBe(expectedResult);
      expect(playlistsServiceMock.findAllByProvider).toHaveBeenCalledWith(
        provider,
        mockUserReq.user.userId,
      );
    });
  });

  describe('categorize', () => {
    it('should call service.categorizePlaylist', async () => {
      // ARRANGE
      const provider = ProviderEnum.DEEZER;
      const playlistId = 'pl-456';
      
      // ACT
      await controller.categorize(provider, playlistId, mockUserReq);

      // ASSERT
      expect(playlistsServiceMock.categorizePlaylist).toHaveBeenCalledWith(
        provider,
        playlistId,
        mockUserReq.user.userId,
      );
    });
  });

  describe('export', () => {
    it('should extract body params and call service.exportPlaylistToProvider', async () => {
      // ARRANGE
      const provider = ProviderEnum.SPOTIFY;
      const body = {
        sourcePlaylistId: 'source-1',
        categoryName: 'Rock',
        trackIds: ['t1', 't2'],
        customName: 'Mon Super Mix',
      };

      // ACT
      await controller.export(provider, body, mockUserReq);

      // ASSERT
      expect(playlistsServiceMock.exportPlaylistToProvider).toHaveBeenCalledWith(
        provider,
        mockUserReq.user.userId,
        body.sourcePlaylistId,
        body.categoryName,
        body.trackIds,
        body.customName,
      );
    });

    it('should handle optional params (undefined trackIds/customName)', async () => {
      // ARRANGE
      const body = {
        sourcePlaylistId: 'source-1',
        categoryName: 'Jazz',
      };

      // ACT
      await controller.export(ProviderEnum.SPOTIFY, body, mockUserReq);

      // ASSERT
      expect(playlistsServiceMock.exportPlaylistToProvider).toHaveBeenCalledWith(
        ProviderEnum.SPOTIFY,
        mockUserReq.user.userId,
        body.sourcePlaylistId,
        body.categoryName,
        undefined,
        undefined,
      );
    });
  });
});