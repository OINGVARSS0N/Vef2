import React from 'react';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';

interface ListItem {
  id: number;
  name: string;
  slug?: string; // Slug is optional
  description?: string; // Description is optional
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}

interface ListProps {
  items: ListItem[];
  title?: string; // Optional title
  onItemClick?: (item: ListItem) => void; // Optional click handler
}

const List: React.FC<ListProps> = ({ items, title, onItemClick }) => {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              {item.description && (
                <CardDescription>{item.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {onItemClick ? (
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => onItemClick(item)}
                >
                  Skoða nánar
                </Button>
              ) : item.slug ? (
                <Button asChild>
                  <a href={`/categories/${item.slug}`} className='btn'>Skoða nánar</a>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { List };
