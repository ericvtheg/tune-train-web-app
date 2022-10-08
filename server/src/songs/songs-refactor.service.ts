import type { Opaque } from 'type-fest';

// use repository pattern for entities
// use Prisma
// TODO ids should be UUIDs (not incremental integers)
// TODO add graphql code first 
// could be cool to upgrade node version
// remove unused service functions and controllers
// how to better error handle in nestjs?
// figure out how to best mock providers/entities
// better unit tests, service layer should only test for branching, entity repositories should have unit tests
// add integration/e2e tests


// cloud stuff
// destroy
// make it so literally everything is built using just terraform CLI
// add billing alerts through terraform
// create new AWS account (add + in the email address)
// only thing that should have to be manually done is transferring domain & the terraform state bucket
// remember there was some weirdness with configuring ssl certificate and associating it with a domain/hosted zone



type ArtistId = Opaque<string>;
interface Artist { 
  id: ArtistId;
  stageName: string;
  bio: string;
  image: string;
}

type SocialsId = Opaque<string>;
interface Socials {
  id: SocialsId;
  spotify: string;
}

type UserId = Opaque<string>;
interface User {
  id: UserId;
  username: string;
  avatar: string;
  isArtist: boolean; // this field shouldn't live in the database, it should be determined on whether or not an artistId exists
  artist?: Artist;
  socials?: Socials;
}

type SongId = Opaque<string>;
interface Song {
  id: SongId;
  title: string;
  description: string;
}

type ListenId = Opaque<string>;
interface Listen {
  id: ListenId;
  liked?: boolean;
}