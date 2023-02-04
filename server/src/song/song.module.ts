import { Module, forwardRef } from '@nestjs/common';
import { SongRepository } from 'src/song/song.repository';
import { SongService } from 'src/song/song.service';
import { SongResolver } from 'src/song/song.resolver';
import { FileStorageModule } from 'src/common/services/file-storage/file-storage.module';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    FileStorageModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<string>('fileStorage.songBucket.name'),
    }),
  ],
  providers: [
    SongResolver,
    SongService,
    SongRepository,
  ],
  exports: [SongService],
})
export class SongModule {}