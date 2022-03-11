import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { CreateListenDto } from './dto/create-listen.dto';
import { SongsEntity } from './entities/songs.entity';
import { ListensEntity } from './entities/listens.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(SongsEntity)
    private readonly songRepository: Repository<SongsEntity>,
    @InjectRepository(ListensEntity)
    private readonly listenRepository: Repository<ListensEntity>,
  ) {}

  async create(createSongDto: CreateSongDto) {
    const song = this.songRepository.create(createSongDto);
    return this.songRepository.save(song);
    // TODO need to handle foreign key failure and unique constraint failure
  }

  findAll() {
    return this.songRepository.find();
  }

  async findOne(id: number) {
    const song = await this.songRepository.findOne(id);
    if (!song) {
      throw new NotFoundException(`Song #${id} not found`);
    }
    return song;
  }

  /** @description returns random song that user has not listened to */
  async findRandom(userId: number) {
    return await this.songRepository
      .createQueryBuilder('songs')
      .leftJoin('songs.listens', 'listens', 'listens.userId = :userId', {
        userId,
      })
      .where('listens.id IS NULL')
      .orderBy('RANDOM()')
      .limit(1)
      .getOne();
  }

  async listen(createListenDto: CreateListenDto) {
    const listen = this.listenRepository.create(createListenDto);
    return this.listenRepository.save(listen);
  }

  async update(id: number, updateSongDto: UpdateSongDto) {
    const song = await this.songRepository.preload({ id, ...updateSongDto });
    return this.songRepository.save(song);
  }

  async remove(id: number) {
    const song = await this.songRepository.findOne(id);
    if (!song) {
      throw new NotFoundException(`Song #${id} not found`);
    }
    return this.songRepository.remove(song);
  }
}
