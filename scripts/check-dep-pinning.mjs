#!/usr/bin/env node
/**
 * Strict dependency-pinning gate (plan §key decision #6).
 *
 * Walks `dependencies` and `devDependencies` in package.json and rejects ANY
 * non-exact version specifier — `^`, `~`, `>=`, `<`, `||`, ` - ` ranges, `*`,
 * `latest`, git URLs, and other tags. Uses `semver.valid(version)` as the
 * single source of truth: it returns the canonical exact-version string only
 * when the input is a single valid semver, and `null` for any range.
 *
 * Catches:
 *   - "^4.16.18"  → range
 *   - "~4.16"     → range
 *   - ">=20.12.0" → range
 *   - "*"         → wildcard
 *   - "latest"    → tag
 *   - "github:..."→ git URL
 *
 * Allows:
 *   - "4.16.18"
 *   - "4.16.18-rc.1"
 *
 * Exits 1 with the offending entries on first violation; exits 0 otherwise.
 *
 * The `engines` block is intentionally exempted — Node version constraints
 * use range syntax legitimately (project supports any Node ≥ 20.12.0).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import semver from 'semver';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, '..', 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const blocks = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const violations = [];

for (const block of blocks) {
  const entries = pkg[block];
  if (!entries) continue;
  for (const [name, version] of Object.entries(entries)) {
    // semver.valid returns null for ranges. We require a clean exact version.
    if (semver.valid(version) === null) {
      violations.push({ block, name, version });
    }
  }
}

if (violations.length > 0) {
  console.error('\n✗ Dependency pinning violation(s) detected:\n');
  for (const v of violations) {
    console.error(`  - ${v.block}["${v.name}"] = "${v.version}"  (must be exact, e.g. "1.2.3")`);
  }
  console.error(
    '\nWhy this matters: range specifiers (^/~/>=/etc.) introduce silent dependency drift\nbetween developers and CI, which violates the "build is reproducible" guarantee.\nUse exact versions; let Dependabot bump them deliberately.\n'
  );
  process.exit(1);
}

console.log(
  `✓ All ${blocks.flatMap((b) => Object.keys(pkg[b] ?? {})).length} dependency entries are exact-pinned.`
);
