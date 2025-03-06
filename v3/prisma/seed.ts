import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  // Seed categories
  const categories = await Promise.all([
    prisma.categories.create({ data: { title: "HTML", slug: "html" } }).catch(() => null),
    prisma.categories.create({ data: { title: "CSS", slug: "css" } }).catch(() => null),
    prisma.categories.create({ data: { title: "JavaScript", slug: "javascript" } }).catch(() => null),
    prisma.categories.create({ data: { title: "epli", slug: "appelsin" } }).catch(() => null),
  ]);
  console.log("Categories created:", categories.filter(Boolean));

  // Seed questions
  const questions = await prisma.questions.createMany({
    data: [
      { text: "What has to be broken before you can use it?", categoryID: 1 },
      { text: "I'm tall when I'm young, and I'm short when I'm old. What am I?", categoryID: 1 },
      { text: "What month of the year has 28 days?", categoryID: 2 },
      { text: "What is full of holes but still holds water?", categoryID: 2 },
      { text: "What question can you never answer yes to?", categoryID: 3 },
      { text: "What is always in front of you but can't be seen?", categoryID: 3 },
      { text: "How tall is Jon Runar?", categoryID: 4 },
      { text: "How large is Jon Runar?", categoryID: 4 },
    ],
  });
  console.log("Questions created:", questions);

  // Seed answers
  const answers = await prisma.answers.createMany({
    data: [
      { correct: false, text: "YES", questionID: 1 },
      { correct: false, text: "NO", questionID: 2 },
      { correct: false, text: "3Wha year has 28 days?", questionID: 3 },
      { correct: false, text: "4What is holes but still holds water?", questionID: 4 },
      { correct: false, text: "5What quest never answer yes to?", questionID: 5 },
      { correct: false, text: "6Whatt of you but can't be seen?", questionID: 6 },
      { correct: false, text: "200000 metrar", questionID: 7 },
      { correct: false, text: "10000 metrar", questionID: 8 },
    ],
  });
  console.log("Answers created:", answers);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });