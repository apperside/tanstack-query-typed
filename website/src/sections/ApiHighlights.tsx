import { Section, SectionHeader } from '../components/Section';
import { Reveal } from '../components/Reveal';
import { Card } from '../components/Card';
import { CodeBlock } from '../components/CodeBlock';
import { queryClientSnippet } from '../lib/snippets';

const groups = [
  { label: 'Single key', methods: ['getQueryData', 'setQueryData', 'getQueryState'] },
  {
    label: 'Filters',
    methods: [
      'invalidateQueries',
      'refetchQueries',
      'removeQueries',
      'resetQueries',
      'cancelQueries',
    ],
  },
  { label: 'Imperative', methods: ['fetchQuery', 'prefetchQuery', 'ensureQueryData'] },
  { label: 'Counters', methods: ['isFetching', 'isMutating'] },
  { label: 'Mutation defaults', methods: ['setMutationDefaults', 'getMutationDefaults'] },
];

export function ApiHighlights() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Typed QueryClient"
        title={
          <>
            One client, <span className="text-accent">every method narrowed</span>
          </>
        }
        description="useQueryClient() returns the client you already use — each key-taking method checked against your registry. Reads return the registered shape; writes are type-checked."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <CodeBlock filename="cache.ts" code={queryClientSnippet} />
        </Reveal>

        <Reveal delay={0.08}>
          <Card className="flex flex-col gap-4">
            {groups.map((group) => (
              <div
                key={group.label}
                className="flex flex-col gap-2 border-b border-border/60 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="w-40 shrink-0 font-mono text-xs tracking-wider text-muted uppercase">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.methods.map((method) => (
                    <code
                      key={method}
                      className="rounded-md border border-border bg-background/60 px-2 py-1 font-mono text-xs text-foreground/90"
                    >
                      {method}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
