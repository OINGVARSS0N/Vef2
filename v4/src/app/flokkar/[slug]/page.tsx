'use client'

import React, { useState } from 'react';
import Layout from '@/app/layout';
import { List } from 'components/List';
import { Detail } from 'components/Detail';
import { notFound } from 'next/navigation';
import { Button } from 'components/Button';

interface Answer {
  id: number;
  text: string;
  correct: boolean;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ListItem {
    id: number;
    name: string;
    slug?: string;
    description?: string;
}

// Define the PageProps type
interface PageProps {
  params: {
    slug: string;
  };
}

const initialCategories: Category[] = [
  { id: 1, name: 'Flokkur 1', slug: 'flokkur-1' },
  { id: 2, name: 'Flokkur 2', slug: 'flokkur-2' },
  { id: 3, name: 'Flokkur 3', slug: 'flokkur-3' },
];

const initialQuestions: Question[] = [
    {
      id: 1,
      text: 'Hvað er höfuðborg Íslands?',
      answers: [
        { id: 1, text: 'Reykjavík', correct: true },
        { id: 2, text: 'Kópavogur', correct: false },
        { id: 3, text: 'Hafnarfjörður', correct: false },
      ],
        name: "Hvað er höfuðborg Íslands?"
    },
    {
        id: 2,
        text: "Hvað er hæsta fjall Íslands?",
        answers: [
            {id: 4, text: "Snæfell", correct: false},
            {id: 5, text: "Herðubreið", correct: false},
            {id: 6, text: "Hálfdán", correct: false},
            {id: 7, text: "Hvannadalshnúkur", correct: true}
        ],
        name: "Hvað er hæsta fjall Íslands?"
    }
];

const getQuestionsByCategorySlug = (slug: string) => {
  if (slug === 'flokkur-1') {
    return [initialQuestions[0]];
  }
    if (slug === 'flokkur-2') {
        return [initialQuestions[1]];
    }
  return [];
};

const CategoryPage = ({ params }: PageProps) => {
  const [selectedItem, setSelectedItem] = useState<Question | null>(null);

  const { slug } = params;

  const category = initialCategories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const questions = getQuestionsByCategorySlug(slug);

    const handleItemClick = (item: ListItem) => {
        const selectedQuestion = questions.find(q => q.name === item.name);
        if(selectedQuestion){
             setSelectedItem(selectedQuestion);
        }

    };

    const handleBackToList = () => {
        setSelectedItem(null);
    };

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Flokkur: {category.name}</h2>
        <p className="mt-2 text-gray-600">Spurningar í þessum flokki:</p>
      </div>
        {selectedItem ? (
            <div
            >
                <Detail question={selectedItem} />
                <Button onClick={handleBackToList} variant="outline" className="mt-4">
                    Til baka í lista
                </Button>
            </div>
        ) : (
            <List
              items={questions.map(q => ({
                id: q.id,
                name: q.name,
                description: q.text
              }))}
              title={`Spurningar í ${category.name}`}
              onItemClick={handleItemClick}
            />
        )}
    </Layout>
  );
};

export default CategoryPage;
