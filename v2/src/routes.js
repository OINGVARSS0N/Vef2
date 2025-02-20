import express from 'express';
import { getDatabase } from './lib/db.client.js';
import { environment } from './lib/enviroment.js';
import { logger } from './lib/logger.js';
import xss from 'xss';

export const router = express.Router();

// Homepage: List categories
router.get('/', async (req, res) => {
  const result = await getDatabase()?.query('SELECT * FROM categories');

  const categories = result?.rows ?? [];

  console.log(categories);
  res.render('index', { title: 'Forsíða', categories });
});

// Category page: List questions in category (TODO: Fetch real data)
router.get('/spurningar/:category', async (req, res) => {
  const title = req.params.category;
  
  try {
    const result = await getDatabase()?.query(
      'SELECT * FROM questions WHERE category_id = (SELECT id FROM categories WHERE name = $1)', 
      [title]
    );
    const questions = result?.rows ?? [];

    res.render('category', { title, questions });
  } catch (error) {
    logger.error('Database error:', error);
    res.status(500).render('error', { title: 'Villa', message: 'Ekki tókst að sækja spurningar.' });
  }
});

// Show form to create a new category
router.get('/form', (req, res) => {
  res.render('form', { title: 'Búa til flokk', errors: [] });
});

// Handle form submission (Create new category)
router.post('/form', async (req, res) => {
  let { name } = req.body;
  name = xss(name?.trim()); // Sanitize input
  
  const errors = [];

  // **Validation Rules**
  if (!name) errors.push('Flokksheiti má ekki vera tómt.');
  if (name.length < 3) errors.push('Flokksheiti verður að vera minnst 3 stafir.');
  if (name.length > 100) errors.push('Flokksheiti má ekki vera lengra en 100 stafir.');
  
  if (errors.length > 0) {
    return res.render('form', { title: 'Búa til flokk', errors });
  }

  try {
    const db = getDatabase();
    
    const result = await db?.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [name]);
    if (result?.rowCount === 1) {
      res.render('form-created', { title: 'Flokkur búinn til', name });
    } else {
      res.status(500).render('error', { title: 'Villa', message: 'Ekki tókst að bæta við flokk.' });
    }
  } catch (error) {
    logger.error('Database error:', error);
    res.status(500).render('error', { title: 'Villa', message: 'Gat ekki tengst gagnagrunni.' });
  }
});
