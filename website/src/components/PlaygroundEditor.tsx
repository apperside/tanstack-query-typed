import { useState } from 'react';
import Editor, { loader, type Monaco } from '@monaco-editor/react';
// Import only the editor core + the TypeScript language contribution, rather
// than the `monaco-editor` barrel that registers every bundled language. This
// keeps the (route-isolated) playground chunk to just what the demo needs.
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import { LIB_DTS, SEED_CODE } from './playgroundTypes';

// Self-host Monaco's workers (no CDN). Only the editor + TypeScript workers are
// wired up — the json/css/html language services aren't needed here, which keeps
// this (route-isolated) chunk leaner.
self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === 'typescript' || label === 'javascript') return new tsWorker();
    return new editorWorker();
  },
};

// Use the bundled monaco-editor package instead of the default CDN download.
loader.config({ monaco });

let configured = false;
function configureMonaco(m: Monaco) {
  if (configured) return;
  configured = true;

  const ts = m.languages.typescript;
  ts.typescriptDefaults.setCompilerOptions({
    target: ts.ScriptTarget.ES2020,
    lib: ['es2020', 'dom'],
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    allowNonTsExtensions: true,
  });

  // The injected ambient module is what makes the typed-key checking authentic.
  ts.typescriptDefaults.addExtraLib(
    LIB_DTS,
    'file:///node_modules/tanstack-query-typed/index.d.ts',
  );
}

export default function PlaygroundEditor() {
  const [errors, setErrors] = useState<monaco.editor.IMarker[]>([]);

  function handleMount(editor: monaco.editor.IStandaloneCodeEditor, m: Monaco) {
    const refresh = () => {
      const model = editor.getModel();
      if (!model) return;
      const markers = m.editor.getModelMarkers({ resource: model.uri });
      setErrors(
        markers.filter((mk: monaco.editor.IMarker) => mk.severity === m.MarkerSeverity.Error),
      );
    };
    refresh();
    const sub = m.editor.onDidChangeMarkers(refresh);
    editor.onDidDispose(() => sub.dispose());
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-[#0a0b0f]/85 shadow-2xl shadow-black/30">
      <figcaption className="flex items-center gap-1.5 border-b border-border/70 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
        <span className="ml-2 font-mono text-xs text-muted">playground.tsx</span>
      </figcaption>

      <Editor
        height={480}
        language="typescript"
        path="file:///playground.tsx"
        defaultValue={SEED_CODE}
        theme="vs-dark"
        beforeMount={configureMonaco}
        onMount={handleMount}
        loading={<div className="p-6 text-sm text-muted">Loading editor…</div>}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          automaticLayout: true,
          tabSize: 2,
          renderLineHighlight: 'none',
        }}
      />

      <div className="border-t border-border/70 px-4 py-3 font-mono text-[13px]">
        {errors.length === 0 ? (
          <p className="flex items-center gap-2 text-[#86e1a0]">
            <span aria-hidden>✓</span> No type errors — the compiler is happy.
          </p>
        ) : (
          <ul className="space-y-1 text-[#ff7b72]">
            {errors.map((mk, i) => (
              <li key={i}>
                <span className="text-muted">Line {mk.startLineNumber}:</span> {mk.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </figure>
  );
}
