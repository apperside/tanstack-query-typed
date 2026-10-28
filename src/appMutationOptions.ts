import type {
  AppMutationDefinition,
  AppMutationKey,
  AppMutationOptions,
  AppMutationsRegistry,
  MutationResponse,
} from './types';

/**
 * Typed counterpart of TanStack's `mutationOptions`: declares a mutation
 * (including optimistic-update callbacks) **once**, outside any component, so
 * it can be reused by every `useMutation` call site.
 *
 * Zero-runtime: it only merges the key into the options object.
 *
 * @param mutationKey - `[name]`, or `[name, extraKeys]` when the entry declares `extraKeys`.
 * @param options - The usual mutation options, minus `mutationKey`.
 *
 * @example
 * export const updateUserMutation = appMutationOptions(['updateUser', { tenantId: 't-1' }], {
 *   mutationFn: (vars) => api.updateUser(vars),
 * });
 *
 * const updateUser = useMutation(updateUserMutation);
 */
export function appMutationOptions<
  K extends keyof AppMutationsRegistry,
  TData = MutationResponse<K>,
  TError = Error,
  TContext = unknown,
>(
  mutationKey: AppMutationKey<K>,
  options?: AppMutationOptions<K, TData, TError, TContext>,
): AppMutationDefinition<K, TData, TError, TContext> {
  return { mutationKey, ...options };
}
