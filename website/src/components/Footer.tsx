import { Link } from '@tanstack/react-router';
import { Logo } from './Logo';
import { site } from '../lib/site';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-muted">
          <Logo className="h-5 w-5 text-accent" />
          <span className="font-mono text-sm">{site.name}</span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/playground" className="transition-colors hover:text-foreground">
            Playground
          </Link>
          <a
            href={site.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={site.npm}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            npm
          </a>
        </nav>

        <p className="text-xs text-muted">
          MIT &middot; Built by{' '}
          <a
            href={site.author.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-foreground/80 transition-colors hover:text-foreground"
          >
            {site.author.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
