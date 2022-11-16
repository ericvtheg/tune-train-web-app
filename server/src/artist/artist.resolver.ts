import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { Artist, CreateArtistInput, UpdateArtistInput } from 'src/artist/artist.model';
import { ArtistService, ArtistId } from 'src/artist/artist.service';
import { ListenService } from 'src/listen/listen.service';
import { Listen } from 'src/listen/listen.model';
import { Song } from 'src/song/song.model';
import { SongService } from 'src/song/song.service';
import { User } from 'src/user/user.model';
import { UserId, UserService } from 'src/user/user.service';

@Resolver(() => Artist)
export class ArtistResolver {
  constructor(
    private artistService: ArtistService,
    private listenService: ListenService,
    private songService: SongService,
    private userService: UserService,
  ) {}

  @Mutation(returns => Artist)
  async createArtist(@Args('createArtistData') createArtistData: CreateArtistInput): Promise<Artist>{
    // TODO pull userId off token
    const userId: UserId = 'clak3bn9u000016d03xg3jbmu' as UserId;
    return await this.artistService.createArtist({
      userId,
      ...createArtistData,
    });
  }

  @Mutation(returns => Artist)
  async updateArtist(
    @Args('artistId') id: ArtistId,
      @Args('updateArtistData') updateArtistData: UpdateArtistInput,
  ): Promise<Artist> {
    return await this.artistService.updateArtist(id, updateArtistData);
  }

  @Query(returns => Artist, { nullable: true })
  async artist(@Args('id') id: ArtistId): Promise<Artist | null> {
    return await this.artistService.findArtistById(id);
  }

  @ResolveField('listens', returns => [Listen])
  async listens(@Parent() artist: Artist): Promise<Listen[]> {
    const { id } = artist;
    return await this.listenService.findArtistListens(id);
  }

  @ResolveField('songs', returns => [Song])
  async songs(@Parent() artist: Artist): Promise<Song[]> {
    const { id } = artist;
    return await this.songService.findArtistSongs(id);
  }

  @ResolveField('user', returns => User)
  async user(@Parent() artist: Artist): Promise<User> {
    const { id } = artist;
    const user = await this.userService.findUserByArtistId(id);
    if (!user){
      throw 'error missing user entity for artist';
    }
    return user;

  }
}