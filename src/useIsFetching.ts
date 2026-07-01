import {
  useIsFetching as useTanstackIsFetching,
  type QueryClient,
  type QueryFilters,
} from '@tanstack/react-query';

import type { AnyAppQueryKey } from './types';

/**
 * A thin wrapper around TanStack Query's `useIsFetching` whose `filters.queryKey`
 * is strongly typed against the {@link AppQueriesRegistry} registry.
 *
 * Returns the number of queries currently fetching, optionally narrowed by
 * `filters`. The `queryKey` filter accepts a full registered key or a `[name]`
 * prefix — unknown names are rejected at compile time.
 *
 * @param filters - Standard `useIsFetching` filters, with `queryKey` typed to the registry.
 * @param queryClient - Optional client to read from instead of the context client.
 *
 * @example
 * const fetching = useIsFetching(); // total in-flight queries
 *
 * @example // scoped to a registered query name
 * const fetchingUser = useIsFetching({ queryKey: ['fetchUser'] }); // ✅ name-checked
 * useIsFetching({ queryKey: ['nope'] }); //                          ❌ unknown query name
 */
export function useIsFetching(
  filters?: QueryFilters<AnyAppQueryKey>,
  queryClient?: QueryClient,
): number {
  return useTanstackIsFetching(filters, queryClient);
}
