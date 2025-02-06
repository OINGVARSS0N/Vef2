import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Leið til að fá __dirname í ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mappa þar sem JSON skrárnar eru geymdar
const dataDir = path.join(__dirname, '..', 'data');

// Mappa þar sem HTML skrárnar verða búnar til
const buildDir = path.join(__dirname, '..', 'dist');

function parseHTMLToString(html){
  if(html) {
    return html.replace(/</g, "&lt;").replace(/>/g, "&gt;"); 
  }
}
// Fall til að búa til index.html
const generateIndexFile = async (index) => {
  try {
    // Filter out invalid entries (missing title or file)
    const validIndex = index.filter(item => item.title && item.file);

    const indexContent = `
      <!DOCTYPE html>
      <html lang="is">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Spurningaflokkar</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          h1 {
            text-align: left;
          }
          .quiz-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
          }
          .quiz-list li {
            margin: 1em 0;
            padding: 1em;
            border: 1px solid #ccc;
            text-align: left;
          }
          .quiz-list a {
            text-decoration: none;
            color: #007bff;
            font-size: 1.2em;
          }
          .quiz-list a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Spurningaflokkar</h1>
        <ul class="quiz-list">
          ${validIndex.map(item => `
            <li>
              <a href="${item.title.toLowerCase().replace(/\s+/g, '-')}.html">${item.title}</a>
            </li>
          `).join('')}
        </ul>
      </body>
      </html>
    `;

    const indexPath = path.join(buildDir, 'index.html');
    await fs.writeFile(indexPath, indexContent);
    console.log(`Búin til skrá: ${indexPath}`);
  } catch (error) {
    console.error('Villa við að búa til index.html:', error);
  }
};

const quizTemplate = (title, questions) => `
  <!DOCTYPE html>
  <html lang="is">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: left; padding: 10px; font-size: 16px; }
      .question { margin-bottom: 1em; }
      .answers { list-style: none; padding: 0; margin: 5px 0; }
      .answers li { margin: 5px 0; }
      .answer-button {
        padding: 8px 12px;
        border: 1px solid black;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        background: white;
        color: black;
        display: block;
        margin: 0;
      }
      .answer-button:hover { background: #ddd; }
      .feedback {
        margin-top: 5px;
        font-weight: bold;
        font-size: 14px;
      }
      .correct { color: green; }
      .incorrect { color: red; }
      .back-button {
        margin-top: 20px;
        padding: 8px;
        background: #ccc;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
      }
      .back-button:hover { background: #aaa; }
    </style>
  </head>
  <body>
    <h1 style="font-size: 20px;">${title}</h1>
    ${questions.map((q, qIndex) => `
      <div class="question">
        <p style="margin-bottom: 5px;">${q.question}</p>
        <ul class="answers">
          ${q.answers.map((a, index) => `
            <li>
              <button class="answer-button" onclick="checkAnswer(${qIndex}, ${index}, ${a.correct})">
                ${parseHTMLToString(a.answer)}
              
              </button>
              
              <p class="feedback" id="feedback-${qIndex}-${index}"></p>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('')}
    <button class="back-button" onclick="window.location.href='index.html'">Til baka</button>
    <script>
      function checkAnswer(qIndex, aIndex, isCorrect) {
        const feedbackElement = document.getElementById('feedback-' + qIndex + '-' + aIndex);
        if (isCorrect) {
          feedbackElement.textContent = "✔ Rétt!";
          feedbackElement.className = "feedback correct";
        } else {
          feedbackElement.textContent = "✘ Rangt!";
          feedbackElement.className = "feedback incorrect";
        }
      }
    </script>
  </body>
  </html>
`;


// Fall til að lesa og vinna úr JSON skrám
const processQuizFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const quiz = JSON.parse(data);

    // Athuga hvort gögnin séu gild
    if (!quiz.title || !Array.isArray(quiz.questions)) {
      console.error(`Ógild gögn í skrá: ${filePath}`);
      return null;
    }

    // Vinna úr spurningum og svörum
    const validQuestions = quiz.questions.filter(q => 
      q.question && Array.isArray(q.answers) && q.answers.some(a => a.answer && typeof a.correct === 'boolean')
    );

    if (validQuestions.length === 0) {
      console.error(`Engar gildar spurningar í skrá: ${filePath}`);
      return null;
    }

    return {
      title: quiz.title,
      questions: validQuestions
    };
  } catch (error) {
    console.error(`Villa við að lesa skrá: ${filePath}`, error);
    return null;
  }
};

// Fall til að búa til HTML skrár fyrir hvern spurningaflokk
const generateHTMLFiles = async (index) => {
  try {
    await fs.mkdir(buildDir, { recursive: true }); // Búa til build möppu ef hún er ekki til

    for (const item of index) {
      if (item.title && item.file) {
        const filePath = path.join(dataDir, item.file);
        const quiz = await processQuizFile(filePath);

        if (quiz) {
          const htmlContent = quizTemplate(quiz.title, quiz.questions);
          const htmlFilePath = path.join(buildDir, `${item.title.toLowerCase().replace(/\s+/g, '-')}.html`);
          await fs.writeFile(htmlFilePath, htmlContent);
          console.log(`Búin til skrá: ${htmlFilePath}`);
        }
      } else {
        console.error(`Ógild færsla í index.json: ${JSON.stringify(item)}`);
      }
    }
  } catch (error) {
    console.error('Villa við að búa til HTML skrár:', error);
  }
};

async function doesFileExist(ind) {
  try {
    await fs.readFile(path.join(dataDir, ind.file), 'utf8')
    return true
  } catch {
    console.log("File does not exist. Removing from index list")
    return false
  }
}

// Aðalforrit
const main = async () => {
  try {
    const indexFilePath = path.join(dataDir, 'index.json');
    const indexData = JSON.parse(await fs.readFile(indexFilePath, 'utf8'))
    let index = []
    for (const ind of indexData) {
      const fileExists = await doesFileExist(ind)
      if (fileExists) {
        index.push(ind)
      }
    }

    if (Array.isArray(index)) {
      console.log(index)
      await generateHTMLFiles(index);
      await generateIndexFile(index); // Búa til index.html
    } else {
      console.error('index.json inniheldur ekki fylki.');
    }
  } catch (error) {
    console.error('Villa við að lesa index.json', error);
  }
};

// Keyra aðalforritið
main();