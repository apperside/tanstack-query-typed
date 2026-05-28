/**
 * Compile-time type tests for `useAppMutation` and the mutation helper types.
 *
 * Checked by `npm run typecheck`. Uses `expect-type` for precise positive
 * assertions; the negative `@ts-expect-error` cases live in `examples/usage.ts`.
 *
 * The hook is invoked inside a function that is exported but never called —
 * TypeScript checks the body without executing it, so React's rules-of-hooks
 * are irrelevant here.
 *
 * Mutation fixtures (`fixtureWithExtra`, `fixtureNoExtra`) are registered in
 * `./fixtures.ts` and visible here via global module augmentation merging.
 */
import { expectTypeOf } from 'expect-type';

import {
  useAppMutation,
  type AppMutationKey,
  type AppMutationOptions,
  type MutationExtraKeys,
  type MutationPayload,
  type MutationResponse,
} from 'tanstack-query-typed';

// --- Helper-type extractions --------------------------------------------------

expectTypeOf<MutationPayload<'fixtureWithExtra'>>().toEqualTypeOf<{ amount: number }>();
expectTypeOf<MutationResponse<'fixtureWithExtra'>>().toEqualTypeOf<{ ok: true }>();
expectTypeOf<MutationExtraKeys<'fixtureWithExtra'>>().toEqualTypeOf<{ scope: string }>();

expectTypeOf<MutationPayload<'fixtureNoExtra'>>().toEqualTypeOf<{ reason: string }>();
expectTypeOf<MutationResponse<'fixtureNoExtra'>>().toEqualTypeOf<{ receiptId: string }>();
expectTypeOf<MutationExtraKeys<'fixtureNoExtra'>>().toBeNever();

// --- Key shape ----------------------------------------------------------------

expectTypeOf<AppMutationKey<'fixtureWithExtra'>>().toEqualTypeOf<
  ['fixtureWithExtra', { scope: string }]
>();
expectTypeOf<AppMutationKey<'fixtureNoExtra'>>().toEqualTypeOf<['fixtureNoExtra']>();

// --- Options: `mutationKey` must be stripped ---------------------------------

expectTypeOf<AppMutationOptions<'fixtureWithExtra'>>().not.toHaveProperty('mutationKey');

// `mutationFn`'s first argument is bound to the registered payload.
type FixtureMutationFn = NonNullable<AppMutationOptions<'fixtureWithExtra'>['mutationFn']>;
expectTypeOf<Parameters<FixtureMutationFn>[0]>().toEqualTypeOf<{ amount: number }>();

// --- Hook return: data, mutate, mutateAsync ----------------------------------

export function _hookReturnTypeTests() {
  // `mutationFn` returns exactly the registered response, so `TData` resolves
  // to that response (the generic default). This is the common case.
  const m = useAppMutation(['fixtureWithExtra', { scope: 'global' }], {
    mutationFn: () => Promise.resolve({ ok: true as const }),
  });

  // `mutate`/`mutateAsync` accept the registered payload.
  expectTypeOf<Parameters<typeof m.mutate>[0]>().toEqualTypeOf<{ amount: number }>();
  expectTypeOf<Parameters<typeof m.mutateAsync>[0]>().toEqualTypeOf<{ amount: number }>();

  // `data` is the registered response unioned with `undefined` (TanStack's
  // state-discriminated result type).
  expectTypeOf(m.data).toEqualTypeOf<{ ok: true } | undefined>();

  // `mutateAsync` resolves with the registered response type.
  expectTypeOf<Awaited<ReturnType<typeof m.mutateAsync>>>().toEqualTypeOf<{ ok: true }>();

  // Entry without `extraKeys`: the key is a single-element tuple, and `vars`
  // inside `mutationFn` is bound to the registered payload.
  const n = useAppMutation(['fixtureNoExtra'], {
    mutationFn: (vars) => Promise.resolve({ receiptId: vars.reason }),
  });
  expectTypeOf(n.data).toEqualTypeOf<{ receiptId: string } | undefined>();

  // Explicit `TData` override narrows the result while payload stays bound.
  const o = useAppMutation<'fixtureWithExtra', { custom: number }>(
    ['fixtureWithExtra', { scope: 'global' }],
    { mutationFn: (vars) => Promise.resolve({ custom: vars.amount }) },
  );
  expectTypeOf(o.data).toEqualTypeOf<{ custom: number } | undefined>();
  expectTypeOf<Parameters<typeof o.mutate>[0]>().toEqualTypeOf<{ amount: number }>();

  // `mutationFn` may return a wider type than the registered response; in that
  // case TanStack-style inference widens `TData` to that return type. This
  // documents the behavior so it doesn't regress silently.
  const wider = useAppMutation(['fixtureWithExtra', { scope: 'global' }], {
    mutationFn: (vars) => Promise.resolve({ ok: true as const, echoed: vars.amount }),
  });
  expectTypeOf(wider.data).toEqualTypeOf<{ ok: true; echoed: number } | undefined>();
}
