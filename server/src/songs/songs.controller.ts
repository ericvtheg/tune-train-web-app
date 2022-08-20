import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Request,
  BadRequestException,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SongsService, ISongResponse } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SongsEntity } from './entities/songs.entity';
import { ListensEntity } from './entities/listens.entity';
import { IUserRequest } from '../common/types';
import { SetRequestTimeout } from '../common/decorators/timeout.decorator';
import { Public } from '../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @SetRequestTimeout(6000)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createSongDto: CreateSongDto,
      @UploadedFile() songFile: Express.Multer.File,
      @Request() req: IUserRequest,
  ): Promise<SongsEntity> {
    // TODO: handle validating file type as mp3
    // TODO: need to handle foreign key failure and unique constraint failure

    // TODO: this should be a built into a decorator guard role thing
    const { isArtist } = req.user;
    if (!isArtist) {
      throw new BadRequestException('You must be an artist to upload songs.');
    }

    const userId = req.user.id;
    return this.songsService.create({ ...createSongDto, artistId: userId }, songFile);
  }

  @Get()
  findAll(): Promise<SongsEntity[]> {
    return this.songsService.findAll();
  }

  @Public()
  @Get('random')
  findRandom(@Request() req: IUserRequest): Promise<ISongResponse> {
    const userId = req.user.id;
    return this.songsService.findRandom(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ISongResponse> {
    return this.songsService.findOne(id);
  }

  @Put('listen/:id')
  listen(
    @Param('id', ParseIntPipe) id: number,
      @Query('liked', ParseBoolPipe) liked: boolean,
      @Request() req: IUserRequest,
  ): Promise<ListensEntity> {
    const userId = req.user.id;
    return this.songsService.listen({ songId: id, userId, liked });
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSongDto: UpdateSongDto): Promise<SongsEntity> {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<SongsEntity> {
    return this.songsService.remove(id);
  }
}
