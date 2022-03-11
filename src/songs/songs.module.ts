import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { SongsEntity } from './entities/songs.entity';
import { ListensEntity } from './entities/listens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SongsEntity, ListensEntity])],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
