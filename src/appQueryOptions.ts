import type {
  AppQueriesRegistry,
  AppQueryDefinition,
  AppQueryKey,
  QueryResponse,
} from './types';

/**
 * Typed counterpart of TanStack's `queryOptions`: declares a query **once** so
 * the same definition can feed a route loader and a component without
 * repeating the key or the `queryFn`.
 *
 * Zero-runtime: it only merges the key into the options object.
 *
 * @param queryKey - `[name]`, or `[name, extraKeys]` when the entry declares `extraKeys`.
 * @param options - The usual query options, minus `queryKey`. `queryFn` cannot be `skipToken`.
 *
 * @example
 * export const userQuery = (userId: string) =>
 *   appQueryOptions(['fetchUser', { userId }], {
 *     queryFn: (ctx) => api.getUser(ctx.queryKey[1].userId),
 *   });
 *
 * await queryClient.ensureQueryData(userQuery('1')); // e.g. in a route loader
 * const { data } = useSuspenseQuery(userQuery('1')); // in the component
 */
export function appQueryOptions<
  K extends keyof AppQueriesRegistry,
  TQueryFnData = QueryResponse<K>,
  TError = Error,
  TData = TQueryFnData,
>(
  queryKey: AppQueryKey<K>,
  options?: Omit<AppQueryDefinition<K, TQueryFnData, TError, TData>, 'queryKey'>,
): AppQueryDefinition<K, TQueryFnData, TError, TData> {
  return { queryKey, ...options } as AppQueryDefinition<K, TQueryFnData, TError, TData>;
}
