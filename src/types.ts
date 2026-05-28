import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

/**
 * Registry of every mutation in your application.
 *
 * This interface is intentionally empty. Consumers populate it through
 * [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html),
 * registering one entry per mutation. Each entry describes:
 *
 * - `payload`  — the variables passed to the mutation (the `mutationFn` argument
 *                and the value accepted by `mutate` / `mutateAsync`). Omit it for
 *                mutations that take no input.
 * - `response` — the data the mutation resolves to (the hook's `TData`).
 * - `extraKeys`— an optional extra segment appended to the mutation key. When
 *                present, the key becomes `[name, extraKeys]`; otherwise `[name]`.
 *
 * @example
 * declare module 'tanstack-query-typed' {
 *   interface AppMutationsMap {
 *     updateUser: {
 *       payload: { id: string; name: string };
 *       response: { updatedAt: string };
 *       extraKeys: { tenantId: string };
 *     };
 *     logout: {
 *       payload: { reason?: string };
 *       response: { ok: true };
 *       // no `extraKeys` -> key is `['logout']`
 *     };
 *   }
 * }
 */
export interface AppMutationsMap {}

/** The variables (payload) accepted by mutation `K`. Falls back to `void`. */
export type MutationPayload<K extends keyof AppMutationsMap> =
  AppMutationsMap[K] extends { payload: infer P } ? P : void;

/** The data returned by mutation `K`. Falls back to `unknown`. */
export type MutationResponse<K extends keyof AppMutationsMap> =
  AppMutationsMap[K] extends { response: infer R } ? R : unknown;

/** The extra key segment for mutation `K`, or `never` when none is declared. */
export type MutationExtraKeys<K extends keyof AppMutationsMap> =
  AppMutationsMap[K] extends { extraKeys: infer E } ? E : never;

/**
 * The strongly typed mutation key for mutation `K`:
 * `[K]` when no `extraKeys` are declared, otherwise `[K, extraKeys]`.
 */
export type AppMutationKey<K extends keyof AppMutationsMap> =
  [MutationExtraKeys<K>] extends [never] ? [K] : [K, MutationExtraKeys<K>];

/**
 * Options for {@link useAppMutation}: the standard TanStack `UseMutationOptions`
 * with `mutationKey` removed (it is supplied as the first argument instead) and
 * `TData` / `TVariables` pre-bound from {@link AppMutationsMap}.
 */
export type AppMutationOptions<
  K extends keyof AppMutationsMap,
  TData = MutationResponse<K>,
  TError = Error,
  TContext = unknown,
> = Omit<
  UseMutationOptions<TData, TError, MutationPayload<K>, TContext>,
  'mutationKey'
>;

// === Queries ================================================================

/**
 * Registry of every query in your application.
 *
 * Augment this interface (via declaration merging) to register queries. Each
 * entry describes:
 *
 * - `response`  — the data the query resolves to. Becomes the default
 *                 `TQueryFnData` (the `queryFn` return type) and the default
 *                 `TData` (the hook's `.data`), unless a `select` transform
 *                 narrows it.
 * - `extraKeys` — an optional extra segment appended to the query key. When
 *                 present, the key becomes `[name, extraKeys]`; otherwise
 *                 `[name]`. This segment is part of cache identity AND is
 *                 visible to `queryFn` via `ctx.queryKey`.
 *
 * Queries have no separate `payload`: in TanStack Query the inputs to a query
 * ARE its key — anything that affects the result must be in the key, otherwise
 * the cache is incorrect. Use `extraKeys` for those inputs.
 *
 * @example
 * declare module 'tanstack-query-typed' {
 *   interface AppQueriesMap {
 *     fetchUser: {
 *       response: { id: string; name: string };
 *       extraKeys: { userId: string };
 *     };
 *     fetchSettings: {
 *       response: { theme: 'light' | 'dark' };
 *       // no `extraKeys` -> key is `['fetchSettings']`
 *     };
 *   }
 * }
 */
export interface AppQueriesMap {}

/** The data returned by query `K`. Falls back to `unknown`. */
export type QueryResponse<K extends keyof AppQueriesMap> =
  AppQueriesMap[K] extends { response: infer R } ? R : unknown;

/** The extra key segment for query `K`, or `never` when none is declared. */
export type QueryExtraKeys<K extends keyof AppQueriesMap> =
  AppQueriesMap[K] extends { extraKeys: infer E } ? E : never;

/**
 * The strongly typed query key for query `K`:
 * `[K]` when no `extraKeys` are declared, otherwise `[K, extraKeys]`.
 */
export type AppQueryKey<K extends keyof AppQueriesMap> =
  [QueryExtraKeys<K>] extends [never] ? [K] : [K, QueryExtraKeys<K>];

/**
 * Options for {@link useAppQuery}: the standard TanStack `UseQueryOptions` with
 * `queryKey` removed (it is supplied as the first argument instead) and
 * `TQueryFnData` / `TQueryKey` pre-bound from {@link AppQueriesMap}.
 *
 * `TData` defaults to `TQueryFnData` so the hook return matches the registered
 * response; provide a `select` transform (or override `TData` explicitly) to
 * derive a different shape.
 */
export type AppQueryOptions<
  K extends keyof AppQueriesMap,
  TQueryFnData = QueryResponse<K>,
  TError = Error,
  TData = TQueryFnData,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, AppQueryKey<K>>,
  'queryKey'
>;

// === Registry-wide unions ====================================================

/** Union of every registered mutation key (full `[K]` / `[K, extraKeys]`). */
export type AnyAppMutationKey = {
  [K in keyof AppMutationsMap]: AppMutationKey<K>;
}[keyof AppMutationsMap];

/** Union of every registered query key (full `[K]` / `[K, extraKeys]`). */
export type AnyAppQueryKey = {
  [K in keyof AppQueriesMap]: AppQueryKey<K>;
}[keyof AppQueriesMap];

/**
 * Union of every registered mutation key OR the just-name prefix `[K]`. Used
 * for filter-based methods that should match a mutation by name regardless of
 * its `extraKeys`.
 */
export type AppMutationKeyOrPrefix = {
  [K in keyof AppMutationsMap]: [K] | AppMutationKey<K>;
}[keyof AppMutationsMap];

/**
 * Union of every registered query key OR the just-name prefix `[K]`. Used for
 * filter-based methods that should match a query by name regardless of its
 * `extraKeys`.
 */
export type AppQueryKeyOrPrefix = {
  [K in keyof AppQueriesMap]: [K] | AppQueryKey<K>;
}[keyof AppQueriesMap];
