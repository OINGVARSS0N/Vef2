import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const categories = await prisma.categories.createMany({ data: [
      { id: 1, title: "HTML", slug: "An egg" },
      { id: 2, title: "CSS", slug: "A candle" },
      { id: 3, title: "JavaScript", slug: "All of them" },
      { id: 4, title: "JONRUNAR", slug: "A sponge" },
  ] });
  console.log(categories)

  const question = await prisma.questions.createMany({ data: [
      { id: 1, text: "What has to be broken before you can use it?", categoryID: 1 },
      { id: 2,text: "I'm tall when I'm young, and I'm short when I'm old. What am I?", categoryID: 1 },
      { id: 3,text: "What month of the year has 28 days?", categoryID: 2 },
      { id: 4,text: "What is full of holes but still holds water?", categoryID: 2 },
      { id: 5,text: "What question can you never answer yes to?", categoryID: 3 },
      { id: 6,text: "What is always in front of you but can't be seen?", categoryID: 3 },
      { id: 7,text: "How tall is Jon Runar?", categoryID: 4 },
      { id: 8,text: "How large is Jon Runar?", categoryID: 4 }
  ] });
  console.log(question)

  const answer = await prisma.answers.createMany({ data: [
    { id: 1, correct: false, text: "YES", questionID: 1 },
    { id: 2, correct: false, text: "NO", questionID: 2 },
    { id: 3, correct: false, text: "3Wha year has 28 days?", questionID: 3 },
    { id: 4, correct: false, text: "4What is holes but still holds water?", questionID: 4 },
    { id: 5, correct: false, text: "5What quest never answer yes to?", questionID: 5 },
    { id: 6, correct: false, text: "6Whatt of you but can't be seen?", questionID: 6 },
    { id: 7, correct: false, text: "200000 metrar", questionID: 7 },
    { id: 8, correct: false, text: "10000 metrar", questionID: 8 }
] });
console.log(answer)

};


main()
.then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
