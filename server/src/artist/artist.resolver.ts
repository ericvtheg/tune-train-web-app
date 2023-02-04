import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import {
  Artist,
  CreateArtistInput,
  CreateArtistResponse,
} from 'src/artist/artist.model';
import { ArtistService } from 'src/artist/artist.service';
import { UserId } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Id } from 'src/common/decorators/id.decorator';

@Resolver(() => Artist)
export class ArtistResolver {
  constructor(private artistService: ArtistService) {}

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
}