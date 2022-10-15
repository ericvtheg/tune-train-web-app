import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.deleteMany();
  // await prisma.post.deleteMany();

  await prisma.user.create({
    data: {
      email: "testemail@gmail.com",
      username: "testusername",
      password: "somePassword",
      first_name: "Firstname",
      last_name: "Lastname",
      artist: {
        create: {
          stage_name: "Some Stage Name",
          bio: "some bio",
          image: "someimageurl.com/image"
        }
      }
    }
  })

  console.log('Seeding...');

  // create data here
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });