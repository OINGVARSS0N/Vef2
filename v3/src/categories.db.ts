import { z } from 'zod';
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
    const categories = mockCategories;
    console.log('categories :>>', categories)
    return categories
}

export function getCategory(slug: string): Category | null {
    const cat = mockCategories.find((c) => c.slug === slug)

    return cat ?? null
}

export function validateCategory(categoryToValidate: unknown){
    const result = CategoryToCreateSchema.safeParse(categoryToValidate);
  
    return result
}
  
export async function createCategory(categoryToCreate: CategoryToCreate): Promise<Category> {
    const createdCategory = await prisma.categories.create({
        data: {
        title: categoryToCreate.title,
        slug: categoryToCreate.title.toLowerCase().replace(' ', '-'),
        },
    });

    return createdCategory
}
export async function updateCategory(categoryToUpdate: CategoryToUpdate): Promise<Category> {
    const updateCategory = await prisma.categories.update({
        where: {
            title: categoryToUpdate.title,
        },
        data: {
            title: categoryToUpdate.title,
            slug: categoryToUpdate.title.toLowerCase().replace(' ', '-'),
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