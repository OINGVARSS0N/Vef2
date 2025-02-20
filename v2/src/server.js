import express from 'express';
import { router } from './routes.js';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));

// Fix `views` path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsPath = path.join(__dirname, "views");

app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.use('/', router);

const port = process.env.PORT || 3000;
const hostname = '127.0.0.1';

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
