import { Module, forwardRef } from '@nestjs/common';
import { ListenQueue } from 'src/listen/listen.queue';
import { ListenResolver } from 'src/listen/listen.resolver';
import { ListenService } from 'src/listen/listen.service';
import { ListenRepository } from 'src/listen/listen.repository';
import { ArtistModule } from 'src/artist/artist.module';
import { SongModule } from 'src/song/song.module';
import { UserModule } from 'src/user/user.module';
import { QueueModule } from 'src/common/services/queue/queue.module';
import { TransformedConfig } from 'src/common/config/config';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    forwardRef(() => ArtistModule),
    forwardRef(() => SongModule),
    forwardRef(() => UserModule),
    QueueModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TransformedConfig, true>) =>
        configService.get<string>('queue.listenQueue.url', { infer: true }),
    }),
  ],
  providers: [
    ListenResolver,
    ListenService,
    ListenRepository,
    ListenQueue,
  ],
  exports: [ListenService],
})
export class ListenModule {}