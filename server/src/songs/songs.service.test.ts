import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestDataGenerator } from '../../test/utils/test-dataset.seed';
import { TypeOrmSQLITETestingModule } from '../../test/utils/typeorm-sqlite-testing.module';
import { FileStorageService } from '../common/services/file-storage/file-storage.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SongsEntity, UNIQUE_SONG_TITLE_ARTIST_CONSTRAINT } from './entities/songs.entity';
import { ListensEntity, UNIQUE_LISTEN_SONGID_USERID_CONSTRAINT } from './entities/listens.entity';


const downloadLink =  "downloadLink";
const mockFileStorageService = {
  upload: jest.fn(() => Promise.resolve()),
  generateDownloadLink: jest.fn(() => Promise.resolve(downloadLink)),
}

describe('SongsService', () => {
  let service: SongsService;
  let testDataGenerator: TestDataGenerator;
  const mockSongFileUpload = "multiPartUploadFile" as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [SongsService, {provide: FileStorageService, useValue: mockFileStorageService}],
    }).compile();

    service = module.get<SongsService>(SongsService);
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
    it("should create a song", async () => {
      const createSongDto = {
        artistId: testDataGenerator.ids[0],
        ...TestDataGenerator.generateSongDto(),
      };
      const song = await service.create(createSongDto, mockSongFileUpload);
      expect(song.title).toEqual(createSongDto.title);
    });

    it("should throw unique constraint error", async () => {
      const error = new Error() as any;
      error.constraint = UNIQUE_SONG_TITLE_ARTIST_CONSTRAINT;

      const mockSongsEntity = {
        create: jest.fn(() => Promise.resolve()),
        save: jest.fn(() => Promise.reject(error)),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: getRepositoryToken(SongsEntity),
            useValue: mockSongsEntity,
          },
          {
            provide: getRepositoryToken(ListensEntity),
            useValue: {},
          },
          {
            provide: FileStorageService, 
            useValue: mockFileStorageService
          },
          SongsService,
        ]
      }).compile();

      service = module.get<SongsService>(SongsService);

      const createSongDto = {
        artistId: testDataGenerator.ids[0],
        ...TestDataGenerator.generateSongDto(),
      };
      await expect(async () => service.create(createSongDto, mockSongFileUpload)).rejects.toThrowError(BadRequestException);
    });

    it("should handle fileStorageService error", async () => {
      const error = new Error() as any;
      
      const mockSongsEntity = {
        create: jest.fn(() => Promise.resolve()),
        save: jest.fn(() => Promise.resolve({ id: 1, artistId: 0})),
        delete: jest.fn(() => Promise.resolve()),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: getRepositoryToken(SongsEntity),
            useValue: mockSongsEntity,
          },
          {
            provide: getRepositoryToken(ListensEntity),
            useValue: {},
          },
          {
            provide: FileStorageService, 
            useValue: {upload: jest.fn(() => Promise.reject(error))}
          },
          SongsService, 
      ],
      }).compile();
  
      service = module.get<SongsService>(SongsService);

      const createSongDto = {
        artistId: testDataGenerator.ids[0],
        ...TestDataGenerator.generateSongDto(),
      };
      await expect(async () => service.create(createSongDto, mockSongFileUpload)).rejects.toThrowError(error);
      expect(mockSongsEntity.delete).toHaveBeenCalled();
    });
  });

  it("should findAll songs", async () => {
    expect(await service.findAll()).toHaveLength(1 + testDataGenerator. n * 10);
  });

  describe("findOne", () => {
    it("should findOne", async () => {
      const result = await service.findOne(0);
      expect(result).toBeTruthy();
      expect(result.downloadLink).toEqual(downloadLink);
    });
  
    it("should throw NotFoundException if no song found", async () => {
      const nonExistentId = 9999999999999;
      await expect(async () => service.findOne(nonExistentId)).rejects.toThrowError(NotFoundException);
    });
  });

  it("should find random song", async () => {
    const result = await service.findRandom(testDataGenerator.ids[0]);
    expect(result).toBeTruthy();
    expect(result.downloadLink).toEqual(downloadLink);
  });

  describe("listen", () => {
    it("should mark song as listened to", async () => {
      const userId = testDataGenerator.ids[0];
      const songId = 0;
      const listenDto = TestDataGenerator.generateListenDto(userId, songId);
      const result = await service.listen(listenDto);
      expect(result.userId).toEqual(userId);
      expect(result.songId).toEqual(songId);
      expect(typeof result.liked === 'boolean').toBeTruthy();
    });
  
    it("should handle unique constraint error", async () => {
      const error = new Error() as any;
      error.constraint = UNIQUE_LISTEN_SONGID_USERID_CONSTRAINT;

      const mockListensEntity = {
        create: jest.fn(() => Promise.resolve()),
        save: jest.fn(() => Promise.reject(error)),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: getRepositoryToken(SongsEntity),
            useValue: {},
          },
          {
            provide: getRepositoryToken(ListensEntity),
            useValue: mockListensEntity,
          },
          {
            provide: FileStorageService, 
            useValue: {}
          },
          SongsService, 
      ],
      }).compile();
  
      service = module.get<SongsService>(SongsService);

      await expect(async () => service.listen(TestDataGenerator.generateListenDto(0, 0))).rejects.toThrowError(BadRequestException);

    })

    it("should handle some error", async () => {
      const error = new Error();
      
      const mockListensEntity = {
        create: jest.fn(() => Promise.resolve()),
        save: jest.fn(() => Promise.reject(error)),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: getRepositoryToken(SongsEntity),
            useValue: {},
          },
          {
            provide: getRepositoryToken(ListensEntity),
            useValue: mockListensEntity,
          },
          {
            provide: FileStorageService, 
            useValue: {}
          },
          SongsService, 
      ],
      }).compile();
  
      service = module.get<SongsService>(SongsService);

      await expect(async () => service.listen(TestDataGenerator.generateListenDto(0, 0))).rejects.toThrowError(error);
    })
  });

  describe("update", () => {
    it("should update song", async () => {
      const existingSongId = 0;
      const updateSongDto = TestDataGenerator.generateSongDto();
      const result = await service.update(existingSongId, updateSongDto);
      expect(result.title).toEqual(updateSongDto.title);
    });
  
    it("should fail to update non existent song", async () => {
      const nonExistentId = 9999999999999;
      const updateSongDto = TestDataGenerator.generateSongDto();
      expect(async () => await service.update(nonExistentId, updateSongDto)).rejects.toThrowError();
    });
  })

  describe("remove", () => {
    it("should remove song", async () => {
      expect(await service.remove(0)).toBeTruthy();
    });
  
    it("should throw NotFoundException if no song to remove", async () => {
      const nonExistentId = 9999999999999;
      await expect(async () => service.remove(nonExistentId)).rejects.toThrowError(NotFoundException);
    });
  });
});
