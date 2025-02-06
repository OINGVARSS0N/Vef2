import { parseData, validateQuestion } from '../src/lib/parser.js';
import fs from 'fs';
import path from 'path';

test('parseData reads and parses JSON file correctly', () => {
    const testData = { test: 'data' };
    const testFilePath = path.join(process.cwd(), 'test.json');
    fs.writeFileSync(testFilePath, JSON.stringify(testData));
    expect(parseData(testFilePath)).toEqual(testData);
    fs.unlinkSync(testFilePath);
});

test('validateQuestion validates correct question', () => {
    const validQuestion = {
        question: 'What is 2+2?',
        answers: [
            { answer: '4', correct: true },
            { answer: '5', correct: false }
        ]
    };
    expect(validateQuestion(validQuestion)).toBe(true);
});

test('validateQuestion invalidates incorrect question', () => {
    const invalidQuestion = {
        question: 'What is 2+2?',
        answers: [
            { answer: '4' },
            { answer: '5', correct: false }
        ]
    };
    expect(validateQuestion(invalidQuestion)).toBe(false);
});