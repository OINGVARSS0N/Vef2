import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID, // Your Sanity project ID
  dataset: process.env.SANITY_DATASET || 'production', // Your dataset name
  apiVersion: '2023-05-03', // Use current date
  useCdn: false, // Important for fresh data in preview mode
})