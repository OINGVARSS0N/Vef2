import { describe, it, expect } from 'vitest';
import app from '../src/index.ts';

describe('index.ts', () => {
  it('should return Hello Hono!', async () => {
    const res = await app.request('/');
     expect(res.status).toBe(200);
    expect(await res.text()).toBe('Hello Hono!');
  });

  it('should get categories', async () => {
    const res = await app.request('/categories');
    expect(res.status).toBe(200);
    expect(await res.json()).toBeInstanceOf(Array);
  });

  it('should get a category by slug', async () => {
    const res = await app.request('/categories/html');
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveProperty('slug', 'html');
  });

  it('should return 404 if category is not found', async () => {
    const res = await app.request('/categories/nonexistent');
    expect(res.status).toBe(404);
  });

  it('should create a category', async () => {
    const newCategory = { title: 'New Category' };
    const res = await app.request('/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toHaveProperty('title', newCategory.title);
  });

  it('should update a category', async () => {
    const updatedCategory = { title: 'Updated Category' };
    const res = await app.request('/category/html', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCategory),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveProperty('title', updatedCategory.title);
  });

  it('should delete a category', async () => {
    const res = await app.request('/category/html', {
      method: 'DELETE',
    });
    expect(res.status).toBe(204);
  });
});