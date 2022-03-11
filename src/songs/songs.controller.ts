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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  // add validation here
  @Get('random/:userId')
  findRandom(@Param('userId') userId: string) {
    return this.songsService.findRandom(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(+id);
  }

  // idk if validation is working here
  @Put('listen/:userId/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  listen(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @Query('liked') liked: boolean,
  ) {
    return this.songsService.listen({ songId: id, userId, liked });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(+id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songsService.remove(+id);
  }
}
