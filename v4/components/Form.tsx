import React, { ReactNode, FormHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge'; // Import twMerge
import { clsx } from 'clsx';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({ children, className, ...props }) => {
  return (
    <form
      className={twMerge(clsx('space-y-6', className))} // Use twMerge and clsx
      {...props}
    >
      {children}
    </form>
  );
};

export { Form };
