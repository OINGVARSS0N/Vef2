import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { twMerge } from 'tailwind-merge'; // Import twMerge
import { clsx } from 'clsx';

interface Answer {
  id: number;
  text: string;
  correct: boolean;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

interface DetailProps {
  question: Question;
}

const Detail: React.FC<DetailProps> = ({ question }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{question.text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <h3 className="text-lg font-semibold">Svör:</h3>
        {question.answers.map((answer) => (
          <div
            key={answer.id}
            className={twMerge(clsx( // Use twMerge and clsx
              'p-2 rounded',
              answer.correct
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-gray-100 border border-gray-400 text-gray-700',
            ))}
          >
            {answer.text}
            {answer.correct && <span className="ml-2 font-bold">(Rétt)</span>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export { Detail };
