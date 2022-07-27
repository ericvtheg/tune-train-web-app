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
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { CreateListenDto } from './dto/create-listen.dto';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createSongDto: CreateSongDto,
    @UploadedFile() songFile: Express.Multer.File,
  ) {
    // TODO: handle validating file type as mp3
    // TODO: need to handle foreign key failure and unique constraint failure
    return this.songsService.create(createSongDto, songFile);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    // this should be an admin endpoint
    return this.songsService.findAll();
  }

  // add validation here
  // should I make this endpoint public?
  @UseGuards(JwtAuthGuard)
  @Get('random/:userId')
  findRandom(@Param('userId') userId: string) {
    // should pull user off authentication token
    return this.songsService.findRandom(+userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(+id);
  }

  // idk if validation is working here
  // TODO: also need to handle unique constraint error
  // this should maybe return the result of fetching a new random song as well
  // add parseint pipe
  // use DTO object here CreateListenDto
  // should pull userId off request
  @UseGuards(JwtAuthGuard)
  @Put('listen/:id')
  listen(
    @Param('id') id: number,
    @Query('liked') liked: boolean,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.songsService.listen({ songId: id, userId, liked });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(+id, updateSongDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    // use userId as well here from auth token?
    return this.songsService.remove(+id);
  }
}
