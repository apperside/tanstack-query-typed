/**
 * tsup build configuration.
 *
 * Kept as a dedicated file (rather than CLI flags in `package.json`) so the
 * build can explicitly point at `tsconfig.build.json`. The root `tsconfig.json`
 * carries a `paths` alias used by the type tests to self-reference the package
 * name; that alias makes tsup's dts step inject `baseUrl`, which TypeScript ≥ 6
 * rejects. Building against the minimal `tsconfig.build.json` avoids that.
 * See README "Develop" for the wider config layout.
 */
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  tsconfig: 'tsconfig.build.json',
  format: ['esm'],
  target: 'es2022',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
});
