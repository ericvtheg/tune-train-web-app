import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistsEntity } from './entities/artists.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(ArtistsEntity)
    private readonly artistRepository: Repository<ArtistsEntity>,
    private readonly userService: UsersService,
  ) {}

  /**
   * @description If creating artist, artist still needs corresponding user attributes
   **/
  async create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.isArtist) {
      throw new BadRequestException(
        'isArtist must be true in order to create Artist entity',
      );
    }

    const createUserDto: CreateUserDto = {
      email: createArtistDto.email,
      password: createArtistDto.password,
      username: createArtistDto.username,
      isArtist: createArtistDto.isArtist,
    };

    let user;
    let artist = this.artistRepository.create(createArtistDto);

    try {
      user = await this.userService.create(createUserDto);
      artist = await this.artistRepository.save({ id: user.id, ...artist });
    } catch (err) {
      if (err.detail.includes('email')) {
        throw new BadRequestException('email already exists');
      } else if (err.detail.includes('username')) {
        throw new BadRequestException('username already exists');
      }
      throw err;
    } finally {
      return {
        ...user,
        ...artist,
      };
    }
  }

  findAll() {
    return this.artistRepository.find();
  }

  async findOne(id: number) {
    const artist = await this.artistRepository.findOne(id);
    if (!artist) {
      throw new NotFoundException(
        `Artist #${id} not found. Are you sure the user is an artist?`,
      );
    }
    return artist;
  }

  async update(id: number, updateArtistDto: UpdateArtistDto) {
    const artist = await this.artistRepository.preload({
      id,
      ...updateArtistDto,
    });
    return this.artistRepository.save(artist);
  }

  async remove(id: number) {
    const artist = await this.artistRepository.findOne(id);
    if (!artist) {
      throw new NotFoundException(
        `Artist #${id} not found. Are you sure the user is an artist?`,
      );
    }
    return this.artistRepository.remove(artist);
  }
}
