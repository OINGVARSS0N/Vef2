import React from 'react';
import Layout from './layout';
import { List } from '../../components/List';

interface Category {
  id: number;
  name: string;
  slug: string;
}

const initialCategories: Category[] = [
  { id: 1, name: 'Flokkur 1', slug: 'flokkur-1' },
  { id: 2, name: 'Flokkur 2', slug: 'flokkur-2' },
  { id: 3, name: 'Flokkur 3', slug: 'flokkur-3' },
];

const HomePage = () => {
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
        onItemClick={(category) => {
          window.location.href = `/flokkar/${category.slug}`;
        }}
      />
    </Layout>
  );
};

export default HomePage;
