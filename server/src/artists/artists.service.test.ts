import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { TypeOrmSQLITETestingModule } from '../../test/utils/typeorm-sqlite-testing.module';
import { TestDataGenerator } from '../../test/utils/test-dataset.seed';
import { UsersService } from '../users/users.service';
import { ArtistsEntity } from './entities/artists.entity';
import { CreateArtistDto } from './dto/create-artist.dto';

describe('ArtistsService', () => {
  let service: ArtistsService;
  let usersService: UsersService;
  let testDataGenerator: TestDataGenerator;
  const userId = 10000;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [ArtistsService, { provide: UsersService, useValue: {} }],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
    usersService = module.get<UsersService>(UsersService);
    testDataGenerator = new TestDataGenerator();
    await testDataGenerator.generateData();
  });

  afterEach(async () => {
    await testDataGenerator.connection.dropDatabase();
    await testDataGenerator.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should create a user', async () => {
    const createArtistDto: CreateArtistDto = {
      stageName: 'someName',
      bio: 'someBio',
      image: 'someUrl',
      isArtist: true,
      socials: {},
      username: 'someUsername',
      email: 'someEmail',
      password: 'somePassword',
    };

    const artistsEntityMock = {
      create: jest.fn(() => createArtistDto),
      save: jest.fn(() => createArtistDto),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(ArtistsEntity),
          useFactory: () => artistsEntityMock,
        },
        ArtistsService,
        {
          provide: UsersService,
          useValue: { create: jest.fn(() => Promise.resolve({ id: userId })) },
        },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
    usersService = module.get<UsersService>(UsersService);

    const result = await service.create(createArtistDto);
    expect(result).toEqual({
      id: userId,
      ...createArtistDto,
    });
    expect(artistsEntityMock.create).toHaveBeenCalled();
    expect(artistsEntityMock.save).toHaveBeenCalled();
  });

  it('should find all artists', async () => {
    expect(await service.findAll()).toHaveLength(testDataGenerator.n);
  });

  it('should find an artist', async () => {
    expect(await service.findOne(testDataGenerator.ids[0])).toBeTruthy();
  });

  it('should delete artist', async () => {
    await service.remove(testDataGenerator.ids[0]);
    await expect(service.findOne(testDataGenerator.ids[0])).rejects.toThrowError(NotFoundException);
  });

  it('should return 404 if attempting to delete non-existent user', async () => {
    await service.remove(testDataGenerator.ids[0]);
    await expect(service.remove(testDataGenerator.ids[0])).rejects.toThrowError(NotFoundException);
  });

  it('should update artist', async () => {
    await service.update(testDataGenerator.ids[0], { stageName: 'test' });
    expect((await service.findOne(testDataGenerator.ids[0])).stageName).toEqual('test');
  });
});
