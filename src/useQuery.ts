import {
  useQuery as useTanstackQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { withKey } from './withKey';

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
 * Two call forms:
 * - `useQuery(queryKey, options?)` — the name (and its `extraKeys`, when
 *   declared) are type-checked through the first argument.
 * - `useQuery(definition)` — a full definition, typically from
 *   {@link appQueryOptions}, so the query is declared once and reused.
 *
 * The registered `response` becomes the default `TQueryFnData` (and `TData`,
 * unless `select` narrows it). Inside `queryFn`, `ctx.queryKey` is the typed tuple.
 *
 * @example
 * const user = useQuery(['fetchUser', { userId: '1' }], {
 *   queryFn: (ctx) => api.getUser(ctx.queryKey[1].userId), // `userId` is typed
 * });
 *
 * @example // reusing a definition
 * const user = useQuery(userQuery('1'));
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
): UseQueryResult<TData, TError>;
export function useQuery<
  K extends keyof AppQueriesRegistry,
  TQueryFnData = QueryResponse<K>,
  TError = Error,
  TData = TQueryFnData,
>(
  definition: AppQueryOptions<K, TQueryFnData, TError, TData> & {
    queryKey: AppQueryKey<K>;
  },
): UseQueryResult<TData, TError>;
export function useQuery(
  keyOrDefinition: readonly unknown[] | object,
  options?: object,
): UseQueryResult {
  return useTanstackQuery(withKey<UseQueryOptions>('queryKey', keyOrDefinition, options));
}
