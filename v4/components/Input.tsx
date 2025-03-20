import React, { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge'; // Correct import
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        className={twMerge( // Use twMerge here
          clsx(
            'w-full px-4 py-2 rounded-md border shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500',
            className,
          ),
        )}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export { Input };
