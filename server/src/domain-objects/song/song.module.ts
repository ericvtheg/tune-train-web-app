import { Module } from '@nestjs/common';
import { SongService } from 'src/domain-objects/song/song.service';
import { SongResolver } from 'src/domain-objects/song/song.resolver';
import { FileStorageModule } from 'src/services/file-storage/file-storage.module';
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
  ],
  exports: [SongService],
})
export class SongModule {}