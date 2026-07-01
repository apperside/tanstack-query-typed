/**
 * Compile-time type tests for `useQuery` and the query helper types.
 *
 * Checked by `npm run typecheck`. Uses `expect-type` for precise positive
 * assertions; the negative `@ts-expect-error` cases live in `examples/usage.ts`.
 *
 * Query fixtures (`fixtureQueryWithExtra`, `fixtureQueryNoExtra`) are registered
 * in `./fixtures.ts` and visible here via global module augmentation merging.
 */
import { expectTypeOf } from 'expect-type';

import {
  useQuery,
  type AppQueryKey,
  type AppQueryOptions,
  type QueryExtraKeys,
  type QueryResponse,
} from 'tanstack-query-typed';

// --- Helper-type extractions --------------------------------------------------

expectTypeOf<QueryResponse<'fixtureQueryWithExtra'>>().toEqualTypeOf<{
  id: string;
  label: string;
}>();
expectTypeOf<QueryExtraKeys<'fixtureQueryWithExtra'>>().toEqualTypeOf<{ id: string }>();

expectTypeOf<QueryResponse<'fixtureQueryNoExtra'>>().toEqualTypeOf<{ count: number }>();
expectTypeOf<QueryExtraKeys<'fixtureQueryNoExtra'>>().toBeNever();

// --- Key shape ----------------------------------------------------------------

expectTypeOf<AppQueryKey<'fixtureQueryWithExtra'>>().toEqualTypeOf<
  ['fixtureQueryWithExtra', { id: string }]
>();
expectTypeOf<AppQueryKey<'fixtureQueryNoExtra'>>().toEqualTypeOf<['fixtureQueryNoExtra']>();

// --- Options: `queryKey` must be stripped ------------------------------------

expectTypeOf<AppQueryOptions<'fixtureQueryWithExtra'>>().not.toHaveProperty('queryKey');

// Inside `queryFn`, `ctx.queryKey` is the typed tuple — not just `QueryKey`.
// `queryFn` is `QueryFunction | SkipToken | undefined`, so we extract the
// callable branch before reading the first parameter's `queryKey`.
type FixtureQueryFn = Extract<
  NonNullable<AppQueryOptions<'fixtureQueryWithExtra'>['queryFn']>,
  (...args: never) => unknown
>;
expectTypeOf<Parameters<FixtureQueryFn>[0]['queryKey']>().toEqualTypeOf<
  ['fixtureQueryWithExtra', { id: string }]
>();

// --- Hook return: data, queryFn ctx, select ----------------------------------

export function _queryHookReturnTypeTests() {
  // `queryFn` returns exactly the registered response, so `TData` is that
  // response. `ctx.queryKey[1]` is the typed `extraKeys`.
  const q = useQuery(['fixtureQueryWithExtra', { id: 'a' }], {
    queryFn: (ctx) => Promise.resolve({ id: ctx.queryKey[1].id, label: 'L' }),
  });
  expectTypeOf(q.data).toEqualTypeOf<{ id: string; label: string } | undefined>();

  // Entry without `extraKeys`: the key is a single-element tuple.
  const r = useQuery(['fixtureQueryNoExtra'], {
    queryFn: () => Promise.resolve({ count: 5 }),
  });
  expectTypeOf(r.data).toEqualTypeOf<{ count: number } | undefined>();

  // `select` narrows `TData` while `TQueryFnData` stays the registered response.
  const s = useQuery(['fixtureQueryWithExtra', { id: 'a' }], {
    queryFn: (ctx) => Promise.resolve({ id: ctx.queryKey[1].id, label: 'L' }),
    select: (data) => data.label,
  });
  expectTypeOf(s.data).toEqualTypeOf<string | undefined>();
}
