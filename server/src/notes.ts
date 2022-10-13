import type { Opaque } from 'type-fest';

// remove unused service functions and controllers
// move auth/config (and health-check?) dirs into common
// decide if there should be a listen module or if the functionality should live in song
// get typesafe config service
// how to better error handle in nestjs?
// prisma data loader
// add integration/e2e tests
// figure out how to best mock providers/entities
// better unit tests, service layer should only test for branching, entity repositories should have unit tests


// Access Patterns

// Create User
//   User Model

// Add Artist Data (become artist)
//   Artist + Social Models

// Update Artist Data
//   Artist + Social Models

// Create Song
//   Song Model

// Find Random Song
//   Song + Artist + Socials Models

// Listen to Song

// Login
//   User Model

// cloud stuff
// destroy
// make it so literally everything is built using just terraform CLI
// add billing alerts through terraform
// create new AWS account (add + in the email address)
// only thing that should have to be manually done is transferring domain & the terraform state bucket
// remember there was some weirdness with configuring ssl certificate and associating it with a domain/hosted zone
// will need to run prisma generate or whatever on deployment

type UserId = Opaque<string>;
interface User {
  id: UserId;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isArtist: boolean; // TODO this field shouldn't live in the database, it should be determined on whether or not an artistId exists
}

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



type ListenId = Opaque<string>;
interface Listen {
  id: ListenId;
  liked?: boolean;
}