import {
  useIsMutating as useTanstackIsMutating,
  type QueryClient,
} from '@tanstack/react-query';

import type { AppMutationFilters } from './typedQueryClient';

/**
 * A thin wrapper around TanStack Query's `useIsMutating` whose `filters.mutationKey`
 * is strongly typed against the {@link AppMutationsRegistry} registry.
 *
 * Returns the number of mutations currently running, optionally narrowed by
 * `filters`. The `mutationKey` filter accepts a full registered key or a `[name]`
 * prefix — unknown names are rejected at compile time.
 *
 * @param filters - Standard `useIsMutating` filters, with `mutationKey` typed to the registry.
 * @param queryClient - Optional client to read from instead of the context client.
 *
 * @example
 * const mutating = useIsMutating(); // total in-flight mutations
 *
 * @example // scoped to a registered mutation name
 * const savingUser = useIsMutating({ mutationKey: ['updateUser'] }); // ✅ name-checked
 * useIsMutating({ mutationKey: ['nope'] }); //                          ❌ unknown mutation name
 */
export function useIsMutating(
  filters?: AppMutationFilters,
  queryClient?: QueryClient,
): number {
  return useTanstackIsMutating(filters, queryClient);
}
