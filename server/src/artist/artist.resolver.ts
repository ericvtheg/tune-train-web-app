import { Query, Resolver, Args } from '@nestjs/graphql';
import { Artist } from "src/artist/models/artist.model";

@Resolver(of => Artist)
export class ArtistResolver {
  
  @Query(returns => Artist,  { nullable: true })
  async artist(@Args('id') id: string) {
    return;
  }
}