/**
 * Usage example that doubles as a set of compile-time type tests.
 *
 * It is type-checked by `npm run typecheck` but is NOT part of the published
 * package (only `dist` is shipped). Each `@ts-expect-error` line asserts that a
 * misuse is rejected by the compiler — if the typing ever regresses, the build
 * fails because the expected error disappears.
 *
 * The hooks share the same names as `@tanstack/react-query` — only the import
 * path changes; everything else is identical, plus full typing.
 */
import { skipToken } from '@tanstack/react-query';
import {
  appMutationOptions,
  appQueryOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
  useQueryClient,
  useIsFetching,
  useIsMutating,
} from 'tanstack-query-typed';

// Register the app's mutations and queries via declaration merging.
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
      // no `extraKeys` -> key is `['logout']`
    };
  }

  interface AppQueriesRegistry {
    fetchUser: {
      response: { id: string; name: string };
      extraKeys: { userId: string };
    };
    fetchSettings: {
      response: { theme: 'light' | 'dark' };
      // no `extraKeys` -> key is `['fetchSettings']`
    };
  }
}

export function demo() {
  // ✅ correct key + extraKeys; `vars` and the resolved data are inferred.
  const updateUser = useMutation(['updateUser', { tenantId: 't-1' }], {
    mutationFn: (vars) => Promise.resolve({ updatedAt: `${vars.id}-${vars.name}` }),
  });
  updateUser.mutate({ id: '1', name: 'Ada' });

  // ✅ entry without `extraKeys` -> key is `['logout']` only.
  const logout = useMutation(['logout'], {
    mutationFn: () => Promise.resolve({ ok: true as const }),
  });
  logout.mutate({});

  // @ts-expect-error – missing the required `extraKeys` segment.
  useMutation(['updateUser']);

  // @ts-expect-error – `logout` declares no `extraKeys`, so a second segment is invalid.
  useMutation(['logout', { tenantId: 't-1' }]);

  // @ts-expect-error – unknown mutation name.
  useMutation(['nope']);

  // @ts-expect-error – wrong payload type (`id` must be a string).
  updateUser.mutate({ id: 1, name: 'Ada' });

  // ✅ query with `extraKeys`; `ctx.queryKey` is the typed tuple.
  const user = useQuery(['fetchUser', { userId: 'u-1' }], {
    queryFn: (ctx) =>
      Promise.resolve({ id: ctx.queryKey[1].userId, name: 'Ada' }),
  });

  // ✅ query without `extraKeys`; key is `['fetchSettings']` only.
  const settings = useQuery(['fetchSettings'], {
    queryFn: () => Promise.resolve({ theme: 'light' as const }),
  });

  // ✅ `select` narrows `data` independently of the registered response.
  const userName = useQuery(['fetchUser', { userId: 'u-1' }], {
    queryFn: (ctx) =>
      Promise.resolve({ id: ctx.queryKey[1].userId, name: 'Ada' }),
    select: (data) => data.name,
  });

  // @ts-expect-error – missing required `extraKeys` segment for `fetchUser`.
  useQuery(['fetchUser']);

  // @ts-expect-error – `fetchSettings` declares no `extraKeys`.
  useQuery(['fetchSettings', { userId: 'u-1' }]);

  // @ts-expect-error – unknown query name.
  useQuery(['nope']);

  // --- Reusable definitions + suspense -----------------------------------------

  // ✅ declared once, reused by the hooks and the QueryClient (e.g. a loader).
  const userQuery = (userId: string) =>
    appQueryOptions(['fetchUser', { userId }], {
      queryFn: (ctx) => Promise.resolve({ id: ctx.queryKey[1].userId, name: 'Ada' }),
    });
  const suspenseUser = useSuspenseQuery(userQuery('u-1')); // `data` is always defined
  const logoutMutation = appMutationOptions(['logout'], {
    mutationFn: () => Promise.resolve({ ok: true as const }),
  });
  const logoutAgain = useMutation(logoutMutation);

  // @ts-expect-error – unknown query name.
  appQueryOptions(['nope']);

  // @ts-expect-error – a reusable definition cannot be disabled with `skipToken`.
  appQueryOptions(['fetchSettings'], { queryFn: skipToken });

  useSuspenseQuery(['fetchSettings'], {
    queryFn: () => Promise.resolve({ theme: 'light' as const }),
    // @ts-expect-error – suspense queries have no `enabled` option.
    enabled: false,
  });

  // @ts-expect-error – unknown mutation name.
  appMutationOptions(['nope']);

  // --- Typed QueryClient ------------------------------------------------------
  const qc = useQueryClient();

  // ✅ read cached data with full type information.
  const cached: { id: string; name: string } | undefined = qc.getQueryData([
    'fetchUser',
    { userId: 'u-1' },
  ]);

  // ✅ optimistic update: updater is typed.
  qc.setQueryData(['fetchUser', { userId: 'u-1' }], (prev) =>
    prev ? { ...prev, name: 'Ada (optimistic)' } : prev,
  );

  // ✅ filter methods accept the full key or just the `[name]` prefix.
  qc.invalidateQueries({ queryKey: ['fetchUser', { userId: 'u-1' }] });
  qc.invalidateQueries({ queryKey: ['fetchUser'] });

  // ✅ imperative fetch with typed options.
  qc.fetchQuery({
    queryKey: ['fetchUser', { userId: 'u-1' }],
    queryFn: (ctx) =>
      Promise.resolve({ id: ctx.queryKey[1].userId, name: 'Ada' }),
  });

  // @ts-expect-error – unknown query name.
  qc.getQueryData(['nope']);

  // @ts-expect-error – unknown query name in filter.
  qc.invalidateQueries({ queryKey: ['nope'] });

  // @ts-expect-error – `fetchSettings` declares no `extraKeys`.
  qc.getQueryData(['fetchSettings', { userId: 'u-1' }]);

  // --- Counting in-flight queries / mutations ---------------------------------
  // Both hooks return `number`; the filter key is checked against the registry.
  const fetchingAll: number = useIsFetching();
  const fetchingUser: number = useIsFetching({ queryKey: ['fetchUser'] }); // by name
  const fetchingOneUser: number = useIsFetching({
    queryKey: ['fetchUser', { userId: 'u-1' }],
  }); // full key

  const mutatingAll: number = useIsMutating();
  const savingUser: number = useIsMutating({ mutationKey: ['updateUser'] }); // by name
  const savingOneUser: number = useIsMutating({
    mutationKey: ['updateUser', { tenantId: 't-1' }],
  }); // full key

  // @ts-expect-error – unknown query name.
  useIsFetching({ queryKey: ['nope'] });

  // @ts-expect-error – unknown mutation name.
  useIsMutating({ mutationKey: ['nope'] });

  return {
    updateUser,
    logout,
    user,
    settings,
    userName,
    suspenseUser,
    logoutAgain,
    cached,
    fetchingAll,
    fetchingUser,
    fetchingOneUser,
    mutatingAll,
    savingUser,
    savingOneUser,
  };
}
