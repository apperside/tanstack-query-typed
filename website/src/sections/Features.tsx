import { Section, SectionHeader } from '../components/Section';
import { Reveal } from '../components/Reveal';
import {
  IconBolt,
  IconBraces,
  IconKey,
  IconLayers,
  IconPlug,
  IconShieldCheck,
} from '../components/icons';

const features = [
  {
    icon: IconKey,
    title: 'Typed query & mutation keys',
    body: 'Key names and their segments are checked against your registry. Autocomplete the name and always get the right shape.',
  },
  {
    icon: IconShieldCheck,
    title: 'Typed payloads & responses',
    body: 'The variables you pass to mutate and the data each hook resolves to come straight from your declarations — never any.',
  },
  {
    icon: IconLayers,
    title: 'A fully typed QueryClient',
    body: 'getQueryData, setQueryData, invalidateQueries, fetchQuery and friends are all narrowed to your registered keys and shapes.',
  },
  {
    icon: IconBolt,
    title: 'Zero runtime overhead',
    body: 'It is types only — the typed view compiles away. Nothing ships to your users and nothing slows you down.',
  },
  {
    icon: IconPlug,
    title: 'Drop-in wrappers',
    body: "useAppQuery and useAppMutation mirror TanStack's own signatures. Swap them in and keep everything else the same.",
  },
  {
    icon: IconBraces,
    title: 'One central registry',
    body: 'Declare every query and mutation once through declaration merging. Your whole app stays in sync with one source of truth.',
  },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeader
        eyebrow="Why"
        title={
          <>
            Type-safety where TanStack Query <span className="text-accent">leaves off</span>
          </>
        }
        description="Keys, payloads, responses and the QueryClient — all checked by the compiler, with nothing to ship at runtime."
      />

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border/70 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 0.04} className="h-full">
            <div className="flex h-full flex-col gap-3 bg-background p-6 transition-colors hover:bg-card/50">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-accent">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-medium text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{feature.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
