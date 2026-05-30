import { Link } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';
import { Logo } from './Logo';
import { site } from '../lib/site';

export function Nav() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md"
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            aria-label={`${site.name} — home`}
            className="group flex items-center gap-2 text-foreground"
          >
            <Logo className="h-6 w-6 text-accent transition-transform group-hover:scale-110" />
            <span className="font-mono text-sm font-medium tracking-tight">{site.name}</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <a
              href="/#features"
              className="rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              className="rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              How it works
            </a>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={site.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={site.npm}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground sm:inline-block"
          >
            npm
          </a>
          <Link
            to="/playground"
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-soft"
          >
            Playground
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
