import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { CreateListenDto } from './dto/create-listen.dto';
import { SongsEntity } from './entities/songs.entity';
import { ListensEntity } from './entities/listens.entity';
import { Repository } from 'typeorm';
import { FileStorageService } from '../common/services/fileStorage/fileStorage.service';

export interface ISongResponse extends SongsEntity {
  /** @description link to s3 mp3 object */
  downloadLink: string;
}

// TODO: think more about what the song filename should be
function buildKey(artistId: number, songId: number): string {
  return `${artistId.toString()[0]}/${artistId}/${songId}.mp3`;
}

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(SongsEntity)
    private readonly songRepository: Repository<SongsEntity>,
    @InjectRepository(ListensEntity)
    private readonly listenRepository: Repository<ListensEntity>,
    @Inject(FileStorageService)
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(createSongDto: CreateSongDto, songFile: Express.Multer.File): Promise<SongsEntity> {
    try {
      const song = this.songRepository.create(createSongDto);
      const songEntity = await this.songRepository.save(song);

      try {
        await this.fileStorageService.upload(
          buildKey(songEntity.artistId, songEntity.id),
          songFile.buffer,
        );
      } catch (error) {
        await this.songRepository.delete(songEntity.id);
        throw error;
      }

      return songEntity;
    } catch (error) {
      if (error.constraint === 'title_artistId_unique_constraint') {
        throw new BadRequestException(
          'You have already uploaded a song with this title.',
        );
      }
      throw error;
    }
  }

  findAll(): Promise<SongsEntity[]> {
    return this.songRepository.find();
  }

  async findOne(id: number): Promise<ISongResponse> {
    const song = await this.songRepository.findOne(id);
    if (!song) {
      throw new NotFoundException(`Song #${id} not found`);
    }
    const downloadLink = await this.fileStorageService.generateDownloadLink(
      buildKey(song.artistId, song.id),
    );
    return { ...song, downloadLink };
  }

  /** @description returns random song that user has not listened to */
  async findRandom(userId: number): Promise<ISongResponse> {
    const song = await this.songRepository
      .createQueryBuilder('songs')
      .leftJoin('songs.listens', 'listens', 'listens.userId = :userId', {
        userId,
      })
      .where('listens.id IS NULL')
      .orderBy('RANDOM()')
      .limit(1)
      .getOne();
    const downloadLink = await this.fileStorageService.generateDownloadLink(
      buildKey(song.artistId, song.id),
    );
    return { ...song, downloadLink };
  }

  async listen(createListenDto: CreateListenDto): Promise<ListensEntity> {
    try {
      const listen = this.listenRepository.create(createListenDto);
      return await this.listenRepository.save(listen);
    } catch (error) {
      if (error.constraint === 'userId_songId_unique_constraint') {
        throw new BadRequestException(
          'This song has already been listened to.',
        );
      }
      throw error;
    }
  }

  async update(id: number, updateSongDto: UpdateSongDto): Promise<SongsEntity> {
    const song = await this.songRepository.preload({ id, ...updateSongDto });
    return this.songRepository.save(song);
  }

  async remove(id: number): Promise<SongsEntity> {
    const song = await this.songRepository.findOne(id);
    if (!song) {
      throw new NotFoundException(`Song #${id} not found`);
    }
    return this.songRepository.remove(song);
  }
}
