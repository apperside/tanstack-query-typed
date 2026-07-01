/**
 * Compile-time type tests for the `useIsFetching` and `useIsMutating` counter
 * hooks.
 *
 * Checked by `npm run typecheck`. Uses `expect-type` for the positive
 * assertions and inline `@ts-expect-error` for the rejection cases. (Sibling
 * files keep their negatives in `examples/usage.ts`; the counter hooks keep
 * theirs here so their filter-key coverage stays self-contained.)
 *
 * The hooks are invoked inside a function that is exported but never called —
 * TypeScript checks the body without executing it, so React's rules-of-hooks
 * are irrelevant here.
 *
 * Fixtures (`fixtureQueryWithExtra`/`fixtureQueryNoExtra` and
 * `fixtureWithExtra`/`fixtureNoExtra`) are registered in `./fixtures.ts` and
 * visible here via global module augmentation merging.
 */
import { expectTypeOf } from 'expect-type';

import { useIsFetching, useIsMutating } from 'tanstack-query-typed';

export function _counterHookTypeTests() {
  // ----- useIsFetching -------------------------------------------------------

  // No filter / empty filter -> count of all in-flight queries, typed `number`.
  expectTypeOf(useIsFetching()).toEqualTypeOf<number>();
  expectTypeOf(useIsFetching({})).toEqualTypeOf<number>();

  // Full key and `[name]` prefix are both accepted; return type stays `number`.
  expectTypeOf(
    useIsFetching({ queryKey: ['fixtureQueryWithExtra', { id: 'a' }] }),
  ).toEqualTypeOf<number>();
  expectTypeOf(useIsFetching({ queryKey: ['fixtureQueryWithExtra'] })).toEqualTypeOf<number>();
  expectTypeOf(useIsFetching({ queryKey: ['fixtureQueryNoExtra'] })).toEqualTypeOf<number>();

  // @ts-expect-error unknown query name is rejected.
  useIsFetching({ queryKey: ['nope'] });
  // @ts-expect-error `fixtureQueryNoExtra` declares no extraKeys.
  useIsFetching({ queryKey: ['fixtureQueryNoExtra', { id: 'x' }] });

  // ----- useIsMutating -------------------------------------------------------

  // No filter / empty filter -> count of all in-flight mutations.
  expectTypeOf(useIsMutating()).toEqualTypeOf<number>();
  expectTypeOf(useIsMutating({})).toEqualTypeOf<number>();

  // Full key and `[name]` prefix are both accepted; return type stays `number`.
  expectTypeOf(
    useIsMutating({ mutationKey: ['fixtureWithExtra', { scope: 'global' }] }),
  ).toEqualTypeOf<number>();
  expectTypeOf(useIsMutating({ mutationKey: ['fixtureWithExtra'] })).toEqualTypeOf<number>();
  expectTypeOf(useIsMutating({ mutationKey: ['fixtureNoExtra'] })).toEqualTypeOf<number>();

  // @ts-expect-error unknown mutation name is rejected.
  useIsMutating({ mutationKey: ['nope'] });
  // @ts-expect-error `fixtureNoExtra` declares no extraKeys.
  useIsMutating({ mutationKey: ['fixtureNoExtra', { scope: 'x' }] });
}
