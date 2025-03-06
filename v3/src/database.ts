import { z } from 'zod';
import { PrismaClient, type Questions } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategorySchema = z.object({
  id: z.number(),
  title: z.string().min(3).max(1024),
  slug: z.string(),
});

const CategoryToCreateSchema = z.object({
  title: z.string().min(3).max(1024),
});

const QuestionToCreateSchema = z.object({
  text: z.string().min(3).max(1024),
  categoryId: z.number(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QuestionToUpdateSchema = z.object({
  text: z.string().min(3).max(1024),
  categoryId: z.number(),
});

type Category = z.infer<typeof CategorySchema>;
type CategoryToCreate = z.infer<typeof CategoryToCreateSchema>;

const prisma = new PrismaClient();

export async function getCategories(): Promise<Array<Category>> {
  const categories = await prisma.categories.findMany();
  return categories;
}

export async function getCategory(slug: string): Promise<Category | null> {
  const cat = await prisma.categories.findUnique({
    where: { slug },
  });
  return cat;
}

export function validateCategory(categoryToValidate: unknown) {
  return CategoryToCreateSchema.safeParse(categoryToValidate);
}

export async function createCategory(categoryToCreate: CategoryToCreate): Promise<Category> {
  const createdCategory = await prisma.categories.create({
    data: {
      title: categoryToCreate.title,
      slug: categoryToCreate.title.toLowerCase().replace(' ', '-'),
    },
  });
  return createdCategory;
}

export async function updateCategory(slug: string, title: string): Promise<Category> {
  const updatedCategory = await prisma.categories.update({
    where: { slug },
    data: {
      title,
      slug: title.toLowerCase().replace(' ', '-'),
    },
  });
  return updatedCategory;
}

export async function deleteCategory(category: { slug: string }) {
  await prisma.categories.delete({
    where: { slug: category.slug },
  });
}

export function validateQuestion(questionToValidate: unknown) {
  return QuestionToCreateSchema.safeParse(questionToValidate);
}

export async function getQuestions(): Promise<Array<Questions>> {
  const questions = await prisma.questions.findMany({
    include: { answers: true },
  });
  return questions;
}

export async function getQuestion(id: number): Promise<Questions | null> {
  const question = await prisma.questions.findUnique({ where: { id } });
  return question;
}

export async function getQuestionsFromCategory(categoryId: number): Promise<Array<Questions>> {
  const questions = await prisma.questions.findMany({
    where: { categoryID: categoryId },
    include: { answers: true },
  });
  return questions;
}

export async function createQuestion(questionToCreate: { text: string; categoryId: number }): Promise<Questions> {
    const createdQuestion = await prisma.questions.create({
      data: {
        text: questionToCreate.text,
        categoryID: questionToCreate.categoryId,
      },
    });
    return createdQuestion;
  }

  export async function updateQuestion(questionToUpdate: { id: number; text: string; categoryId: number }): Promise<Questions> {
    const updatedQuestion = await prisma.questions.update({
      where: { id: questionToUpdate.id },
      data: {
        text: questionToUpdate.text,
        categoryID: questionToUpdate.categoryId,
      },
    });
    return updatedQuestion;
  }

export async function deleteQuestion(questionToDelete: { id: number }) {
  await prisma.questions.delete({
    where: { id: questionToDelete.id },
  });
}