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
  ): Promise<SongsEntity> {
    // TODO: handle validating file type as mp3
    // TODO: need to handle foreign key failure and unique constraint failure
    // TODO: remove fileName?
    // TODO: increase timeout for this endpoint?
    // TODO: verify if artist?
    return this.songsService.create(createSongDto, songFile);
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
  findOne(@Param('id') id: string): Promise<ISongResponse> {
    return this.songsService.findOne(+id);
  }

  // idk if validation is working here
  // TODO: also need to handle unique constraint error
  // this should maybe return the result of fetching a new random song as well
  @Put('listen/:id')
  listen(
    @Param('id') id: number,
      @Query('liked') liked: boolean,
      @Request() req: IUserRequest,
  ): Promise<ListensEntity> {
    const userId = req.user.id;
    return this.songsService.listen({ songId: id, userId, liked });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto): Promise<SongsEntity> {
    return this.songsService.update(+id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<SongsEntity> {
    return this.songsService.remove(+id);
  }
}
