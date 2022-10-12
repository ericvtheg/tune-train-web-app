import { Module } from '@nestjs/common';
import { SongRepository } from "src/song/song.repository"
import { SongService } from "src/song/song.service";
import { SongResolver } from "src/song/song.resolver";

@Module({
  providers: [SongResolver, SongService, SongRepository]
})
export class SongModule {};