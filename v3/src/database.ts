import { z } from 'zod';
import { PrismaClient, type Questions } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategorySchema = z.object({
    id: z.number(),
    title: z
        .string()
        .min(3, 'title must be more than two letters')
        .max(1024, 'title can be at most 1024 letters'),
    slug: z.string()
});

const CategoryToCreateSchema = z.object({
    title: z
        .string()
        .min(3, 'title must be more than two letters')
        .max(1024, 'title can be at most 1024 letters'),
});

export const AnswerSchema = z.object({
    text: z.string().min(1),
    correct: z
            .boolean()
            .default(false),
});

export const QuestionSchema = z.object({
    id: z.number(),
    text: z
        .string()
        .min(3, 'question must be more than 2 letter long')
        .max(1024, 'question can be at most 1024 letters'),
    categoryId: z.number(),
})


export const QuestionToCreateSchema = z.object({
    text: z
        .string()
        .min(3, 'question must be more than 2 letter long')
        .max(1024, 'question can be at most 1024 letters'),
    categoryId: z.number(),
})

export const QuestionToUpdateSchema = z.object({
    id: z.number(),
    text: z
        .string()
        .min(3, 'question must be more than 2 letter long')
        .max(1024, 'question can be at most 1024 letters'),
})

type Category = z.infer<typeof CategorySchema>;
type CategoryToCreate = z.infer<typeof CategoryToCreateSchema>;
type QuestionToCreate = z.infer<typeof QuestionToCreateSchema>;
type QuestionToUpdate = z.infer<typeof QuestionToUpdateSchema>;


const prisma = new PrismaClient();

export async function getCategories(
    limit: number = 10,
    offset: number = 0,
): Promise<Array<Category>> {
    const categories = await prisma.categories.findMany({take: limit, skip: offset});
    console.log('categories :>>', categories)
    return categories
}

export async function getCategory(slug: string): Promise<Category | null> {
    const cat = await prisma.categories.findUnique({
        where:{
            slug:slug
        },
    })

    return cat
}

export function validateCategory(categoryToValidate: unknown){
    const result = CategoryToCreateSchema.safeParse(categoryToValidate);
  
    return result
}
  
export async function createCategory(categoryToCreate: CategoryToCreate): Promise<Category> {
    console.log("createCategory", categoryToCreate)
    const createdCategory = await prisma.categories.create({
        data: {
            title: categoryToCreate.title,
            slug: categoryToCreate.title.toLowerCase().replace(' ', '-'),
        },
    });

    console.log("createdCategory", createdCategory)
    return createdCategory
}
export async function updateCategory(slug: string, title: string): Promise<Category> {
    const updateCategory = await prisma.categories.update({
        where: {
            slug: slug,
        },
        data: {
            title: title,
            slug: title.toLowerCase().replace(' ', '-'),
        },
    });

    return updateCategory
}

export async function deleteCategory(category: { slug: string}) {
    const deleteCategory = await prisma.categories.delete({
        where: {
            slug: category.slug,
        },
    })

    return deleteCategory
}

export function validateQuestion(questionToValidate: unknown){
    const result = CategoryToCreateSchema.safeParse(questionToValidate);
  
    return result
}

export async function getQuestions(
    limit: number = 25,
    offset: number = 0,
): Promise<Array<Questions>> {
    const questions = await prisma.questions.findMany({
        take: limit, 
        skip: offset,
        include: {
            answers: true,
        }
    });

    return questions
}

export async function getQuestion(id: number): Promise<Questions | null> {
    const question = await prisma.questions.findUnique({ 
        where: { id }, 
    });

    return question
}

export async function getQuestionsFromCategory(
    categoryId: number, 
  ): Promise<Array<Questions>> {
    const questions = await prisma.questions.findMany({
        where: {
            categoryID: categoryId,
        },
        include: {
            answers: true
        },
    });
  
    return questions;
  }

export async function createQuestion(questionToCreate: QuestionToCreate): Promise<Questions> {
   
    const createdQuestion = await prisma.questions.create({
        data: {
            text: questionToCreate.text,
            categoryID: questionToCreate.categoryId,
        }
    })

    return createdQuestion
}

export async function updateQuestion(questionToUpdate: QuestionToUpdate): Promise<QuestionToUpdate> {
    
    const updateQuestion = await prisma.questions.update({
        where: {
            id: questionToUpdate.id
        },
        data: {
            text: questionToUpdate.text,
        },
    });

    return updateQuestion
}


export async function deleteQuestion(questionToDelete: { id: number }) {
    const deleteQuestion = await prisma.questions.delete({
        where: {
            id: questionToDelete.id,
        },
    })

    return deleteQuestion
}