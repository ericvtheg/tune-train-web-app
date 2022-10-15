import { PrismaClient } from '@prisma/client';
import { randEmail, randUserName } from '@ngneat/falso';

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.deleteMany();
  // await prisma.post.deleteMany();

  const user = await prisma.user.create({
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

  const song = await prisma.song.create({
    data: {
      title: "Song Title",
      description: "Song Description",
      artist_id: user.id
    }
  });

  await prisma.listen.create({
    data: {
      liked: true,
      song_id: song.id,
      user_id: user.id,
      artist_id: user.id,
    }
  });

  console.log('Seeding...');

  // create data here
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });