import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsService } from './artists.service';
import { TypeOrmSQLITETestingModule } from '../../test/utils/typeorm-sqlite-testing.module';
import { TestDataGenerator } from '../../test/utils/test-dataset.seed';
import { UsersService } from '../users/users.service';

describe('ArtistsService', () => {
  let service: ArtistsService;
  let usersService: UsersService;
  let testDataGenerator: TestDataGenerator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [ArtistsService, { provide: UsersService, useValue: {} }],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
    usersService = module.get<UsersService>(UsersService);
    testDataGenerator = new TestDataGenerator(1);
    await testDataGenerator.generateData();
  });

  afterAll(async () => {
    testDataGenerator.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
  });
});
