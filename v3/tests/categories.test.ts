import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCategories, getCategory, validateCategory, createCategory, updateCategory, deleteCategory } from '../src/database.ts';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
vi.mock('@prisma/client', () => {
    const mockPrisma = {
        categories: {
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
    };
    return { PrismaClient: vi.fn(() => mockPrisma) };
});

const prisma = new PrismaClient() as unknown as {
    categories: {
        create: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
        findMany: ReturnType<typeof vi.fn>;
        findUnique: ReturnType<typeof vi.fn>;
    };
};


describe('Category Functions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCategories', () => {
        it('should return a list of categories', async () => {
            const mockCategories = [
                { id: 1, slug: 'html', title: 'HTML' },
                { id: 2, slug: 'css', title: 'CSS' },
                { id: 3, slug: 'js', title: 'JavaScript' },
            ];
            prisma.categories.findMany.mockResolvedValue(mockCategories);

            const categories = await getCategories();
            expect(categories).toEqual(mockCategories);
            expect(prisma.categories.findMany).toHaveBeenCalled();
        });
    });

    describe('getCategory', () => {
        it('should return a category by slug', async () => {
            const mockCategory = { id: 1, slug: 'html', title: 'HTML' };
            prisma.categories.findUnique.mockResolvedValue(mockCategory);

            const category = await getCategory('html');
            expect(category).toEqual(mockCategory);
            expect(prisma.categories.findUnique).toHaveBeenCalledWith({
                where: { slug: 'html' },
            });
        });

        it('should return null if category is not found', async () => {
            prisma.categories.findUnique.mockResolvedValue(null);

            const category = await getCategory('non-existent-slug');
            expect(category).toBeNull();
            expect(prisma.categories.findUnique).toHaveBeenCalledWith({
                where: { slug: 'non-existent-slug' },
            });
        });
    });

    describe('validateCategory', () => {
        it('should validate a valid category', () => {
            const validCategory = { title: 'Valid Title' };
            const result = validateCategory(validCategory);
            expect(result.success).toBe(true);
        });

        it('should invalidate an invalid category', () => {
            const invalidCategory = { title: 'A' }; // Too short
            const result = validateCategory(invalidCategory);
            expect(result.success).toBe(false);
        });
    });

    describe('createCategory', () => {
        it('should create a new category', async () => {
            const newCategory = { title: 'New Category' };
            const mockCreatedCategory = { id: 4, slug: 'new-category', title: 'New Category' };
            prisma.categories.create.mockResolvedValue(mockCreatedCategory);

            const createdCategory = await createCategory(newCategory);
            expect(createdCategory).toEqual(mockCreatedCategory);
            expect(prisma.categories.create).toHaveBeenCalledWith({
                data: {
                    title: newCategory.title,
                    slug: newCategory.title.toLowerCase().replace(' ', '-'),
                },
            });
        });
    });

    describe('updateCategory', () => {
        it('should update an existing category', async () => {
            const updatedCategory = { title: 'Updated Category' };
            const mockUpdatedCategory = { id: 1, slug: 'updated-category', title: 'Updated Category' };
            prisma.categories.update.mockResolvedValue(mockUpdatedCategory);

            const result = await updateCategory(updatedCategory);
            expect(result).toEqual(mockUpdatedCategory);
            expect(prisma.categories.update).toHaveBeenCalledWith({
                where: { title: updatedCategory.title },
                data: {
                    title: updatedCategory.title,
                    slug: updatedCategory.title.toLowerCase().replace(' ', '-'),
                },
            });
        });
    });

    describe('deleteCategory', () => {
        it('should delete a category by slug', async () => {
            const categoryToDelete = { slug: 'html' };
            const mockDeletedCategory = { id: 1, slug: 'html', title: 'HTML' };
            prisma.categories.delete.mockResolvedValue(mockDeletedCategory);

            const result = await deleteCategory(categoryToDelete);
            expect(result).toEqual(mockDeletedCategory);
            expect(prisma.categories.delete).toHaveBeenCalledWith({
                where: { slug: categoryToDelete.slug },
            });
        });
    });
});