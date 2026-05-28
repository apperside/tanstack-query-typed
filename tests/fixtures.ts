/**
 * Shared test fixtures.
 *
 * Registers the mutation and query entries used by all `*.test-d.ts` files in
 * this directory. Because TypeScript merges `declare module` augmentations
 * across every file in the program, these entries are visible from each test
 * file without an explicit import.
 *
 * Names are test-specific (`fixture*`) to avoid colliding with the
 * augmentations declared in `examples/usage.ts`.
 */

declare module 'tanstack-query-typed' {
  interface AppMutationsMap {
    fixtureWithExtra: {
      payload: { amount: number };
      response: { ok: true };
      extraKeys: { scope: string };
    };
    fixtureNoExtra: {
      payload: { reason: string };
      response: { receiptId: string };
    };
  }

  interface AppQueriesMap {
    fixtureQueryWithExtra: {
      response: { id: string; label: string };
      extraKeys: { id: string };
    };
    fixtureQueryNoExtra: {
      response: { count: number };
    };
  }
}

export {};
