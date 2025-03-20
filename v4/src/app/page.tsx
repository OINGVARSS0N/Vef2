'use client'; // Mark this component as a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js's useRouter for navigation
import Layout from './layout';
import { List } from '../../components/List';
import { Category } from '../types'; // Import shared Category type

const initialCategories: Category[] = [
  { id: 1, name: 'Flokkur 1', slug: 'flokkur-1' },
  { id: 2, name: 'Flokkur 2', slug: 'flokkur-2' },
  { id: 3, name: 'Flokkur 3', slug: 'flokkur-3' },
];

const HomePage = () => {
  const router = useRouter(); // Initialize the router

  const handleItemClick = (category: Category) => {
    router.push(`/flokkar/${category.slug}`); // Use router.push for navigation
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Velkomin á vefsíðuna mína</h2>
        <p className="mt-2 text-gray-600">
          Þetta er forsíðan. Hér eru flokkarnir:
        </p>
      </div>
      <List
        items={initialCategories}
        title="Flokkar"
        onItemClick={handleItemClick} 
      />
    </Layout>
  );
};

export default HomePage;
