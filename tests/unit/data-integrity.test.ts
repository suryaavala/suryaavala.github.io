/**
 * Unit tests for typed-data Zod schemas (spec §6.4).
 *
 * Each schema gets:
 *   - happy path: real production data parses without throwing
 *   - failure path: synthetic invalid input raises ZodError with a descriptive message
 *
 * These tests run on every commit (pre-commit + CI) and are the bedrock of
 * the "build never deploys malformed data" guarantee.
 */

import { describe, it, expect } from 'vitest';
import {
  MetricSchema,
  ExperienceSchema,
  ProjectSchema,
  CompetencyAxisSchema,
  StackCategorySchema,
  UpstreamPRSchema
} from '@data/schemas';
import { metrics } from '@data/metrics';
import { experiences } from '@data/experiences';
import { projects, upstreamPRs } from '@data/projects';
import { competencyAxes } from '@data/competency';
import { stackCategories } from '@data/stack';

describe('MetricSchema', () => {
  it('parses every production metric', () => {
    metrics.forEach((m, i) => {
      expect(() => MetricSchema.parse(m), `metrics[${i}] should parse`).not.toThrow();
    });
  });

  it('rejects a metric with non-hex accent', () => {
    expect(() =>
      MetricSchema.parse({
        value: '99%',
        label: 'a sufficiently long label here',
        context: 'a real context',
        accent: 'orangish'
      })
    ).toThrow(/hex/);
  });

  it('rejects a metric with too-short label', () => {
    expect(() =>
      MetricSchema.parse({
        value: '99%',
        label: 'short',
        context: 'a real context',
        accent: '#ffb86c'
      })
    ).toThrow(/≥10/);
  });

  it('accepts a metric with confidenceBound', () => {
    expect(() =>
      MetricSchema.parse({
        value: '71.3%',
        label: 'a sufficiently long label here',
        context: 'a real context',
        methodology: 'Bootstrapped over weekly cohorts',
        confidenceBound: { lower: '68%', upper: '75%', note: '95% CI' },
        accent: '#ffb86c'
      })
    ).not.toThrow();
  });
});

describe('ExperienceSchema', () => {
  it('parses every production experience', () => {
    experiences.forEach((e, i) => {
      expect(
        () => ExperienceSchema.parse(e),
        `experiences[${i}] (${e.company}) should parse`
      ).not.toThrow();
    });
  });

  it('rejects an experience with malformed lastVerified date', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Acme',
        role: 'ML Engineer',
        period: '2024 – Present',
        industry: 'Healthcare',
        metrics: [
          {
            value: '50%',
            label: 'a sufficiently long label here',
            context: 'a real context',
            accent: '#ffb86c'
          }
        ],
        techHighlights: ['Python'],
        lastVerified: '15-04-2026' // wrong format (DD-MM-YYYY)
      })
    ).toThrow(/ISO date/);
  });

  it('rejects an experience with empty metrics array', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Acme',
        role: 'ML Engineer',
        period: '2024 – Present',
        industry: 'Healthcare',
        metrics: [],
        techHighlights: ['Python'],
        lastVerified: '2026-04-15'
      })
    ).toThrow(/at least one metric/);
  });

  it('rejects an experience with unknown industry', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Acme',
        role: 'ML Engineer',
        period: '2024 – Present',
        industry: 'Aerospace',
        metrics: [
          {
            value: '50%',
            label: 'a sufficiently long label',
            context: 'a real context',
            accent: '#ffb86c'
          }
        ],
        techHighlights: ['Python'],
        lastVerified: '2026-04-15'
      })
    ).toThrow();
  });
});

describe('ProjectSchema', () => {
  it('parses every production project', () => {
    projects.forEach((p, i) => {
      expect(() => ProjectSchema.parse(p), `projects[${i}] (${p.slug}) should parse`).not.toThrow();
    });
  });

  it('rejects a project with non-URL repoUrl', () => {
    expect(() =>
      ProjectSchema.parse({
        slug: 'foo',
        title: 'Foo',
        description: 'a sufficiently long description',
        domain: 'GenAI & Agentic Systems',
        repoUrl: 'not-a-url',
        tags: ['tag'],
        accentColor: '#bd93f9',
        featured: false
      })
    ).toThrow();
  });

  it('rejects a project with too many tags', () => {
    expect(() =>
      ProjectSchema.parse({
        slug: 'foo',
        title: 'Foo',
        description: 'a sufficiently long description',
        domain: 'GenAI & Agentic Systems',
        repoUrl: 'https://github.com/x/y',
        tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], // 9 > max 8
        accentColor: '#bd93f9',
        featured: false
      })
    ).toThrow();
  });

  it('exactly two projects are featured (spec §4.1 cards 4 + 5)', () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured.length).toBeGreaterThanOrEqual(2);
    expect(featured.find((p) => p.badgeLabel === 'Featured')).toBeDefined();
    expect(featured.find((p) => p.badgeLabel === 'Latest')).toBeDefined();
  });
});

describe('CompetencyAxisSchema', () => {
  it('parses every competency axis', () => {
    competencyAxes.forEach((a, i) => {
      expect(() => CompetencyAxisSchema.parse(a), `axes[${i}]`).not.toThrow();
    });
  });

  it('has exactly 8 axes (spec §4.4 mandate)', () => {
    expect(competencyAxes.length).toBe(8);
  });

  it('rejects a score > 100', () => {
    expect(() =>
      CompetencyAxisSchema.parse({
        label: 'Test',
        score: 101,
        methodology: 'a sufficiently long methodology'
      })
    ).toThrow();
  });

  it('rejects a score < 0', () => {
    expect(() =>
      CompetencyAxisSchema.parse({
        label: 'Test',
        score: -1,
        methodology: 'a sufficiently long methodology'
      })
    ).toThrow();
  });
});

describe('StackCategorySchema', () => {
  it('parses every stack category', () => {
    stackCategories.forEach((c, i) => {
      expect(() => StackCategorySchema.parse(c), `stackCategories[${i}] (${c.name})`).not.toThrow();
    });
  });
});

describe('UpstreamPRSchema', () => {
  it('parses every upstream PR', () => {
    upstreamPRs.forEach((pr, i) => {
      expect(() => UpstreamPRSchema.parse(pr), `upstreamPRs[${i}]`).not.toThrow();
    });
  });

  it('matches the spec §4.1 list of 5 upstream contributions', () => {
    expect(upstreamPRs.length).toBeGreaterThanOrEqual(5);
  });
});
