import { Module } from '@nestjs/common';
import { ArtistResolver } from 'src/artist/artist.resolver';
import { ArtistService } from 'src/artist/artist.service';
import { ArtistRepository } from 'src/artist/artist.repository';

@Module({
  providers: [ArtistResolver, ArtistService, ArtistRepository]
})
export class ArtistModule {}
