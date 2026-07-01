import { useQuery as useTanstackQuery, type UseQueryResult } from '@tanstack/react-query';

import type {
  AppQueriesRegistry,
  AppQueryKey,
  AppQueryOptions,
  QueryResponse,
} from './types';

/**
 * A thin wrapper around TanStack Query's `useQuery` that enforces strongly
 * typed query keys and responses based on the {@link AppQueriesRegistry} registry.
 *
 * The query name (and its `extraKeys`, when declared) are type-checked through
 * the first argument; the registered `response` becomes the default
 * `TQueryFnData` (and `TData`, unless `select` narrows it). Inside `queryFn`,
 * `ctx.queryKey` is the typed tuple.
 *
 * @param queryKey - `[name]`, or `[name, extraKeys]` when the entry declares `extraKeys`.
 * @param options - The usual `useQuery` options, minus `queryKey`.
 *
 * @example
 * const user = useQuery(['fetchUser', { userId: '1' }], {
 *   queryFn: (ctx) => api.getUser(ctx.queryKey[1].userId), // `userId` is typed
 * });
 *
 * @example // narrowing TData with `select`
 * const userName = useQuery(['fetchUser', { userId: '1' }], {
 *   queryFn: (ctx) => api.getUser(ctx.queryKey[1].userId),
 *   select: (data) => data.name, // `userName.data` becomes `string | undefined`
 * });
 */
export function useQuery<
  K extends keyof AppQueriesRegistry,
  TQueryFnData = QueryResponse<K>,
  TError = Error,
  TData = TQueryFnData,
>(
  queryKey: AppQueryKey<K>,
  options?: AppQueryOptions<K, TQueryFnData, TError, TData>,
): UseQueryResult<TData, TError> {
  return useTanstackQuery<TQueryFnData, TError, TData, AppQueryKey<K>>({
    queryKey,
    ...options,
  });
}
