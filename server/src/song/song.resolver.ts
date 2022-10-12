import { Query, Resolver, Args } from '@nestjs/graphql';
import { Song } from 'src/song/song.model';
import { SongService, SongId } from "src/song/song.service";

@Resolver(of => Song)
export class SongResolver {
  constructor(private songService: SongService) {}
}