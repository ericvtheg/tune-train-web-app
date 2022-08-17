import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { HashPipe } from '../common/pipes/hash.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArtistsEntity } from './entities/artists.entity';
import { Public } from '../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Public()
  @Post()
  create(@Body(HashPipe) createArtistDto: CreateArtistDto): Promise<ArtistsEntity> {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  findAll(): Promise<ArtistsEntity[]> {
    return this.artistsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ArtistsEntity> {
    return this.artistsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto): Promise<ArtistsEntity> {
    return this.artistsService.update(+id, updateArtistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ArtistsEntity> {
    return this.artistsService.remove(+id);
  }
}
