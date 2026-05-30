import { Section, SectionHeader } from '../components/Section';
import { Reveal } from '../components/Reveal';
import { CodeBlock } from '../components/CodeBlock';
import { afterSnippet, beforeSnippet } from '../lib/snippets';

export function ProblemSolution() {
  return (
    <Section>
      <SectionHeader
        eyebrow="The problem"
        title={
          <>
            Query keys are just <span className="text-accent">untyped arrays</span>
          </>
        }
        description="A typo, a wrong segment, the wrong order — TanStack Query can't catch any of it. The bug surfaces at runtime, in production."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-[#ff7b72]" />
            Before — stringly typed
          </span>
          <CodeBlock filename="before.ts" code={beforeSnippet} />
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-accent" />
            After — checked by the compiler
          </span>
          <CodeBlock filename="after.ts" code={afterSnippet} />
        </Reveal>
      </div>
    </Section>
  );
}
