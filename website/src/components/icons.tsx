/**
 * Minimal inline icon set (24×24, stroke = currentColor). No icon dependency —
 * keeps the bundle lean and lets icons inherit text color.
 */
import type { ReactNode } from 'react';

type IconProps = { className?: string };

function Stroke({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </Stroke>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M4 12.5l5 5 11-11" />
    </Stroke>
  );
}

export function IconCopy({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </Stroke>
  );
}

export function IconKey({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <circle cx="7.5" cy="15.5" r="3.5" />
      <path d="M10 13 19 4M16 7l2.5 2.5M18.5 4.5 21 7" />
    </Stroke>
  );
}

export function IconShieldCheck({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </Stroke>
  );
}

export function IconBolt({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />
    </Stroke>
  );
}

export function IconLayers({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M12 4 3 9l9 5 9-5-9-5Z" />
      <path d="M3 13l9 5 9-5" />
    </Stroke>
  );
}

export function IconPlug({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M9 2v5M15 2v5M7 7h10v3a5 5 0 0 1-10 0V7ZM12 15v7" />
    </Stroke>
  );
}

export function IconBraces({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M8 4c-2 0-3 1-3 3v2c0 1-1 2-2 2 1 0 2 1 2 2v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1 1 2 2 2-1 0-2 1-2 2v2c0 2-1 3-3 3" />
    </Stroke>
  );
}

export function IconGitHub({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
    </svg>
  );
}
