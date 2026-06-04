import { Link } from '@tanstack/react-router';
import { motion, useReducedMotion, type MotionProps } from 'motion/react';
import { Badge } from '../components/Badge';
import { CodeBlock } from '../components/CodeBlock';
import { CopyButton } from '../components/CopyButton';
import { buttonClasses } from '../components/buttonClasses';
import { IconArrowRight, IconGitHub } from '../components/icons';
import { EASE_OUT } from '../lib/motion';
import { site } from '../lib/site';
import { heroSnippet } from '../lib/snippets';
import { Logo } from '../components/Logo';

export function Hero() {
  const reduceMotion = useReducedMotion();
  const fade = (delay: number): MotionProps =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: EASE_OUT, delay },
        };

  return (
    <section className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pt-16 pb-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-28 lg:pb-24">
      <div className="flex flex-col items-start text-left">
        <div
          aria-label={`${site.name} — home`}
          className="group flex items-center gap-2 text-foreground"
        >
          <Logo className="h-12 w-12 text-accent transition-transform group-hover:scale-110" />
          <span className="font-mono text-xl font-medium tracking-tight">{site.name}</span>
        </div>

        <motion.div {...fade(0)}>
          <Badge>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            zero-runtime · TypeScript · TanStack Query v5
          </Badge>
        </motion.div>

        <motion.h1
          {...fade(0.05)}
          className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]"
        >
          Never guess a{' '}
          <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
            query key
          </span>{' '}
          again
        </motion.h1>

        <motion.p
          {...fade(0.1)}
          className="mt-5 max-w-xl text-base text-pretty text-muted sm:text-lg"
        >
          {site.description}
        </motion.p>

        <motion.div
          {...fade(0.15)}
          className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 py-2 pr-2 pl-3.5 font-mono text-sm">
            <span className="text-muted select-none">$</span>
            <span className="truncate text-foreground/90">{site.install}</span>
            <CopyButton value={site.install} className="ml-auto" />
          </div>
        </motion.div>

        <div className="mt-3 flex w-full flex-row items-center gap-5">
          <Link to="/playground" className={buttonClasses('primary', 'lg', 'group')}>
            Try the playground
            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <motion.a
            {...fade(0.2)}
            href={site.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <IconGitHub className="h-4 w-4" />
            Star it on GitHub
          </motion.a>
        </div>
      </div>

      <motion.div
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 20, scale: 0.98 },
              animate: { opacity: 1, y: 0, scale: 1 },
              transition: { duration: 0.6, ease: EASE_OUT, delay: 0.15 },
            })}
        className="relative"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-accent/15 to-transparent blur-2xl"
        />
        <CodeBlock filename="app.tsx" code={heroSnippet} />
      </motion.div>
    </section>
  );
}
