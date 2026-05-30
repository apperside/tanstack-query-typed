import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/playground')({
  component: Playground,
});

function Playground() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Interactive playground</h1>
      <p className="mt-4 max-w-lg text-pretty text-muted">
        A live, in-browser TypeScript editor will go here — break a query key and watch the compiler
        catch it in real time.
      </p>
      {/* Scaffold placeholder — the Monaco-powered editor is added by the playground build. */}
      <p className="mt-10 font-mono text-xs text-muted">Editor coming next.</p>
    </section>
  );
}
