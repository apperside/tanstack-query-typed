import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card/40 p-5', className)}>
      {children}
    </div>
  );
}
