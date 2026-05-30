import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28', className)}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs tracking-wider text-accent uppercase">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-pretty text-muted">{description}</p>}
    </div>
  );
}
