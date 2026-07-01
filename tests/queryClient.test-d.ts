/**
 * Compile-time type tests for `useQueryClient` / `TypedQueryClient`.
 *
 * Checked by `npm run typecheck`. Uses `expect-type` for precise positive
 * assertions; the negative `@ts-expect-error` cases live in `examples/usage.ts`.
 *
 * Fixtures (both mutation and query) are registered in `./fixtures.ts` and
 * visible here via global module augmentation merging.
 */
import { expectTypeOf } from 'expect-type';

import { useQueryClient } from 'tanstack-query-typed';

export function _typedQueryClientTests() {
  const qc = useQueryClient();

  // ----- Single-queryKey methods ---------------------------------------------

  // `getQueryData` returns the registered response (or undefined).
  expectTypeOf(qc.getQueryData(['fixtureQueryWithExtra', { id: 'a' }]))
    .toEqualTypeOf<{ id: string; label: string } | undefined>();
  expectTypeOf(qc.getQueryData(['fixtureQueryNoExtra']))
    .toEqualTypeOf<{ count: number } | undefined>();

  // `setQueryData` updater receives the registered response.
  qc.setQueryData(['fixtureQueryWithExtra', { id: 'a' }], (prev) => {
    expectTypeOf(prev).toEqualTypeOf<{ id: string; label: string } | undefined>();
    return prev;
  });

  // `getQueryState` returns `QueryState<response, error> | undefined`.
  const state = qc.getQueryState(['fixtureQueryWithExtra', { id: 'a' }]);
  expectTypeOf(state?.data).toEqualTypeOf<{ id: string; label: string } | undefined>();

  // ----- Filter methods (queries) --------------------------------------------

  // Accepts a full key, a `[name]` prefix, an empty object, or nothing.
  qc.invalidateQueries({ queryKey: ['fixtureQueryWithExtra', { id: 'a' }] });
  qc.invalidateQueries({ queryKey: ['fixtureQueryWithExtra'] });
  qc.invalidateQueries({});
  qc.invalidateQueries();

  qc.refetchQueries({ queryKey: ['fixtureQueryNoExtra'] });
  qc.removeQueries({ queryKey: ['fixtureQueryWithExtra'] });
  qc.cancelQueries({ queryKey: ['fixtureQueryWithExtra', { id: 'a' }] });
  qc.resetQueries({ queryKey: ['fixtureQueryNoExtra'] });

  // ----- Counters ------------------------------------------------------------

  expectTypeOf(qc.isFetching({ queryKey: ['fixtureQueryWithExtra'] })).toEqualTypeOf<number>();
  expectTypeOf(qc.isMutating({ mutationKey: ['fixtureWithExtra'] })).toEqualTypeOf<number>();

  // ----- Options-based query methods -----------------------------------------

  const fetched = qc.fetchQuery({
    queryKey: ['fixtureQueryWithExtra', { id: 'a' }],
    queryFn: (ctx) => {
      expectTypeOf(ctx.queryKey).toEqualTypeOf<
        ['fixtureQueryWithExtra', { id: string }]
      >();
      return Promise.resolve({ id: ctx.queryKey[1].id, label: 'L' });
    },
  });
  expectTypeOf<Awaited<typeof fetched>>().toEqualTypeOf<{ id: string; label: string }>();

  qc.prefetchQuery({
    queryKey: ['fixtureQueryNoExtra'],
    queryFn: () => Promise.resolve({ count: 5 }),
  });

  const ensured = qc.ensureQueryData({
    queryKey: ['fixtureQueryWithExtra', { id: 'a' }],
    queryFn: (ctx) => Promise.resolve({ id: ctx.queryKey[1].id, label: 'L' }),
  });
  expectTypeOf<Awaited<typeof ensured>>().toEqualTypeOf<{ id: string; label: string }>();

  // ----- Mutation defaults ---------------------------------------------------

  qc.setMutationDefaults(['fixtureWithExtra', { scope: 'global' }], {
    mutationFn: (vars) => {
      expectTypeOf(vars).toEqualTypeOf<{ amount: number }>();
      return Promise.resolve({ ok: true as const });
    },
  });

  // Entry without `extraKeys` -> key is `[K]` only.
  qc.setMutationDefaults(['fixtureNoExtra'], {
    mutationFn: (vars) => Promise.resolve({ receiptId: vars.reason }),
  });
}
