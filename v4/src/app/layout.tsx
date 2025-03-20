import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css'; // Import your global styles if you have them

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
