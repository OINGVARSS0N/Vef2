// List.tsx
import React from 'react';
import { Button } from './Button'; // Import the local Button component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface ListItem {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  [key: string]: any;
}

interface ListProps {
  items: ListItem[];
  title?: string;
  onItemClick?: (item: ListItem) => void;
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
                <Button asChild variant="link" className="p-0">
                  <a href={`/categories/${item.slug}`}>Skoða nánar</a>
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



// Button.tsx
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  className?: string;
  asChild?: boolean; // Add the asChild prop to your ButtonProps
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  className,
  asChild = false, // Provide a default value
  ...props
}) => {
  const baseClasses =
    'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200';

  const variantClasses = () => {
    switch (variant) {
      case 'default':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'outline':
        return 'border border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600';
      case 'ghost':
        return 'text-gray-700 hover:bg-gray-100';
      case 'link':
        return 'text-blue-500 hover:underline p-0';
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600';
    }
  };

  const allClasses = twMerge(clsx(baseClasses, variantClasses(), className) as ClassValue[]);

  if (asChild && children) {
    // IMPORTANT:  Check if children exists.
    const child = React.Children.only(children); // Ensure only one child
    return React.cloneElement(child as React.ReactElement, {
      // Spread the original props first, so className can be overridden
      ...props,
      className: twMerge(
        child.props.className, // Preserve original child classes
        allClasses,
      ),
    });
  }

  return (
    <button {...props} className={allClasses}>
      {children}
    </button>
  );
};

export { Button };
