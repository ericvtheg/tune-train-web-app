import { Module, forwardRef } from '@nestjs/common';
import { ArtistResolver } from 'src/artist/artist.resolver';
import { ArtistService } from 'src/artist/artist.service';
import { ArtistRepository } from 'src/artist/artist.repository';
import { ListenModule } from 'src/listen/listen.module';
import { SongModule } from 'src/song/song.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => ListenModule),
    forwardRef(() => UserModule),
    SongModule,
  ],
  providers: [ArtistResolver, ArtistService, ArtistRepository],
  exports: [ArtistService],
})
export class ArtistModule {}
