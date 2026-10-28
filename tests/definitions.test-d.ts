/**
 * Compile-time type tests for reusable definitions (`appQueryOptions`,
 * `appMutationOptions`) and `useSuspenseQuery`.
 *
 * The point of a definition is to be declared once and accepted everywhere a
 * query/mutation is consumed, so each test feeds the SAME definition into every
 * consumer and checks the inferred types. Negative `@ts-expect-error` cases
 * live in `examples/usage.ts`.
 *
 * Fixtures are registered in `./fixtures.ts`.
 */
import { expectTypeOf } from 'expect-type';

import {
  appMutationOptions,
  appQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from 'tanstack-query-typed';

const itemQuery = (id: string) =>
  appQueryOptions(['fixtureQueryWithExtra', { id }], {
    queryFn: (ctx) => {
      expectTypeOf(ctx.queryKey).toEqualTypeOf<['fixtureQueryWithExtra', { id: string }]>();
      return Promise.resolve({ id: ctx.queryKey[1].id, label: 'L' });
    },
  });

const countQuery = appQueryOptions(['fixtureQueryNoExtra'], {
  queryFn: () => Promise.resolve({ count: 1 }),
});

const payMutation = appMutationOptions(['fixtureWithExtra', { scope: 'global' }], {
  mutationFn: (vars) => {
    expectTypeOf(vars).toEqualTypeOf<{ amount: number }>();
    return Promise.resolve({ ok: true as const });
  },
});

export function _queryDefinitionTests() {
  // --- Hooks ------------------------------------------------------------------

  expectTypeOf(useQuery(itemQuery('a')).data).toEqualTypeOf<
    { id: string; label: string } | undefined
  >();
  expectTypeOf(useQuery(countQuery).data).toEqualTypeOf<{ count: number } | undefined>();

  // Suspense: `data` is always defined.
  expectTypeOf(useSuspenseQuery(itemQuery('a')).data).toEqualTypeOf<{
    id: string;
    label: string;
  }>();
  expectTypeOf(useSuspenseQuery(countQuery).data).toEqualTypeOf<{ count: number }>();

  // Suspense, key form: `ctx.queryKey` is typed and `select` narrows `data`.
  const label = useSuspenseQuery(['fixtureQueryWithExtra', { id: 'a' }], {
    queryFn: (ctx) => Promise.resolve({ id: ctx.queryKey[1].id, label: 'L' }),
    select: (data) => data.label,
  });
  expectTypeOf(label.data).toEqualTypeOf<string>();

  // --- Typed QueryClient (e.g. a route loader) --------------------------------

  const qc = useQueryClient();
  expectTypeOf(qc.ensureQueryData(itemQuery('a'))).resolves.toEqualTypeOf<{
    id: string;
    label: string;
  }>();
  expectTypeOf(qc.fetchQuery(countQuery)).resolves.toEqualTypeOf<{ count: number }>();
  qc.prefetchQuery(itemQuery('a'));
  expectTypeOf(qc.getQueryData(itemQuery('a').queryKey)).toEqualTypeOf<
    { id: string; label: string } | undefined
  >();
}

export function _mutationDefinitionTests() {
  const m = useMutation(payMutation);
  expectTypeOf<Parameters<typeof m.mutate>[0]>().toEqualTypeOf<{ amount: number }>();
  expectTypeOf(m.data).toEqualTypeOf<{ ok: true } | undefined>();

  // The definition keeps its typed key, e.g. for `isMutating` filters.
  expectTypeOf(payMutation.mutationKey).toEqualTypeOf<
    ['fixtureWithExtra', { scope: string }]
  >();
}
