#!/usr/bin/env tsx
/**
 * Build-time Zod validation for typed data (spec §6.4).
 *
 * Phase 1 stub: data layer is bootstrapped in Phase 2. This stub keeps the
 * `prebuild` hook green until the real schemas + data land.
 *
 * When Phase 2 lands, this file will import all arrays from src/data/*.ts
 * and parse them through their respective Zod schemas, halting the build
 * with a descriptive error on any failure.
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

async function validate(): Promise<void> {
  const dataDir = resolve(process.cwd(), 'src', 'data');
  const schemasFile = resolve(dataDir, 'schemas.ts');

  if (!existsSync(schemasFile)) {
    console.info('[validate-data] no src/data/schemas.ts yet — skipping (Phase 2 will populate).');
    return;
  }

  // Dynamically import and validate each data module once schemas.ts exists.
  const [{ metrics }, { experiences }, { projects }, { competencyAxes }] = await Promise.all([
    import('../src/data/metrics.ts'),
    import('../src/data/experiences.ts'),
    import('../src/data/projects.ts'),
    import('../src/data/competency.ts')
  ]);

  const { MetricSchema, ExperienceSchema, ProjectSchema, CompetencyAxisSchema } = await import(
    '../src/data/schemas.ts'
  );

  let errors = 0;
  const parseArray = <T>(
    name: string,
    arr: T[],
    schema: { parse: (x: unknown) => unknown }
  ): void => {
    arr.forEach((item, idx) => {
      try {
        schema.parse(item);
      } catch (err) {
        errors += 1;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[validate-data] ${name}[${idx}] FAILED:\n${msg}`);
      }
    });
  };

  parseArray('metrics', metrics, MetricSchema);
  parseArray('experiences', experiences, ExperienceSchema);
  parseArray('projects', projects, ProjectSchema);
  parseArray('competencyAxes', competencyAxes, CompetencyAxisSchema);

  if (errors > 0) {
    console.error(`[validate-data] ${errors} validation error(s) — aborting build.`);
    process.exit(1);
  }

  console.info('[validate-data] All typed data valid.');
}

validate().catch((err) => {
  console.error('[validate-data] unexpected error:', err);
  process.exit(1);
});
