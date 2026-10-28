import {
  useSuspenseQuery as useTanstackSuspenseQuery,
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';

import { withKey } from './withKey';

import type {
  AppQueriesRegistry,
  AppQueryKey,
  AppSuspenseQueryOptions,
  QueryResponse,
} from './types';

/**
 * A thin wrapper around TanStack Query's `useSuspenseQuery` with the same
 * registry-based typing as {@link useQuery}. `data` is never `undefined`:
 * loading and errors are handled by the nearest Suspense / error boundary.
 *
 * Accepts `(queryKey, options?)` or a full definition — typically the one a
 * route loader already passed to `ensureQueryData`, so SSR-prefetched data is
 * read from the cache without a second request.
 *
 * @example
 * const { data: user } = useSuspenseQuery(userQuery('1')); // `user` is defined
 *
 * @example
 * const { data } = useSuspenseQuery(['fetchSettings'], {
 *   queryFn: () => api.getSettings(),
 * });
 */
export function useSuspenseQuery<
  K extends keyof AppQueriesRegistry,
  TQueryFnData = QueryResponse<K>,
  TError = Error,
  TData = TQueryFnData,
>(
  queryKey: AppQueryKey<K>,
  options?: AppSuspenseQueryOptions<K, TQueryFnData, TError, TData>,
): UseSuspenseQueryResult<TData, TError>;
export function useSuspenseQuery<
  K extends keyof AppQueriesRegistry,
  TQueryFnData = QueryResponse<K>,
  TError = Error,
  TData = TQueryFnData,
>(
  definition: AppSuspenseQueryOptions<K, TQueryFnData, TError, TData> & {
    queryKey: AppQueryKey<K>;
  },
): UseSuspenseQueryResult<TData, TError>;
export function useSuspenseQuery(
  keyOrDefinition: readonly unknown[] | object,
  options?: object,
): UseSuspenseQueryResult {
  return useTanstackSuspenseQuery(
    withKey<UseSuspenseQueryOptions>('queryKey', keyOrDefinition, options),
  );
}
