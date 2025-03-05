/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionID_fkey";

-- DropTable
DROP TABLE "Answer";

-- CreateTable
CREATE TABLE "Answers" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(1024) NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "questionID" INTEGER NOT NULL,

    CONSTRAINT "Answers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
