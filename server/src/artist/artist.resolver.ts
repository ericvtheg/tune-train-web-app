import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Artist, CreateArtistInput, UpdateArtistInput } from 'src/artist/artist.model';
import { ArtistService, ArtistId } from 'src/artist/artist.service';
import { Song } from 'src/song/song.model';
import { SongService } from 'src/song/song.service';
import { User } from 'src/user/user.model';
import { UserId, UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Id } from 'src/common/decorators/id.decorator';

@Resolver(() => Artist)
export class ArtistResolver {
  constructor(
    private artistService: ArtistService,
    private songService: SongService,
    private userService: UserService,
  ) {}

  @Mutation(returns => Artist)
  @UseGuards(JwtAuthGuard)
  async createArtist(
    @Args('createArtistData') createArtistData: CreateArtistInput,
      @Id() userId: UserId,
  ): Promise<Artist>{
    return await this.artistService.createArtist(
      userId,
      createArtistData,
    );
  }

  @Mutation(returns => Artist)
  @UseGuards(JwtAuthGuard)
  async updateArtist(
    @Args('updateArtistData') updateArtistData: UpdateArtistInput,
      @Id() id: ArtistId,
  ): Promise<Artist> {
    return await this.artistService.updateArtist(id, updateArtistData);
  }

  @Query(returns => Artist, { nullable: true })
  async artist(@Args('id') id: ArtistId): Promise<Artist | null> {
    return await this.artistService.findArtistById(id);
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