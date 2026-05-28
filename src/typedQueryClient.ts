import {
  useQueryClient,
  type CancelOptions,
  type EnsureQueryDataOptions,
  type FetchQueryOptions,
  type InvalidateOptions,
  type InvalidateQueryFilters,
  type MutationFilters,
  type MutationObserverOptions,
  type QueryClient,
  type QueryFilters,
  type QueryState,
  type RefetchOptions,
  type RefetchQueryFilters,
  type ResetOptions,
  type SetDataOptions,
  type Updater,
} from '@tanstack/react-query';

import type {
  AnyAppQueryKey,
  AppMutationKey,
  AppMutationKeyOrPrefix,
  AppMutationsMap,
  AppQueriesMap,
  AppQueryKey,
  MutationPayload,
  MutationResponse,
  QueryResponse,
} from './types';

/**
 * Mutation filter shape with a strongly typed `mutationKey`.
 *
 * TanStack's `MutationFilters` types `mutationKey` as `TuplePrefixes<MutationKey>`
 * using the global `MutationKey`, which can't be narrowed per call — so we
 * re-add the field with our registry-typed union (full key or `[name]` prefix).
 */
export type AppMutationFilters<
  TData = unknown,
  TError = Error,
  TVariables = unknown,
  TContext = unknown,
> = Omit<MutationFilters<TData, TError, TVariables, TContext>, 'mutationKey'> & {
  mutationKey?: AppMutationKeyOrPrefix;
};

/**
 * `QueryClient` strongly typed against the {@link AppQueriesMap} and
 * {@link AppMutationsMap} registries.
 *
 * Identical to TanStack's `QueryClient` except every key-taking method accepts
 * only registered keys (or `[name]` prefixes), and return types narrow to the
 * registered response shape.
 *
 * ### Methods that are typed (overridden below)
 * - **Single queryKey:** `getQueryData`, `setQueryData`, `getQueryState`
 * - **Filters:** `invalidateQueries`, `refetchQueries`, `removeQueries`,
 *   `resetQueries`, `cancelQueries`
 * - **Counters:** `isFetching`, `isMutating`
 * - **Imperative fetches:** `fetchQuery`, `prefetchQuery`, `ensureQueryData`
 * - **Mutation defaults:** `setMutationDefaults`, `getMutationDefaults`
 *
 * ### Methods that fall through untyped (inherited from `QueryClient`)
 * No work needed (no keys involved):
 * `mount`, `unmount`, `clear`, `resumePausedMutations`, `getQueryCache`,
 * `getMutationCache`, `getDefaultOptions`, `setDefaultOptions`,
 * `defaultQueryOptions`, `defaultMutationOptions`.
 *
 * Out of scope for this iteration — open an issue if you need them:
 * - `getQueriesData` / `setQueriesData` — filter-based cross-query
 *   reads/writes; a filter can match queries with different response shapes,
 *   so the return type would need to be a union.
 * - `fetchInfiniteQuery` / `prefetchInfiniteQuery` / `ensureInfiniteQueryData`
 *   — our registry has no pagination concept (no `pageParam`).
 * - `setQueryDefaults` / `getQueryDefaults` — per-query defaults; lower
 *   priority than mutation defaults.
 */
export type TypedQueryClient = Omit<
  QueryClient,
  | 'getQueryData'
  | 'setQueryData'
  | 'getQueryState'
  | 'invalidateQueries'
  | 'refetchQueries'
  | 'removeQueries'
  | 'resetQueries'
  | 'cancelQueries'
  | 'isFetching'
  | 'isMutating'
  | 'fetchQuery'
  | 'prefetchQuery'
  | 'ensureQueryData'
  | 'setMutationDefaults'
  | 'getMutationDefaults'
> & {
  // ----- Single-queryKey methods -----

  getQueryData<K extends keyof AppQueriesMap>(
    queryKey: AppQueryKey<K>,
  ): QueryResponse<K> | undefined;

  setQueryData<K extends keyof AppQueriesMap>(
    queryKey: AppQueryKey<K>,
    updater: Updater<QueryResponse<K> | undefined, QueryResponse<K> | undefined>,
    options?: SetDataOptions,
  ): QueryResponse<K> | undefined;

  getQueryState<K extends keyof AppQueriesMap, TError = Error>(
    queryKey: AppQueryKey<K>,
  ): QueryState<QueryResponse<K>, TError> | undefined;

  // ----- Filter methods (queries) -----

  invalidateQueries(
    filters?: InvalidateQueryFilters<AnyAppQueryKey>,
    options?: InvalidateOptions,
  ): Promise<void>;

  refetchQueries(
    filters?: RefetchQueryFilters<AnyAppQueryKey>,
    options?: RefetchOptions,
  ): Promise<void>;

  removeQueries(filters?: QueryFilters<AnyAppQueryKey>): void;

  resetQueries(
    filters?: QueryFilters<AnyAppQueryKey>,
    options?: ResetOptions,
  ): Promise<void>;

  cancelQueries(
    filters?: QueryFilters<AnyAppQueryKey>,
    cancelOptions?: CancelOptions,
  ): Promise<void>;

  // ----- Counters -----

  isFetching(filters?: QueryFilters<AnyAppQueryKey>): number;

  isMutating(filters?: AppMutationFilters): number;

  // ----- Options-based query methods -----

  fetchQuery<
    K extends keyof AppQueriesMap,
    TError = Error,
    TData = QueryResponse<K>,
  >(
    options: FetchQueryOptions<QueryResponse<K>, TError, TData, AppQueryKey<K>>,
  ): Promise<TData>;

  prefetchQuery<
    K extends keyof AppQueriesMap,
    TError = Error,
    TData = QueryResponse<K>,
  >(
    options: FetchQueryOptions<QueryResponse<K>, TError, TData, AppQueryKey<K>>,
  ): Promise<void>;

  ensureQueryData<
    K extends keyof AppQueriesMap,
    TError = Error,
    TData = QueryResponse<K>,
  >(
    options: EnsureQueryDataOptions<QueryResponse<K>, TError, TData, AppQueryKey<K>>,
  ): Promise<TData>;

  // ----- Mutation defaults -----

  setMutationDefaults<
    K extends keyof AppMutationsMap,
    TError = Error,
    TContext = unknown,
  >(
    mutationKey: AppMutationKey<K>,
    options: Omit<
      MutationObserverOptions<
        MutationResponse<K>,
        TError,
        MutationPayload<K>,
        TContext
      >,
      'mutationKey'
    >,
  ): void;

  getMutationDefaults<K extends keyof AppMutationsMap>(
    mutationKey: AppMutationKey<K>,
  ):
    | Omit<
        MutationObserverOptions<
          MutationResponse<K>,
          Error,
          MutationPayload<K>,
          unknown
        >,
        'mutationKey'
      >
    | undefined;
};

/**
 * Cast a vanilla TanStack `QueryClient` to a {@link TypedQueryClient}. Pure
 * type cast — zero runtime cost.
 *
 * Use this when constructing the client for `QueryClientProvider`:
 *
 * @example
 * const queryClient = asTypedQueryClient(new QueryClient());
 * queryClient.invalidateQueries({ queryKey: ['fetchUser'] });
 */
export function asTypedQueryClient(client: QueryClient): TypedQueryClient {
  return client as unknown as TypedQueryClient;
}

/**
 * React hook that returns the current `QueryClient` strongly typed against the
 * {@link AppQueriesMap} / {@link AppMutationsMap} registries. Mirrors
 * `useQueryClient` — pass an explicit client to override the context.
 *
 * @example
 * function Component() {
 *   const qc = useAppQueryClient();
 *   const cached = qc.getQueryData(['fetchUser', { userId: '1' }]);
 *   qc.invalidateQueries({ queryKey: ['fetchUser'] });
 * }
 */
export function useAppQueryClient(queryClient?: QueryClient): TypedQueryClient {
  return useQueryClient(queryClient) as unknown as TypedQueryClient;
}
