import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConnectedAccount } from './entities/connected-account.entity';
import { Repository } from 'typeorm';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProviderEnum } from '../music-providers/interfaces/provider.enum';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let userRepoMock: DeepMocked<Repository<User>>;
  let accountRepoMock: DeepMocked<Repository<ConnectedAccount>>;

  // Fixtures
  const mockUser = {
    id: 'user-1',
    email: 'test@test.com',
    password: 'hashed-password',
    displayName: 'Tester',
  } as User;

  beforeEach(async () => {
    // 1. Mocks TypeORM
    userRepoMock = createMock<Repository<User>>();
    accountRepoMock = createMock<Repository<ConnectedAccount>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepoMock },
        { provide: getRepositoryToken(ConnectedAccount), useValue: accountRepoMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash the password before saving', async () => {
      // ARRANGE
      const dto: CreateUserDto = { email: 'new@test.com', password: 'plain-password', displayName: 'New' };
      
      // On espionne bcrypt pour vérifier qu'il est appelé, sans faire le vrai calcul 
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-123');

      userRepoMock.create.mockReturnValue({ ...dto, password: 'hashed-123' } as User);
      userRepoMock.save.mockResolvedValue({ id: '1', ...dto, password: 'hashed-123' } as User);

      // ACT
      const result = await service.create(dto);

      // ASSERT
      expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', 'salt');
      expect(userRepoMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'hashed-123',
        }),
      );
      expect(result.password).toBe('hashed-123');
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      // ARRANGE
      userRepoMock.findOneBy.mockResolvedValue(mockUser);

      // ACT
      const result = await service.findOne('user-1');

      // ASSERT
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      // ARRANGE
      userRepoMock.findOneBy.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should find user with specific select options', async () => {
      // ARRANGE
      userRepoMock.findOne.mockResolvedValue(mockUser);

      // ACT
      await service.findByEmail('test@test.com');

      // ASSERT
      expect(userRepoMock.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
        select: ['id', 'email', 'password', 'displayName'],
      });
    });
  });

  describe('update', () => {
    it('should hash password if provided in update DTO', async () => {
      // ARRANGE
      const updateDto: UpdateUserDto = { password: 'new-plain-password' };
      
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed');
      
      // Mock de l'update TypeORM
      userRepoMock.update.mockResolvedValue({ affected: 1 } as any);
      // Mock du findOne final
      userRepoMock.findOneBy.mockResolvedValue({ ...mockUser, password: 'new-hashed' });

      // ACT
      await service.update('user-1', updateDto);

      // ASSERT
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(userRepoMock.update).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({ password: 'new-hashed' })
      );
    });

    it('should NOT hash if password is not provided', async () => {
      // ARRANGE
      const updateDto: UpdateUserDto = { displayName: 'Updated Name' };
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      
      userRepoMock.update.mockResolvedValue({ affected: 1 } as any);
      userRepoMock.findOneBy.mockResolvedValue({ ...mockUser, displayName: 'Updated Name' });

      // ACT
      await service.update('user-1', updateDto);

      // ASSERT
      expect(hashSpy).not.toHaveBeenCalled();
      expect(userRepoMock.update).toHaveBeenCalledWith('user-1', updateDto);
    });

    it('should throw NotFoundException if update affects 0 rows', async () => {
      userRepoMock.update.mockResolvedValue({ affected: 0 } as any);

      await expect(service.update('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should return deleted: true on success', async () => {
      userRepoMock.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove('user-1');
      expect(result).toEqual({ deleted: true, id: 'user-1' });
    });

    it('should throw NotFoundException if delete affects 0 rows', async () => {
      userRepoMock.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('saveProviderConnection', () => {
    const providerData = {
      userId: 'user-1',
      provider: ProviderEnum.SPOTIFY,
      accessToken: 'token-abc',
      providerUserId: 'spotify-123',
      expiresIn: 3600
    };

    it('Scenario: Create NEW connection (Upsert)', async () => {
      // ARRANGE
      accountRepoMock.findOneBy.mockResolvedValue(null); 
      
      const newAccount = { id: 1, ...providerData } as any;
      accountRepoMock.create.mockReturnValue(newAccount);
      accountRepoMock.save.mockResolvedValue(newAccount);

      // ACT
      await service.saveProviderConnection(
        providerData.userId,
        providerData.provider,
        providerData.accessToken,
        providerData.providerUserId,
        undefined,
        providerData.expiresIn
      );

      // ASSERT
      // Vérifie qu'on a bien appelé create
      expect(accountRepoMock.create).toHaveBeenCalledWith({
        userId: providerData.userId,
        provider: providerData.provider,
        providerUserId: providerData.providerUserId
      });
      // Vérifie le calcul de l'expiration
      expect(accountRepoMock.save).toHaveBeenCalledWith(expect.objectContaining({
        accessToken: 'token-abc',
        expiresAt: expect.any(Date) // On vérifie juste qu'il y a une date
      }));
    });

    it('Scenario: Update EXISTING connection', async () => {
      // ARRANGE
      const existingAccount = { 
        id: 'acc-1', 
        userId: 'user-1', 
        provider: ProviderEnum.SPOTIFY,
        accessToken: 'old-token' 
      } as ConnectedAccount;

      // 1. On trouve le compte
      accountRepoMock.findOneBy.mockResolvedValue(existingAccount);
      accountRepoMock.save.mockResolvedValue(existingAccount);

      // ACT
      await service.saveProviderConnection(
        providerData.userId,
        providerData.provider,
        'NEW-TOKEN',
        providerData.providerUserId
      );

      // ASSERT
      expect(accountRepoMock.create).not.toHaveBeenCalled();
      
      // On vérifie que save a été appelé avec l'objet mis à jour (mutation)
      expect(accountRepoMock.save).toHaveBeenCalled();
      const savedArg = accountRepoMock.save.mock.calls[0][0];
      expect(savedArg.accessToken).toBe('NEW-TOKEN');
      expect(savedArg.id).toBe('acc-1'); // On garde le même ID
    });
  });
});