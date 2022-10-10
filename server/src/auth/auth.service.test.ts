import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from './crypt.service';

const mockJwtService = {};
const mockUsersService = {};
const mockCryptService = {};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        {
          provide: UserService, 
          useValue: mockUsersService
        }, 
        { 
          provide: JwtService, 
          useValue: mockJwtService
        },
        { 
          provide: CryptService, 
          useValue: mockCryptService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
