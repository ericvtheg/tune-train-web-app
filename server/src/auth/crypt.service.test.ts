import { Test, TestingModule } from '@nestjs/testing';
import { CryptService } from './crypt.service';

describe('CryptService', () => {
  let service: CryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptService],
    }).compile();

    service = module.get<CryptService>(CryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash and validate password', async () => {
    const password = "password";
    const hashedPassword = await service.hashPassword(password);
    expect(hashedPassword).not.toEqual(password);
    expect(await service.validatePassword(password, hashedPassword)).toEqual(true);
  });
});
