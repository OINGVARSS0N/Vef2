import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import {
  createCategory,
  getCategories,
  getCategory,
  validateCategory,
  updateCategory,
  deleteCategory,
  getQuestionsFromCategory,
  getQuestions,
  createQuestion,
  getQuestion,
  deleteQuestion,
  validateQuestion,
  updateQuestion,
} from './database.ts';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/categories', async (c) => {
  const categories = await getCategories();
  return c.json(categories);
});

app.get('/categories/:slug', async (c) => {
  const slug = c.req.param('slug');
  const category = await getCategory(slug);

  if (!category) {
    return c.json({ message: 'not found' }, 404);
  }

  return c.json(category, 200);
});

app.post('/category', async (c) => {
  let categoryToCreate: unknown;
  try {
    categoryToCreate = await c.req.json();
  } catch (e) {
    console.error(e);
    return c.json({ error: 'invalid json' }, 400);
  }

  const validCategory = validateCategory(categoryToCreate);

  if (!validCategory.success) {
    return c.json({ error: 'invalid data', errors: validCategory.error.flatten() }, 400);
  }

  const createdCategory = await createCategory(validCategory.data);
  return c.json(createdCategory, 201);
});

app.patch('/category/:slug', async (c) => {
  const slug = c.req.param('slug');
  const category = await getCategory(slug);

  if (!category) {
    return c.json({ error: 'category not found' }, 404);
  }

  let categoryToUpdate: unknown;
  try {
    categoryToUpdate = await c.req.json();
  } catch {
    return c.json({ error: 'invalid json' }, 400);
  }

  const validCategory = validateCategory(categoryToUpdate);

  if (!validCategory.success) {
    return c.json({ error: 'invalid data', errors: validCategory.error.flatten() }, 400);
  }

  const updatedCategory = await updateCategory(slug, validCategory.data.title);
  return c.json(updatedCategory, 200);
});

app.delete('/category/:slug', async (c) => {
  const slug = c.req.param('slug');
  const category = await getCategory(slug);

  if (!category) {
    return c.json({ error: 'category not found' }, 404);
  }

  try {
    await deleteCategory({ slug });
    return c.body(null, 204);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'category not deleted' }, 500);
  }
});

app.get('/questions', async (c) => {
  const questions = await getQuestions();

  if (!questions) {
    return c.json({ error: 'Internal Server Error' }, 500);
  }

  return c.json(questions, 200);
});

app.get('/questionsByCategoryID/:categoryID', async (c) => {
  const id = Number(c.req.param('categoryID'));
  const category = await getQuestionsFromCategory(id);

  if (!category) {
    return c.json({ message: 'not found' }, 404);
  }

  return c.json(category, 200);
});

app.post('/question', async (c) => {
  let questionToCreate: unknown;
  try {
    questionToCreate = await c.req.json();
  } catch {
    return c.json({ error: 'invalid json' }, 400);
  }

  const validQuestion = validateQuestion(questionToCreate);

  if (!validQuestion.success) {
    return c.json({ error: 'invalid data', errors: validQuestion.error.flatten() }, 400);
  }

  const createdQuestion = await createQuestion(validQuestion.data);
  return c.json(createdQuestion, 201);
});

app.patch('/question/:id', async (c) => {
  const id = Number(c.req.param('id'));

  let questionToUpdate: unknown;
  try {
    questionToUpdate = await c.req.json();
  } catch {
    return c.json({ error: 'invalid json' }, 400);
  }

  const validQuestion = validateQuestion(questionToUpdate);

  if (!validQuestion.success) {
    return c.json({ error: 'invalid data', errors: validQuestion.error.flatten() }, 400);
  }

  const updatedQuestion = await updateQuestion(id, validQuestion.data);
  return c.json(updatedQuestion, 200);
});

app.delete('/question/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const question = await getQuestion(id);

  if (!question) {
    return c.json({ error: 'question not found' }, 404);
  }

  try {
    await deleteQuestion({ id });
    return c.body(null, 204);
  } catch {
    return c.json({ error: 'question not deleted' }, 500);
  }
});

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

export default app;