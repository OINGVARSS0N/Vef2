import { parseData, validateQuestion, generateHTML } from './lib/parser.js';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const indexData = parseData(path.join(dataDir, 'index.json'));
if (indexData) {
    indexData.forEach(category => {
        const categoryData = parseData(path.join(dataDir, category.file));
        if (categoryData && categoryData.questions) {
            const validQuestions = categoryData.questions.filter(validateQuestion);
            const html = generateHTML(validQuestions, category.title);
            fs.writeFileSync(path.join(distDir, `${category.title.toLowerCase()}.html`), html);
        }
    });
}