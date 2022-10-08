import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashPipe } from '../common/pipes/hash.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersEntity } from './entities/users.entity';
import { IUserRequest } from '../common/types';
import { Public } from '../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body(HashPipe) createUserDto: CreateUserDto): Promise<UsersEntity> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<UsersEntity[]> {
    // this should be an admin endpoint
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UsersEntity> {
    return this.usersService.findOne(id);
  }

  @Patch()
  update(@Request() req: IUserRequest, @Body() updateUserDto: UpdateUserDto): Promise<UsersEntity> {
    const id = req.user.id;
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  remove(@Request() req: IUserRequest): Promise<UsersEntity> {
    const id = req.user.id;
    return this.usersService.remove(id);
  }
}
