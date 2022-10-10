import { Module } from '@nestjs/common';
import { ArtistResolver } from 'src/artist/artist.resolver';
import { ArtistRepository } from 'src/artist/artist.repository';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  providers: [ArtistResolver, ArtistService, ArtistRepository]
})
export class ArtistModule {}
