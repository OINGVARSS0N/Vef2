/* eslint-disable @typescript-eslint/no-unused-vars */
import { string, z } from 'zod';
import { PrismaClient } from '@prisma/client';

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

const CategoryToUpdateSchema = z.object({
    title: z
        .string()
        .min(3, 'title must be more than two letters')
        .max(1024, 'title can be at most 1024 letters'),
        slug: z.string()
});

type Category = z.infer<typeof CategorySchema>;
type CategoryToCreate = z.infer<typeof CategoryToCreateSchema>;
type CategoryToUpdate = z.infer<typeof CategoryToUpdateSchema>;

const mockCategories: Array<Category> = [
    {
      id: 1,
      slug: 'html',
      title: 'HTML',
    },
    {
      id: 2,
      slug: 'css',
      title: 'CSS',
    },
    {
      id: 3,
      slug: 'js',
      title: 'JavaScript',
    },
  ];

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