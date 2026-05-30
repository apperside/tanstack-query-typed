import { Link } from '@tanstack/react-router';
import { Reveal } from '../components/Reveal';
import { CopyButton } from '../components/CopyButton';
import { buttonClasses } from '../components/buttonClasses';
import { IconArrowRight } from '../components/icons';
import { site } from '../lib/site';

export function CallToAction() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-1/2 h-full bg-gradient-to-b from-accent/20 to-transparent blur-3xl"
          />
          <h2 className="relative text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Stop guessing. Start shipping.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-pretty text-muted">
            Add one tiny dependency and let the compiler remember your query keys for you.
          </p>

          <div className="relative mx-auto mt-8 flex max-w-md flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/70 py-2 pr-2 pl-3.5 font-mono text-sm">
              <span className="text-muted select-none">$</span>
              <span className="truncate text-foreground/90">{site.install}</span>
              <CopyButton value={site.install} className="ml-auto" />
            </div>
            <Link to="/playground" className={buttonClasses('primary', 'lg', 'group shrink-0')}>
              Open the playground
              <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
