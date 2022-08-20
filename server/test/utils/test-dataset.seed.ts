import { getConnection } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ArtistsEntity } from '../../src/artists/entities/artists.entity';
import { CreateArtistDto } from '../../src/artists/dto/create-artist.dto';
import { UsersEntity } from '../../src/users/entities/users.entity';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { ListensEntity } from '../../src/songs/entities/listens.entity';
import { CreateListenDto } from '../../src/songs/dto/create-listen.dto';
import { SongsEntity } from '../../src/songs/entities/songs.entity';
import { CreateSongDto } from '../../src/songs/dto/create-song.dto';

export class TestDataGenerator {
  connection = getConnection();
  entityManager = this.connection.createEntityManager();
  n: number;
  ids: number[];
  private songId = -1;

  constructor(numUsersToCreate: number = 1) {
    this.n = numUsersToCreate;
  }

  async generateData(): Promise<void> {
    const artistData = this.generateArtistData();
    const userData = this.generateUserData();
    const songData = this.generateSongData();
    const listenData = this.generateListenData();
    console.log(JSON.stringify(songData));
    console.log(JSON.stringify(listenData));

    await this.connection.transaction(async (entityManager) => {
      await entityManager.insert<UsersEntity>(UsersEntity, userData);
      await entityManager.insert<ArtistsEntity>(ArtistsEntity, artistData);
      songData.map(async (songs) => {
        await entityManager.insert<SongsEntity>(SongsEntity, songs);
      });
      listenData.map(async (listens) => {
        await entityManager.insert<ListensEntity>(ListensEntity, listens);
      });
    });
    this.ids = [...Array(this.n).keys()];
  }

  generateUserData() {
    return [...Array(this.n)].map((_, i) => ({
      id: i,
      ...TestDataGenerator.generateUserDto(),
    }));
  }

  static generateUserDto(): CreateUserDto {
    return {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      isArtist: true,
    };
  }

  generateArtistData(): any[] {
    return [...Array(this.n)].map((_, i) => ({
      id: i,
      ...TestDataGenerator.generateArtistDto(),
    }));
  }

  static generateArtistDto(): CreateArtistDto {
    return {
      stageName: faker.internet.userName(),
      bio: faker.lorem.paragraph(),
      image: faker.image.imageUrl(),
      socials: {
        instagram: faker.internet.userName(),
      },
      ...TestDataGenerator.generateUserDto(),
    };
  }

  generateSongData() {
    return [...Array(this.n)].map((_, artistId) => [...Array(11)].map(() => {
      this.songId += 1;
      return {
        id: this.songId,
        artistId,
        ...TestDataGenerator.generateSongDto(),
      };
    }));
  }

  static generateSongDto(): CreateSongDto {
    return {
      title: faker.internet.domainWord(),
      description: faker.lorem.sentence(),
      file: '' as any,
    };
  }

  generateListenData() {
    return [...Array(this.n)].map((_, userId) => [...Array(this.songId)].map((_, songId) => ({
      ...TestDataGenerator.generateListenDto(userId, songId),
    })));
  }

  static generateListenDto(userId: number, songId: number): CreateListenDto {
    return {
      userId,
      songId,
      liked: Math.random() < 0.5,
    };
  }
}
