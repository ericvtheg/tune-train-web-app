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
import { SongsService , ISongResponse } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SongsEntity } from './entities/songs.entity';
import { ListensEntity } from './entities/listens.entity';
import { IUserRequest } from '../common/types';

@UseGuards(JwtAuthGuard)
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createSongDto: CreateSongDto,
      @UploadedFile() songFile: Express.Multer.File,
      @Request() req: IUserRequest,
  ): Promise<SongsEntity> {
    // TODO: handle validating file type as mp3
    // TODO: need to handle foreign key failure and unique constraint failure
    // TODO: remove fileName?
    // TODO: increase timeout for this endpoint?

    // this should be a built into a decorator guard role thing
    const isArtist = req.user.isArtist;
    if (!isArtist) {
      throw new BadRequestException('You must be an artist to upload songs.');
    }

    const userId = req.user.id;
    return this.songsService.create({ ...createSongDto, artistId: userId }, songFile);
  }

  @Get()
  findAll(): Promise<SongsEntity[]> {
    // this should be an admin endpoint
    return this.songsService.findAll();
  }

  // should I make this endpoint public?
  @Get('random')
  findRandom(@Request() req: IUserRequest): Promise<ISongResponse> {
    // should pull user off authentication token
    const userId = req.user.id;
    return this.songsService.findRandom(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ISongResponse> {
    return this.songsService.findOne(id);
  }

  // TODO: also need to handle unique constraint error
  // this should maybe return the result of fetching a new random song as well
  @Put('listen/:id')
  listen(
    @Param('id', ParseIntPipe) id: number,
      @Query('liked', ParseBoolPipe) liked: boolean,
      @Request() req: IUserRequest,
  ): Promise<ListensEntity> {
    const userId = req.user.id;
    // handle song doesn't exist case
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
