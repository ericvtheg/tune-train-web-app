import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { SongsEntity } from './entities/songs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SongsEntity])],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
