import { Module, forwardRef } from '@nestjs/common';
import { SongRepository } from "src/song/song.repository"
import { SongService } from "src/song/song.service";
import { SongResolver } from "src/song/song.resolver";
import { ListenModule } from 'src/listen/listen.module';
import { ArtistModule } from "src/artist/artist.module";
import { FileStorageModule } from "src/common/services/file-storage/file-storage.module";
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    forwardRef(() => ListenModule),
    forwardRef(() => ArtistModule),
    FileStorageModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => 
        configService.get<string>("fileStorage.songsBucket")
    })
  ],
  providers: [
    SongResolver, 
    SongService, 
    SongRepository,
  ],
  exports: [SongService],
})
export class SongModule {};