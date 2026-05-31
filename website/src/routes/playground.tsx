import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';

import { CodeBlock } from '../components/CodeBlock';
import { SEED_CODE } from '../components/playgroundTypes';

// The Monaco-powered editor is a heavy dependency, so it's dynamically imported:
// it lands in its own chunk that only loads on this route, after first paint.
const PlaygroundEditor = lazy(() => import('../components/PlaygroundEditor'));

export const Route = createFileRoute('/playground')({
  component: Playground,
});

function Playground() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col px-4 py-24 sm:px-6 sm:py-32">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Interactive playground
        </h1>
        <p className="mt-4 max-w-lg text-pretty text-muted">
          A live, in-browser TypeScript editor — break a query key and watch the compiler catch it
          in real time.
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={<CodeBlock code={SEED_CODE} filename="playground.tsx" />}>
          <PlaygroundEditor />
        </Suspense>
      </div>
    </section>
  );
}
