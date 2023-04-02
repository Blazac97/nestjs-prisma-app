import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
// Создаём сид, создаём первичные записи в нашей БД, ипользовал в основном для теста и разработки , поскольку можно быстро очистить БД и восстановить эти данные.
async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'test@test.com',
      roles: [Role.USER],
      // "12345"
      password: '$2a$15$/o0mkGz6YdPvX3uTa79imOXdauXPtuUKneAPQuDZF6ldY9p6F.6T.',
      profile: {
        create: {
          name: 'TestUser1_firstName',
          lastName: 'TestUser1_lastName',
          address: 'TestUser1_address',
          phone: '+375297777777',
        },
      },
    },
  });

  const block1 = await prisma.block.create({
    data: {
      key: 'test-key',
      name: 'Block name here',
      group: 'main-group',
      content: 'Some context here',
    },
  });

  console.log({ user1, block1 });
}

main()
  .then(async () => {
    console.log('Sucessfully seeded!');
  })
  .catch(async e => {
    console.log('Seeding error: ');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
