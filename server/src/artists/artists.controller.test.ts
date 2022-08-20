import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { TestDataGenerator } from '../../test/utils/test-dataset.seed';
import { BadRequestException } from '@nestjs/common';
import { HashPipe } from '../common/pipes/hash.pipe';
import { CryptService } from '../auth/crypt.service';

const mockArtistsService = {
  create: jest.fn(() => Promise.resolve({ someValue: 'something' })),
  findOne: jest.fn(() => Promise.resolve({ someValue: 'something' })),
  findAll: jest.fn(() => Promise.resolve([{ someValue: 'something' }])),
  update: jest.fn(() => Promise.resolve({ someValue: 'something' })),
  remove: jest.fn(() => Promise.resolve({ someValue: 'something' })),
};

const mockHashPipe = {
  transform: jest.fn((value) => Promise.resolve(value))
}

const mockCryptService = {};

describe('ArtistsController', () => {
  let controller: ArtistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [{
        provide: ArtistsService,
        useValue: mockArtistsService,
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

    controller = module.get<ArtistsController>(ArtistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw BadRequestException if isArtist is false', async () => {
    await expect(async () => await controller.create(
      { 
        ...TestDataGenerator.generateArtistDto(), 
        isArtist: false 
      }
    )).rejects.toThrowError(BadRequestException);
  });

  it('should return mocked create value', async () => {
    const result = await controller.create({ ...TestDataGenerator.generateArtistDto() });
    expect(result).toEqual({ someValue: 'something' });
  });

  it('should return mocked findAll value', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ someValue: 'something' }]);
  });

  it('should return mocked findOne value', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({ someValue: 'something' });
  });

  it('should return mocked update value', async () => {
    const result = await controller.update(1, TestDataGenerator.generateArtistDto());
    expect(result).toEqual({ someValue: 'something' });
  });

  it('should return mocked remove value', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ someValue: 'something' });
  });
});