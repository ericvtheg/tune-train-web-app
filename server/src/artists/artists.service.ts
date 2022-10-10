import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistsEntity } from './entities/artists.entity';
import { UsersEntity } from '../user/entities/users.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(ArtistsEntity)
    private readonly artistRepository: Repository<ArtistsEntity>,
    private readonly userService: any,
  ) {}

  /**
   * @description If creating artist, artist still needs corresponding user attributes
   **/
  async create(createArtistDto: CreateArtistDto): Promise<ArtistsEntity> {
    const createUserDto: CreateUserDto = {
      email: createArtistDto.email,
      password: createArtistDto.password,
      username: createArtistDto.username,
      isArtist: createArtistDto.isArtist,
    };

    const user: UsersEntity = await this.userService.create(createUserDto);
    let artist = this.artistRepository.create(createArtistDto);
    artist = await this.artistRepository.save({ id: user.id, ...artist });

    return {
      ...user,
      ...artist,
    };
  }

  findAll(): Promise<ArtistsEntity[]> {
    return this.artistRepository.find();
  }

  async findOne(id: number): Promise<ArtistsEntity> {
    const artist = await this.artistRepository.findOne(id);
    if (!artist) {
      throw new NotFoundException(
        `Artist #${id} not found. Are you sure the user is an artist?`,
      );
    }
    return artist;
  }

  async update(id: number, updateArtistDto: UpdateArtistDto): Promise<ArtistsEntity> {
    const artist = await this.artistRepository.preload({
      id,
      ...updateArtistDto,
    });
    return this.artistRepository.save(artist);
  }

  async remove(id: number): Promise<ArtistsEntity> {
    const artist = await this.artistRepository.findOne(id);
    if (!artist) {
      throw new NotFoundException(
        `Artist #${id} not found. Are you sure the user is an artist?`,
      );
    }
    return this.artistRepository.remove(artist);
  }
}
