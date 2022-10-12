import { Query, Resolver, Args } from '@nestjs/graphql';
import { Artist } from "src/artist/artist.model";
import { ArtistService, ArtistId } from "src/artist/artist.service";

@Resolver(of => Artist)
export class ArtistResolver {
  constructor(private artistService: ArtistService) {}
  
  @Query(returns => Artist,  { nullable: true })
  async artist(@Args('id') id: ArtistId): Promise<Artist> {
    return await this.artistService.findArtistById(id);
  }
}