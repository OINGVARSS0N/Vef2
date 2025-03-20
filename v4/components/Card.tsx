import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  className?: string;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={twMerge(
        'rounded-md border bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}
const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={twMerge(
        'flex flex-col space-y-1.5 p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardTitleProps {
    className?: string;
    children: ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({ className, children, ...props }) => {
  return (
    <h3
      className={twMerge(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

interface CardDescriptionProps{
    className?: string;
    children: ReactNode;
}
const CardDescription: React.FC<CardDescriptionProps> = ({className, children, ...props}) => {
    return(
        <p
        className={twMerge(
            "text-sm text-muted-foreground",
            className
        )}
        {...props}
        >
            {children}
        </p>
    )
}

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => {
  return (
    <div className={twMerge('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
