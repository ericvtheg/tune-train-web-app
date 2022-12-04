import { Query, Resolver, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import {
  Artist,
  ArtistResponse,
  CreateArtistInput,
  CreateArtistResponse,
  UpdateArtistInput,
  UpdateArtistResponse,
} from 'src/artist/artist.model';
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

  @Mutation(returns => CreateArtistResponse)
  @UseGuards(JwtAuthGuard)
  async createArtist(
    @Args('input') createArtistData: CreateArtistInput,
      @Id() userId: UserId,
  ): Promise<CreateArtistResponse>{
    const artist = await this.artistService.createArtist(
      userId,
      createArtistData,
    );
    return { artist };
  }

  @Mutation(returns => UpdateArtistResponse)
  @UseGuards(JwtAuthGuard)
  async updateArtist(
    @Args('input') updateArtistData: UpdateArtistInput,
      @Id() id: ArtistId,
  ): Promise<UpdateArtistResponse> {
    const artist = await this.artistService.updateArtist(id, updateArtistData);
    return { artist };
  }

  @Query(returns => ArtistResponse)
  async artist(@Args('id') id: ArtistId): Promise<ArtistResponse> {
    const artist = await this.artistService.findArtistById(id);
    return { artist };
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