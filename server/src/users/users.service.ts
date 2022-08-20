import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity, UNIQUE_USER_EMAIL_CONSTRAINT, UNIQUE_USER_USERNAME_CONSTRAINT } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.constraint === UNIQUE_USER_EMAIL_CONSTRAINT) {
        throw new BadRequestException('email already exists');
      } else if (error.constraint === UNIQUE_USER_USERNAME_CONSTRAINT) {
        throw new BadRequestException('username already exists');
      }
      throw error;
    }
  }

  findAll(): Promise<UsersEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UsersEntity> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findOneUsingEmail(email: string): Promise<UsersEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UsersEntity> {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<UsersEntity> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.remove(user);
  }
}
