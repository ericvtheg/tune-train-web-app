import { getConnection } from 'typeorm';
import { ArtistsEntity } from '../../src/artists/entities/artists.entity';
import { UsersEntity } from '../../src/users/entities/users.entity';
import { ListensEntity } from '../../src/songs/entities/listens.entity';
import { SongsEntity } from '../../src/songs/entities/songs.entity';
import { faker } from '@faker-js/faker';

export class TestDataGenerator {
  connection = getConnection();
  entityManager = this.connection.createEntityManager();
  n: number;

  constructor(amountToCreate: number) {
    this.n = amountToCreate;
  }

  async generateData(): Promise<void> {
    const artistData = this.generateArtistData();
    const userData = this.generateUserData();
    const songData = this.generateSongData();
    const listenData = this.generateListenData();

    await this.connection.transaction(async (entityManager) => {
      entityManager.insert<UsersEntity>(UsersEntity, userData);
      entityManager.insert<ArtistsEntity>(ArtistsEntity, artistData);
      entityManager.insert<SongsEntity>(SongsEntity, songData);
      entityManager.insert<ListensEntity>(ListensEntity, listenData);
    });
  }

  generateUserData() {
    return [...Array(this.n)].map((_, i) => {
      return {
        id: i,
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        isArtist: true,
      };
    });
  }

  generateArtistData() {
    return [...Array(this.n)].map((_, i) => {
      return {
        id: i,
        stageName: faker.name.fullName(),
        bio: faker.lorem.paragraph(),
        image: faker.image.imageUrl(),
        socials: {
          instagram: 'test',
        }
      };
    });
  }

  generateSongData() {
    return [];
  }

  generateListenData() {
    return [];
  }
}