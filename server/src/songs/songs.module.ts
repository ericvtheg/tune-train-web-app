import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { SongsEntity } from './entities/songs.entity';
import { ListensEntity } from './entities/listens.entity';
import { ServiceModule } from '../common/services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SongsEntity, ListensEntity]),
    ServiceModule.register({
      bucketNameEnvVar: 'songsBucket',
    }),
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
