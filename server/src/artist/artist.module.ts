import { Module } from '@nestjs/common';
import { ArtistResolver } from 'src/artist/artist.resolver';

@Module({
  providers: [ArtistResolver]
})
export class ArtistModule {}
