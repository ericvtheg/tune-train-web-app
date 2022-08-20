import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { TestDataGenerator } from '../../test/utils/test-dataset.seed';
import { TypeOrmSQLITETestingModule } from '../../test/utils/typeorm-sqlite-testing.module';
import { UNIQUE_USER_EMAIL_CONSTRAINT, UNIQUE_USER_USERNAME_CONSTRAINT, UsersEntity } from './entities/users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let testDataGenerator: TestDataGenerator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    testDataGenerator = new TestDataGenerator();
    await testDataGenerator.generateData();
  });

  afterEach(async () => {
    await testDataGenerator.connection.dropDatabase();
    await testDataGenerator.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it('should create a user', async () => {
      const result = await service.create(TestDataGenerator.generateUserDto());
      expect(result.id).toBeDefined();
    });
  
    it("should fail to create user for already existing email", async () => {
      const error = new Error() as any;
      error.constraint = UNIQUE_USER_EMAIL_CONSTRAINT;
  
      const mockUsersEntity = {
        create: jest.fn(() => Promise.resolve()),
        save: jest.fn(() => Promise.reject(error)),
      }
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: getRepositoryToken(UsersEntity),
            useFactory: () => mockUsersEntity,
          },
            UsersService
        ],
      }).compile();
  
      service = module.get<UsersService>(UsersService);
  
      const userDto = TestDataGenerator.generateUserDto();
      await expect(service.create(userDto)).rejects.toThrowError(BadRequestException);
    });
  
    it("should fail to create user for already existing username", async () => {
      const error = new Error() as any;
      error.constraint = UNIQUE_USER_USERNAME_CONSTRAINT;
  
      const mockUsersEntity = {
        create: jest.fn(() => Promise.resolve()),
        save: jest.fn(() => Promise.reject(error)),
      }
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: getRepositoryToken(UsersEntity),
            useFactory: () => mockUsersEntity,
          },
          UsersService
        ],
      }).compile();
  
      service = module.get<UsersService>(UsersService);
      
      const userDto = TestDataGenerator.generateUserDto();
      await expect(async () => service.create(userDto)).rejects.toThrowError(BadRequestException);
    });
  
    it("should throw some random error", async () => {
      const mockUsersEntity = {
        create: jest.fn(() => { throw new Error() }),
      }
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: getRepositoryToken(UsersEntity),
            useFactory: () => mockUsersEntity,
          },
          UsersService
        ],
      }).compile();
  
      service = module.get<UsersService>(UsersService);
  
      const userDto = TestDataGenerator.generateUserDto();
      await expect(async () => service.create(userDto)).rejects.toThrowError();
    });
  });

  it("should findAll", async () => {
    expect(await service.findAll()).toHaveLength(testDataGenerator.n);
  });

  it("should findOne", async () => {
    expect(await service.findOne(testDataGenerator.ids[0])).toBeTruthy();
  });

  it("should throw NotFoundException if no user found", async () => {
    const nonExistentId = 9999999999999;
    await expect(async () => service.findOne(nonExistentId)).rejects.toThrowError(NotFoundException);
  });

  it("should findOneUsingEmail", async () => {
    const result = await service.create(TestDataGenerator.generateUserDto());
    expect(await service.findOneUsingEmail(result.email)).toBeTruthy();
  });

  it("should throw NotFoundException if no user found", async () => {
    const { email } = TestDataGenerator.generateUserDto();
    await expect(async () => service.findOneUsingEmail(email)).rejects.toThrowError(NotFoundException);
  });

  it("should update user", async () => {
    const existingUserId = testDataGenerator.ids[0];
    const updateUserDto = TestDataGenerator.generateUserDto();
    const result = await service.update(existingUserId, updateUserDto);
    expect(result).toEqual(expect.objectContaining(updateUserDto));
  });

  it("should fail to update non existent user", async () => {
    const nonExistentId = 9999999999999;
    const updateUserDto = TestDataGenerator.generateUserDto();
    expect(async () => await service.update(nonExistentId, updateUserDto)).rejects.toThrowError();
  });

  it("should remove", async () => {
    expect(await service.remove(testDataGenerator.ids[0])).toBeTruthy();
  });

  it("should throw NotFoundException if no user found", async () => {
    const nonExistentId = 9999999999999;
    await expect(async () => service.remove(nonExistentId)).rejects.toThrowError(NotFoundException);
  });
});
