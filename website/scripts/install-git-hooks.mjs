// Installs a git pre-commit hook that runs the website's lefthook config.
// The website lives in a sub-directory of the repo, so the hook points lefthook
// at website/node_modules/.bin/lefthook and website/lefthook.yml explicitly.
// Safe to run from `prepare`: it no-ops when there is no git repo.
import { execSync } from 'node:child_process';
import { writeFileSync, chmodSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

let repoRoot;
try {
  repoRoot = execSync('git rev-parse --show-toplevel', {
    stdio: ['ignore', 'pipe', 'ignore'],
  })
    .toString()
    .trim();
} catch {
  console.log('[hooks] no git repo detected — skipping hook install');
  process.exit(0);
}

const hooksDir = join(repoRoot, '.git', 'hooks');
if (!existsSync(hooksDir)) mkdirSync(hooksDir, { recursive: true });

const hook = [
  '#!/bin/sh',
  '# Managed by website/scripts/install-git-hooks.mjs — runs the website lefthook config.',
  'repo_root="$(git rev-parse --show-toplevel)"',
  'lefthook_bin="$repo_root/website/node_modules/.bin/lefthook"',
  'if [ ! -x "$lefthook_bin" ]; then',
  '  echo "lefthook not found — run: npm --prefix website install" >&2',
  '  exit 0',
  'fi',
  'LEFTHOOK_CONFIG="$repo_root/website/lefthook.yml" exec "$lefthook_bin" run pre-commit "$@"',
  '',
].join('\n');

const hookPath = join(hooksDir, 'pre-commit');
writeFileSync(hookPath, hook, { mode: 0o755 });
chmodSync(hookPath, 0o755);
console.log(`[hooks] installed pre-commit hook -> ${hookPath}`);
