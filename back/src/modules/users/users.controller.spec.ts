import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MusicProvidersService } from '../music-providers/music-providers.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: DeepMocked<UsersService>;
  let musicProvidersServiceMock: DeepMocked<MusicProvidersService>;

  beforeEach(async () => {
    // 1. Création des Mocks
    usersServiceMock = createMock<UsersService>();
    musicProvidersServiceMock = createMock<MusicProvidersService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: MusicProvidersService, useValue: musicProvidersServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TESTS CRUD STANDARDS

  describe('create', () => {
    it('should call service.create with correct DTO', async () => {
      const dto: CreateUserDto = { email: 'a@a.com', password: '123', displayName: 'A' };
      await controller.create(dto);
      expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: '1' }];
      usersServiceMock.findAll.mockResolvedValue(result as any);
      
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct ID', async () => {
      const id = 'uuid-123';
      await controller.findOne(id);
      expect(usersServiceMock.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      const id = 'uuid-123';
      const dto: UpdateUserDto = { displayName: 'New Name' };
      
      await controller.update(id, dto);
      expect(usersServiceMock.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      const id = 'uuid-123';
      await controller.remove(id);
      expect(usersServiceMock.remove).toHaveBeenCalledWith(id);
    });
  });

  // TEST DE LA ROUTE COMPLEXE (ORCHESTRATION)

  describe('connectProvider', () => {
    it('should get owner ID from provider then save connection', async () => {
      // ARRANGE
      const provider = ProviderEnum.SPOTIFY;
      const body = { 
        accessToken: 'fake-token', 
        refreshToken: 'fake-refresh', 
        expiresIn: 3600 
      };
      
      // Simulation de la requête enrichie par le AuthGuard (JWT Strategy)
      const mockRequest = {
        user: { userId: 'user-uuid-123' }
      };

      // Mock de l'appel externe (MusicProvider)
      musicProvidersServiceMock.getOwnerId.mockResolvedValue('spotify-user-abc');

      // Mock de la sauvegarde (UsersService)
      const expectedResult = { id: 1, ...body } as any;
      usersServiceMock.saveProviderConnection.mockResolvedValue(expectedResult);

      // ACT
      const result = await controller.connectProvider(
        provider,
        body,
        mockRequest
      );

      // ASSERT
      expect(result).toBe(expectedResult);

      // Vérifie l'enchaînement logique :
      // On récupère d'abord l'ID externe
      expect(musicProvidersServiceMock.getOwnerId).toHaveBeenCalledWith(
        provider, 
        body.accessToken
      );

      // On sauvegarde le tout
      expect(usersServiceMock.saveProviderConnection).toHaveBeenCalledWith(
        mockRequest.user.userId, 
        provider,
        body.accessToken,
        'spotify-user-abc', 
        body.refreshToken,
        body.expiresIn
      );
    });
  });
});