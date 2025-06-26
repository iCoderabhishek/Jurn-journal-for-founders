import {prisma} from '../src/config/config';
async function main() {
  await prisma.user.create({
    data: {
      clerkUserId: 'test-user-id', // <- This is what you'll use in req.userId
      name: 'Test User',
      email: 'test@example.com',
    },
  });
  
  console.log('User seeded');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
