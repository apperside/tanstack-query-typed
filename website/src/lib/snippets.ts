/**
 * Code snippets shown across the landing page. Kept here so the copy stays in
 * one place and accurate to the library's README. These are display strings,
 * not executed code.
 */

export const heroSnippet = `import { useAppQuery } from 'tanstack-query-typed';

// 1 — Declare your query once, in a central registry
declare module 'tanstack-query-typed' {
  interface AppQueriesMap {
    fetchUser: {
      response: { id: string; name: string };
      extraKeys: { userId: string };
    };
  }
}

// 2 — Use it. The key, its params and \`data\` are all typed
const user = useAppQuery(['fetchUser', { userId: '1' }], {
  queryFn: (ctx) => api.getUser(ctx.queryKey[1].userId),
});

useAppQuery(['fetchUser']); // ❌ missing required \`extraKeys\`
`;

export const beforeSnippet = `import { useQuery, useQueryClient } from '@tanstack/react-query';

// Plain TanStack Query — the key is an untyped unknown[]
useQuery({
  queryKey: ['user', userId, { full: true }], // typo? wrong order? 🤷
  queryFn: fetchUser,
});

const qc = useQueryClient();
qc.invalidateQueries({ queryKey: ['users'] }); // 'user' vs 'users'? no error
`;

export const afterSnippet = `import { useAppQuery, useAppQueryClient } from 'tanstack-query-typed';

// Every key is checked against your registry — autocompleted & safe
useAppQuery(['fetchUser', { userId }], { queryFn: fetchUser });

const qc = useAppQueryClient();
qc.invalidateQueries({ queryKey: ['fetchUser'] }); // ✅ name-checked
qc.invalidateQueries({ queryKey: ['userz'] }); //     ❌ unknown query name
`;

export const declareSnippet = `import 'tanstack-query-typed';

declare module 'tanstack-query-typed' {
  interface AppMutationsMap {
    updateUser: {
      payload: { id: string; name: string };
      response: { updatedAt: string };
      extraKeys: { tenantId: string };
    };
    logout: {
      payload: { reason?: string };
      response: { ok: true };
    };
  }

  interface AppQueriesMap {
    fetchUser: {
      response: { id: string; name: string };
      extraKeys: { userId: string };
    };
    fetchSettings: {
      response: { theme: 'light' | 'dark' };
    };
  }
}
`;

export const useHooksSnippet = `import { useAppMutation, useAppQuery } from 'tanstack-query-typed';

// Mutations — the \`mutate\` payload and \`.data\` are typed
const updateUser = useAppMutation(['updateUser', { tenantId: 't-1' }], {
  mutationFn: (vars) => api.updateUser(vars),
});
updateUser.mutate({ id: '1', name: 'Ada' });

// Queries — \`ctx.queryKey[1]\` is typed as the entry's extraKeys
const user = useAppQuery(['fetchUser', { userId: '1' }], {
  queryFn: (ctx) => api.getUser(ctx.queryKey[1].userId),
});
`;

export const rejectedSnippet = `useAppMutation(['updateUser']); //                ❌ missing required extraKeys
useAppMutation(['logout', { tenantId: 't' }]); //  ❌ logout has no extraKeys
useAppMutation(['nope']); //                       ❌ unknown mutation name
updateUser.mutate({ id: 1, name: 'Ada' }); //      ❌ id must be a string

useAppQuery(['fetchUser']); //                     ❌ missing required extraKeys
useAppQuery(['fetchSettings', { userId: 'x' }]); // ❌ fetchSettings has no extraKeys
useAppQuery(['nope']); //                          ❌ unknown query name
`;

export const queryClientSnippet = `import { useAppQueryClient } from 'tanstack-query-typed';

const qc = useAppQueryClient();

// Read cached data — the return type comes from your registry
const user = qc.getQueryData(['fetchUser', { userId: '1' }]);
//    ^? { id: string; name: string } | undefined

// Optimistic update — \`prev\` is typed
qc.setQueryData(['fetchUser', { userId: '1' }], (prev) =>
  prev ? { ...prev, name: 'Ada' } : prev,
);

// Filter by the full key OR just the name
qc.invalidateQueries({ queryKey: ['fetchUser'] });
`;
