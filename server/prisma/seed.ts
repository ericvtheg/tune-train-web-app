import { PrismaClient } from '@prisma/client';
import { randEmail, randUserName } from '@ngneat/falso';

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.deleteMany();
  // await prisma.post.deleteMany();

  const artist = await prisma.user.create({
    data: {
      email: randEmail(),
      username: randUserName(),
      password: "somePassword",
      first_name: "Firstname",
      last_name: "Lastname",
      artist: {
        create: {
          stage_name: "Some Stage Name",
          bio: "some bio",
          image: "someimageurl.com/image"
        }
      },
    }
  });
  
  const user = await prisma.user.create({
    data: {
      email: randEmail(),
      username: randUserName(),
      password: "somePassword",
      first_name: "Firstname",
      last_name: "Lastname",
    }
  });

  const song = await prisma.song.create({
    data: {
      title: "Song Title",
      description: "Song Description",
      artist_id: artist.id
    }
  });

  await prisma.listen.create({
    data: {
      liked: true,
      song_id: song.id,
      user_id: user.id,
      artist_id: artist.id,
    }
  });

  console.log('Seeding...');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });