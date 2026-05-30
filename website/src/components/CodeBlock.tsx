import { Highlight, type PrismTheme } from 'prism-react-renderer';
import { cn } from '../lib/cn';
import { CopyButton } from './CopyButton';

/** Violet-tinted dark theme matching the site palette. */
const codeTheme: PrismTheme = {
  plain: { color: '#e9ebf1', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'cdata'], style: { color: '#6b7280', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#8b929f' } },
    { types: ['keyword', 'module', 'control-flow', 'tag'], style: { color: '#a78bfa' } },
    { types: ['operator'], style: { color: '#c4b5fd' } },
    { types: ['string', 'char', 'inserted', 'attr-value'], style: { color: '#86e1a0' } },
    { types: ['function'], style: { color: '#7cc4ff' } },
    { types: ['number', 'boolean', 'constant'], style: { color: '#f0a36b' } },
    { types: ['class-name', 'maybe-class-name', 'builtin'], style: { color: '#5ecfd0' } },
    { types: ['attr-name'], style: { color: '#7cc4ff' } },
    { types: ['property', 'parameter', 'variable'], style: { color: '#e9ebf1' } },
    { types: ['deleted'], style: { color: '#ff7b72' } },
  ],
};

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'tsx', filename, className }: CodeBlockProps) {
  const trimmed = code.replace(/^\n+/, '').replace(/\s+$/, '');

  return (
    <figure
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-[#0a0b0f]/85 shadow-2xl shadow-black/30 backdrop-blur-sm',
        className,
      )}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2.5">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
          {filename && <span className="ml-2 font-mono text-xs text-muted">{filename}</span>}
        </span>
        <CopyButton
          value={trimmed}
          className="opacity-70 transition-opacity group-hover:opacity-100"
        />
      </figcaption>

      <div className="overflow-x-auto">
        <Highlight code={trimmed} language={language} theme={codeTheme}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="w-fit min-w-full py-4 font-mono text-[13px] leading-relaxed">
              {tokens.map((line, i) => {
                const isError = line.some((token) => token.content.includes('❌'));
                return (
                  <span
                    key={i}
                    {...getLineProps({
                      line,
                      className: cn(
                        'block px-4',
                        isError && 'bg-[#ff7b72]/10 ring-1 ring-[#ff7b72]/25 ring-inset',
                      ),
                    })}
                  >
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </figure>
  );
}
