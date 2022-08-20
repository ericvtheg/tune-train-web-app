import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

const mockArtistsService = {
  create: jest.fn(() => Promise.resolve({ someValue: 'something' })),
  findOne: jest.fn(() => Promise.resolve({ someValue: 'something' })),
  findAll: jest.fn(() => Promise.resolve([{ someValue: 'something' }])),
  update: jest.fn(() => Promise.resolve([{ someValue: 'something' }])),
  remove: jest.fn(() => Promise.resolve([{ someValue: 'something' }])),

};

describe('ArtistsController', () => {
  let controller: ArtistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [{
        provide: ArtistsService,
        useValue: mockArtistsService,
      }],
    }).compile();

    controller = module.get<ArtistsController>(ArtistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 404 if isArtist is false', async () => {
    controller.create({});
  });
});
