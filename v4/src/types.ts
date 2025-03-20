export interface Category {
    id: number;
    name: string;
    slug: string; // Make sure slug is required here
    description?: string; // Description is optional
    [key: string]: unknown; // Allow other properties
  }
  