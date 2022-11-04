import { Module } from '@nestjs/common';
import { SongRepository } from "src/song/song.repository"
import { SongService } from "src/song/song.service";
import { SongResolver } from "src/song/song.resolver";
import { ListenModule } from 'src/listen/listen.module';
import { ArtistModule } from "src/artist/artist.module";
import { FileStorageModule } from "src/common/services/file-storage/file-storage.module";


@Module({
  imports: [
    ListenModule,
    ArtistModule,
    // TODO anyway to fetch config value instead of just passing the path?
    FileStorageModule.register("fileStorage.songsBucket")
  ],
  providers: [
    SongResolver, 
    SongService, 
    SongRepository,
  ],
  exports: [SongService],
})
export class SongModule {};