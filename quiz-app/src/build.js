import { parseData, validateQuestion, generateHTML } from './lib/parser.js';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const indexData = parseData(path.join(dataDir, 'index.json'));
if (indexData && Array.isArray(indexData)) {
    indexData.forEach((category) => {
        // Athuga hvort færsla sé gild
        if (category && category.file && category.title) {
            const filePath = path.join(dataDir, category.file);
            // Athuga hvort skrá sé til
            if (fs.existsSync(filePath)) {
                const categoryData = parseData(filePath);
                if (categoryData && categoryData.questions) {
                    const validQuestions = categoryData.questions.filter(validateQuestion);
                    if (validQuestions.length > 0) {
                        const html = generateHTML(validQuestions, category.title);
                        fs.writeFileSync(path.join(distDir, `${category.title.toLowerCase()}.html`), html);
                    } else {
                        console.error(`Engar gildar spurningar í skrá: ${category.file}`);
                    }
                } else {
                    console.error(`Ógild gögn í skrá: ${category.file}`);
                }
            } else {
                console.error(`Skrá finnst ekki: ${category.file}`);
            }
        } else {
            console.error('Ógild færsla í index.json:', category);
        }
    });
} else {
    console.error('index.json inniheldur ekki gild gögn.');
}