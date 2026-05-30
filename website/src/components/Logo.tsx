/** Library mark: a `< / >` glyph in the brand gradient. Inherits text color. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect
        x="0.75"
        y="0.75"
        width="22.5"
        height="22.5"
        rx="6"
        fill="url(#logo-gradient)"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />
      <path
        d="M8 7.5 4.5 12 8 16.5M16 7.5 19.5 12 16 16.5M13.6 6l-3.2 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-accent-soft)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
