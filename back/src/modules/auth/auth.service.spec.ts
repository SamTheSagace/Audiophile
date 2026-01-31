import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: DeepMocked<UsersService>;
  let jwtServiceMock: DeepMocked<JwtService>;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@audiophile.com',
    password: 'hashed-password-in-db',
  };

  beforeEach(async () => {
    usersServiceMock = createMock<UsersService>();
    jwtServiceMock = createMock<JwtService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access_token if credentials are valid', async () => {
      // ARRANGE
      usersServiceMock.findByEmail.mockResolvedValue(mockUser as any);
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      const expectedToken = 'fake-jwt-token';
      jwtServiceMock.sign.mockReturnValue(expectedToken);

      // ACT
      const result = await service.login('test@audiophile.com', 'good-password');

      // ASSERT
      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith('test@audiophile.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('good-password', mockUser.password);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
      
      expect(result).toEqual({ access_token: expectedToken });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      // ARRANGE
      usersServiceMock.findByEmail.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(
        service.login('unknown@audiophile.com', 'any-pass')
      ).rejects.toThrow(NotFoundException);
      
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      // ARRANGE
      usersServiceMock.findByEmail.mockResolvedValue(mockUser as any);
      
      // Le mot de passe est incorrect
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // ACT & ASSERT
      await expect(
        service.login('test@audiophile.com', 'wrong-password')
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});