import { Module } from '@nestjs/common';
import { SongRepository } from "src/song/song.repository"
import { SongService } from "src/song/song.service";
import { SongResolver } from "src/song/song.resolver";
import { ListenModule } from 'src/listen/listen.module';
import { ServicesModule } from 'src/common/services/services.module';
import { BUCKET_NAME } from 'src/common/symbols';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ListenModule,
    ServicesModule,
  ],
  providers: [
    SongResolver, 
    SongService, 
    SongRepository,
    { 
      provide: BUCKET_NAME,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get<string>("fileStorage.songsBucket");
      },
    }
  ],
  exports: [SongService],
})
export class SongModule {};