#!/usr/bin/env tsx
/**
 * Content staleness guard (spec §6.3 item 5).
 *
 * Walks all typed data with a `lastVerified` field and emits a WARNING
 * (not a build failure) if any entry is older than CONTENT_STALE_DAYS
 * (default 90). Output goes to GITHUB_STEP_SUMMARY when running in GitHub
 * Actions so maintainers see it without gating deploys.
 *
 * Phase 1 stub: data layer is bootstrapped in Phase 2; this script no-ops
 * gracefully until then.
 */

import { existsSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';

const STALE_DAYS = Number(process.env.CONTENT_STALE_DAYS ?? 90);

function warn(msg: string): void {
  console.warn(`[check-staleness] ${msg}`);
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary) {
    appendFileSync(summary, `:warning: **Content staleness**: ${msg}\n`);
  }
}

async function main(): Promise<void> {
  const dataDir = resolve(process.cwd(), 'src', 'data');
  const experiencesFile = resolve(dataDir, 'experiences.ts');

  if (!existsSync(experiencesFile)) {
    console.info('[check-staleness] no src/data/experiences.ts yet — skipping (Phase 2).');
    return;
  }

  const { experiences } = await import('../src/data/experiences.ts');
  const now = Date.now();
  const thresholdMs = STALE_DAYS * 24 * 60 * 60 * 1000;
  let stale = 0;

  for (const exp of experiences) {
    const ts = Date.parse(exp.lastVerified);
    if (Number.isNaN(ts)) {
      warn(`${exp.company}: invalid lastVerified date "${exp.lastVerified}"`);
      stale += 1;
      continue;
    }
    if (now - ts > thresholdMs) {
      const ageDays = Math.floor((now - ts) / (24 * 60 * 60 * 1000));
      warn(`${exp.company}: lastVerified is ${ageDays} days old (> ${STALE_DAYS})`);
      stale += 1;
    }
  }

  if (stale === 0) {
    console.info(`[check-staleness] All experiences verified within ${STALE_DAYS} days.`);
  }
}

main().catch((err) => {
  console.error('[check-staleness] unexpected error:', err);
  // non-fatal
  process.exit(0);
});
