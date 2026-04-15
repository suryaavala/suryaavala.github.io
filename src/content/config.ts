/**
 * Astro Content Collections — frontmatter Zod schema (spec §6.1).
 *
 * Defines a single 'notes' collection. The CI/CD pipeline never deploys
 * malformed pages: any required field missing in MDX frontmatter throws
 * during `astro check` / `astro build`.
 *
 * Categories are a closed enum on purpose — adding a new category is a
 * deliberate spec change, not a typo. Same logic for `requiresMath`: explicit
 * boolean drives the conditional KaTeX CSS load in NoteLayout.
 */

import { z, defineCollection } from 'astro:content';

const notesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(100, 'Title must be under 100 characters'),
    publishDate: z.coerce.date(),
    description: z
      .string()
      .min(50, 'Description must be at least 50 characters for SEO')
      .max(180, 'Description must be under 180 characters for SEO'),
    tags: z.array(z.string()).min(1).max(5),
    category: z.enum([
      'Healthcare & Clinical NLP',
      'Energy & Time-Series',
      'Recommender Systems',
      'Distributed Systems',
      'GenAI Architecture',
      'Mathematical Substrates',
      'Philosophy & Public Policy'
    ]),
    /** Optional anchor to real production experience. */
    commercialContext: z.string().optional(),
    isDraft: z.boolean().default(false),
    /** When true, NoteLayout injects /katex.min.css. Off by default. */
    requiresMath: z.boolean().default(false)
  })
});

export const collections = { notes: notesCollection };
