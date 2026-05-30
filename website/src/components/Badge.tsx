import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 font-mono text-xs text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
