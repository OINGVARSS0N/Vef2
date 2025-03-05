import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createCategory, getCategories, getCategory, validateCategory, updateCategory, deleteCategory } from './categories.db.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/categories', async (c) => {
  const categories = await getCategories()

  return c.json(categories)
})

app.get('/categories/:slug', (c) => {
  const slug = c.req.param('slug')

  const category = getCategory(slug);

  if (!category) {
    return c.json({ message: 'not found' }, 404)
  }

  return c.json(category, 200);
})

app.post('/category', async (c) => {
  let categoryToCreate: unknown;
  try {
    categoryToCreate = await c.req.json();
    console.log(categoryToCreate);
  } catch (e) {
    return c.json({ error: 'invalid json'}, 400)
  }

  const validCategory = validateCategory(categoryToCreate)
  
  if (!validCategory.success) {
    return c.json({ error: 'invalid data', errors: validCategory.error.flatten() }, 400)
    }

  const createdCategory = await createCategory(validCategory.data);

  return c.json(createdCategory, 201)
})

app.patch('/category/:slug', async (c) => {
  let categoryToUpdate: unknown;
  try {
    categoryToUpdate = await c.req.json();
    console.log(categoryToUpdate);
  } catch (e) {
    return c.json({ error: 'invalid json'}, 400)
  }

  if (!categoryToUpdate){
    return c.json({ error: 'category not found'}, 404)
  }

  const validCategory = validateCategory(categoryToUpdate)

  if (!validCategory.success) {
    return c.json({ error: 'invalid data', errors: validCategory.error.flatten() }, 400)
    }

  const updatedCategory = await updateCategory(validCategory.data);

  return c.json(updatedCategory, 200)

})

app.delete('/category/:slug', async (c) => {
  const slug = c.req.param('slug');
  const category = getCategory(slug);

  if(!category) {
    return c.json({ error: 'category not found'}, 404)
  }

  try {
    deleteCategory({ slug });
    
    return c.body(null, 204)
  } catch (error) {
    return c.json({ error: 'category not deleted'}, 500)
  }

})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
