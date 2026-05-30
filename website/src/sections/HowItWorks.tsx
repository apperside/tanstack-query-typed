import { Section, SectionHeader } from '../components/Section';
import { Reveal } from '../components/Reveal';
import { CodeBlock } from '../components/CodeBlock';
import { cn } from '../lib/cn';
import { declareSnippet, rejectedSnippet, useHooksSnippet } from '../lib/snippets';

const steps = [
  {
    n: '01',
    title: 'Declare your registry',
    body: 'Augment AppQueriesMap and AppMutationsMap once via declaration merging. Each entry names its response, payload and any extra key segments.',
    filename: 'app-tanstack.d.ts',
    code: declareSnippet,
  },
  {
    n: '02',
    title: 'Use the typed hooks',
    body: 'useAppQuery and useAppMutation take the key as their first argument. Variables, data and ctx.queryKey are all inferred from the registry.',
    filename: 'user-profile.tsx',
    code: useHooksSnippet,
  },
  {
    n: '03',
    title: 'Let the compiler catch mistakes',
    body: 'Unknown names, missing or extra key segments, the wrong payload type — each one becomes a red squiggle, not a production incident.',
    filename: 'mistakes.ts',
    code: rejectedSnippet,
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeader
        eyebrow="How it works"
        title="Three steps to never being wrong"
        description="No build step, no codegen — just TypeScript doing what it does best."
      />

      <div className="mt-14 flex flex-col gap-12 lg:gap-16">
        {steps.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.05}>
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className={cn('flex flex-col gap-4', i % 2 === 1 && 'lg:order-2')}>
                <span className="font-mono text-sm text-accent">{step.n}</span>
                <h3 className="text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="max-w-md text-pretty text-muted">{step.body}</p>
              </div>
              <div className={cn(i % 2 === 1 && 'lg:order-1')}>
                <CodeBlock filename={step.filename} code={step.code} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
