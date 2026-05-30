import { useState } from 'react';
import { cn } from '../lib/cn';
import { IconCheck, IconCopy } from './icons';

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — copying is a
      // convenience, so we fail quietly rather than interrupt the user.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-card hover:text-foreground',
        className,
      )}
    >
      {copied ? (
        <IconCheck className="h-3.5 w-3.5 text-accent" />
      ) : (
        <IconCopy className="h-3.5 w-3.5" />
      )}
      <span className={cn(copied && 'text-accent')}>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
