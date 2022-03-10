import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsEntity } from './entities/songs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(SongsEntity)
    private readonly songRepository: Repository<SongsEntity>,
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
  async findRandom() {
    return this.songRepository
      .createQueryBuilder()
      .orderBy('RANDOM()')
      .limit(1)
      .getOne();
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
