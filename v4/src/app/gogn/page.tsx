'use client'

import React, { useState } from 'react';
import Layout from '@/app/layout';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Form } from '../../../components/Form';
import { Card, CardContent } from '../../../components/Card';

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

const DataPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          alert(`Villa: ${errorData.message || 'Óþekkt villa'}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (parseError) {
          alert(`Villa: ${text || 'Óþekkt villa'}`);
        }
        return;
      }

      const result = await response.json();
      console.log('Svar frá vefþjónustu:', result);
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Villa við að senda gögn:', error);
      alert('Villa við að senda gögn. Vinsamlegast reyndu aftur.');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Vinsamlegast gefðu upp nafn á flokki.');
      return;
    }

    try {
      const newCategory: Category = {
        id: Date.now(),
        name: newCategoryName,
        slug: newCategoryName.toLowerCase().replace(/ /g, '-'),
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Villa við að búa til flokk:', error);
      alert('Villa við að búa til flokk.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      setCategories(categories.filter((c) => c.id !== id));
      if (editingCategory?.id === id) {
        setEditingCategory(null);
        setEditedCategoryName('');
      }
    } catch (error) {
      console.error('Villa við að eyða flokki:', error);
      alert('Villa við að eyða flokki.');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditedCategoryName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editedCategoryName.trim()) {
      alert('Vinsamlegast gefðu upp nýtt nafn á flokki.');
      return;
    }
    try {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory?.id
            ? { ...c, name: editedCategoryName, slug: editedCategoryName.toLowerCase().replace(/ /g, '-') }
            : c,
        ),
      );
      setEditingCategory(null);
      setEditedCategoryName('');
    } catch (error) {
      console.error('Villa við að uppfæra flokk:', error);
      alert('Villa við að uppfæra flokk.');
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h2 className="text-3xl font-semibold text-gray-800">Vinna með Gögn</h2>
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Búa til/Breyta/Eyða Flokki
          </h3>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Nafn á nýjum flokki"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mr-2"
            />
            <Button onClick={handleAddCategory}>Búa til flokk</Button>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-700">Flokkar:</h4>
            <ul>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between py-2 border-b border-gray-200"
                >
                  {editingCategory?.id === category.id ? (
                    <>
                      <Input
                        type="text"
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        className="mr-2"
                      />
                      <Button onClick={handleUpdateCategory}>Uppfæra</Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(null);
                          setEditedCategoryName('');
                        }}
                      >
                        Hætta við
                      </Button>
                    </>
                  ) : (
                    <>
                      <span>{category.name}</span>
                      <div>
                        <Button variant="outline" onClick={() => handleEditCategory(category)}>
                          Breyta
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Eyða
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Búa til Spurningu með Svörum</h3>
          <Card>
            <CardContent>
              {formSubmitted ? (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Tókst!</strong>
                  <span className="block sm:inline">Spurning hefur verið búin til.</span>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    label="Nafn"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nafn"
                    className="mb-4"
                  />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="mb-6"
                  />
                  <Button type="submit">Senda</Button>
                </Form>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default DataPage;
