import fs from 'fs';
import path from 'path';

export function parseData(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        console.error(`Error reading or parsing file ${filePath}:`, error);
        return null;
    }
}

export function validateQuestion(question) {
    return question && question.question && question.answers && question.answers.every(answer => answer.answer !== undefined && answer.correct !== undefined);
}

export function generateHTML(questions, title) {
    let html = `<!DOCTYPE html>
<html lang="is">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <h1>${title}</h1>
    <form>
`;

    questions.forEach((question, index) => {
        html += `<fieldset>
            <legend>${question.question}</legend>
`;
        question.answers.forEach((answer, ansIndex) => {
            html += `<label>
                <input type="radio" name="question${index}" value="${ansIndex}">
                ${answer.answer}
            </label><br>
`;
        });
        html += `</fieldset>
`;
    });

    html += `<button type="button" onclick="checkAnswers()">Staðfesta svör</button>
    </form>
    <script>
        function checkAnswers() {
            const questions = ${JSON.stringify(questions)};
            questions.forEach((question, index) => {
                const selected = document.querySelector(\`input[name="question\${index}"]:checked\`);
                if (selected) {
                    const answerIndex = parseInt(selected.value);
                    if (question.answers[answerIndex].correct) {
                        alert(\`Spurning \${index + 1}: Rétt!\`);
                    } else {
                        alert(\`Spurning \${index + 1}: Rangt!\`);
                    }
                } else {
                    alert(\`Spurning \${index + 1}: Ekkert svar valið!\`);
                }
            });
        }
    </script>
</body>
</html>
`;
    return html;
}