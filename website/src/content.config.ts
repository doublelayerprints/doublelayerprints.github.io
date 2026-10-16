import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Ogni pezzo ha due file: slug.it.md e slug.en.md
const works = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/works',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['figures', 'home', 'tools', 'art']),
    origin: z.enum(['original', 'remix']).default('original'),
    materials: z.string().optional(),
    dimensions: z.string().optional(),
    layerHeight: z.string().optional(),
    weight: z.string().optional(),
    printTime: z.string().optional(),
    photos: z.array(z.string()).min(1),
    alt: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { works };
