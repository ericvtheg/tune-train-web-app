import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HashPipe } from '../common/pipes/hash.pipe';
import { CryptService } from '../auth/crypt.service';

const mockUsersService = {};

const mockHashPipe = {
  transform: jest.fn((value) => Promise.resolve(value))
}

const mockCryptService = {};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
      {
        provide: UsersService,
        useValue: mockUsersService,
      },
      {
        provide: HashPipe,
        useValue: mockHashPipe
      },
      {
        provide: CryptService,
        useValue: mockCryptService,
      }
    ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
