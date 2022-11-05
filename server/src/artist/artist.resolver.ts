import { Query, Resolver, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Artist } from "src/artist/artist.model";
import { ArtistService, ArtistId } from "src/artist/artist.service";
import { ListenService } from "src/listen/listen.service";
import { Listen } from "src/listen/listen.model";

@Resolver(of => Artist)
export class ArtistResolver {
  constructor(
    private artistService: ArtistService,
    private listenService: ListenService
  ) {}
  
  @Query(returns => Artist,  { nullable: true })
  async artist(@Args('id') id: ArtistId): Promise<Artist> {
    return await this.artistService.findArtistById(id);
  }

  @ResolveField("listens")
  async listens(@Parent() artist: Artist): Promise<Listen[]> {
    const { id } = artist;
    return await this.listenService.findArtistListens(id as ArtistId);
  }
}