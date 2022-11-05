import { Module, forwardRef } from "@nestjs/common";
import { ListenResolver } from "src/listen/listen.resolver";
import { ListenService } from "src/listen/listen.service";
import { ListenRepository } from "src/listen/listen.repository";
import { ArtistModule } from "src/artist/artist.module";
import { SongModule } from "src/song/song.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    forwardRef(() => ArtistModule), 
    forwardRef(() => SongModule), 
    forwardRef(() => UserModule),
  ],
  providers: [ListenResolver, ListenService, ListenRepository],
  exports: [ListenService]
})
export class ListenModule {}