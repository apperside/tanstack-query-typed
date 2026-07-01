/**
 * Code snippets shown across the landing page. Kept here so the copy stays in
 * one place and accurate to the library's README. These are display strings,
 * not executed code.
 */

export const heroSnippet = `import { useQuery } from 'tanstack-query-typed';

// 1 — Declare your query once, in a central registry
declare module 'tanstack-query-typed' {
  interface AppQueriesRegistry {
    fetchUser: {
      response: { id: string; name: string };
      extraKeys: { userId: string };
    };
  }
}

// 2 — Same name as TanStack, just typed. The key, its params and \`data\`
const user = useQuery(['fetchUser', { userId: '1' }], {
  queryFn: (ctx) => api.getUser(ctx.queryKey[1].userId),
});

useQuery(['fetchUser']); // ❌ missing required \`extraKeys\`
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

export const afterSnippet = `import { useQuery, useQueryClient } from 'tanstack-query-typed';

// Same names, same hooks — only the import changed. Now every key is
// checked against your registry: autocompleted & safe.
useQuery(['fetchUser', { userId }], { queryFn: fetchUser });

const qc = useQueryClient();
qc.invalidateQueries({ queryKey: ['fetchUser'] }); // ✅ name-checked
qc.invalidateQueries({ queryKey: ['userz'] }); //     ❌ unknown query name
`;

export const declareSnippet = `import 'tanstack-query-typed';

declare module 'tanstack-query-typed' {
  interface AppMutationsRegistry {
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

  interface AppQueriesRegistry {
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

export const useHooksSnippet = `import { useMutation, useQuery, useIsFetching, useIsMutating } from 'tanstack-query-typed';

// Mutations — the \`mutate\` payload and \`.data\` are typed
const updateUser = useMutation(['updateUser', { tenantId: 't-1' }], {
  mutationFn: (vars) => api.updateUser(vars),
});
updateUser.mutate({ id: '1', name: 'Ada' });

// Queries — \`ctx.queryKey[1]\` is typed as the entry's extraKeys
const user = useQuery(['fetchUser', { userId: '1' }], {
  queryFn: (ctx) => api.getUser(ctx.queryKey[1].userId),
});

// Counters — the filter key is checked against your registry too
const savingUser = useIsMutating({ mutationKey: ['updateUser'] });
const loadingUser = useIsFetching({ queryKey: ['fetchUser'] });
`;

export const rejectedSnippet = `useMutation(['updateUser']); //                  ❌ missing required extraKeys
useMutation(['logout', { tenantId: 't' }]); //   ❌ logout has no extraKeys
useMutation(['nope']); //                        ❌ unknown mutation name
updateUser.mutate({ id: 1, name: 'Ada' }); //    ❌ id must be a string

useQuery(['fetchUser']); //                      ❌ missing required extraKeys
useQuery(['fetchSettings', { userId: 'x' }]); // ❌ fetchSettings has no extraKeys
useQuery(['nope']); //                           ❌ unknown query name

useIsFetching({ queryKey: ['nope'] }); //        ❌ unknown query name
useIsMutating({ mutationKey: ['nope'] }); //     ❌ unknown mutation name
`;

export const queryClientSnippet = `import { useQueryClient } from 'tanstack-query-typed';

const qc = useQueryClient();

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
