/**
 * Single source of truth for all typed-data shapes (spec §6.4).
 *
 * Every typed data file in /src/data/ exports an array; this module exports
 * the matching Zod schema. The build-time validator (scripts/validate-data.ts)
 * runs all arrays through their schemas via `.parse(...)`. Vitest unit tests
 * exercise both happy and failure paths against these schemas.
 */

import { z } from 'zod';
import { ACCENT_TOKENS } from '@lib/accents';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const AccentTokenSchema = z.enum(ACCENT_TOKENS);
export const IsoDate = z.string().regex(ISO_DATE_REGEX, 'must be ISO date YYYY-MM-DD');

export const ConfidenceBoundSchema = z.object({
  lower: z.string().min(1),
  upper: z.string().min(1),
  note: z.string().optional()
});

export const MetricSchema = z.object({
  value: z.string().min(1),
  direction: z.enum(['↑', '↓', '=']).optional(),
  label: z.string().min(10, 'Metric label must be descriptive (≥10 chars)'),
  context: z.string().min(5, 'Context must identify the company/project'),
  methodology: z.string().min(10, 'Methodology must explain measurement approach').optional(),
  confidenceBound: ConfidenceBoundSchema.optional(),
  accent: AccentTokenSchema
});

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  industry: z.enum(['Healthcare', 'Energy', 'Finance', 'Consumer Tech', 'Consulting']),
  metrics: z.array(MetricSchema).min(1, 'Each experience must have at least one metric'),
  techHighlights: z.array(z.string()).min(1),
  leadershipHighlights: z.array(z.string()).optional(),
  lastVerified: IsoDate
});

export const ProjectDomain = z.enum([
  'GenAI & Agentic Systems',
  'Systems & Infrastructure',
  'ML & Data Science',
  'Data Engineering & Tooling',
  'Enterprise ML & Document Intelligence'
]);

export const ProjectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(10),
  domain: ProjectDomain,
  repoUrl: z.string().url(),
  tags: z.array(z.string()).min(1).max(8),
  accentColor: AccentTokenSchema,
  featured: z.boolean(),
  badgeLabel: z.enum(['Featured', 'Latest']).optional()
});

export const CompetencyAxisSchema = z.object({
  label: z.string().min(1),
  score: z.number().int().min(0).max(100),
  methodology: z.string().min(10, 'Methodology must provide evidence basis')
});

export const StackCategorySchema = z.object({
  name: z.string().min(1),
  accent: AccentTokenSchema,
  items: z.array(z.string()).min(1)
});

export const UpstreamPRSchema = z.object({
  repo: z.string().min(1),
  prNumber: z.union([z.number().int().positive(), z.string().min(1)]),
  title: z.string().min(1),
  url: z.string().url()
});

export type Metric = z.infer<typeof MetricSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CompetencyAxis = z.infer<typeof CompetencyAxisSchema>;
export type StackCategory = z.infer<typeof StackCategorySchema>;
export type UpstreamPR = z.infer<typeof UpstreamPRSchema>;
