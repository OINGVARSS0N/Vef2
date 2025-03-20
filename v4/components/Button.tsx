import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  className?: string;
  asChild?: boolean; // Add asChild support
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'; // Allow dynamic element rendering

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

    const allClasses = twMerge(clsx(baseClasses, variantClasses(), className));

    return (
      <Comp ref={ref} className={allClasses} {...props}>
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button'; // Required for React.forwardRef

export { Button };
