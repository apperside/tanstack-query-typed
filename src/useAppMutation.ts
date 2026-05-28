import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import type {
  AppMutationKey,
  AppMutationOptions,
  AppMutationsMap,
  MutationPayload,
  MutationResponse,
} from './types';

/**
 * A thin wrapper around TanStack Query's `useMutation` that enforces strongly
 * typed mutation keys, payloads and responses based on the {@link AppMutationsMap}
 * registry.
 *
 * The mutation name (and its `extraKeys`, when declared) are type-checked through
 * the first argument; the `payload` and `response` from the registry flow into
 * `mutationFn`, `mutate`, `mutateAsync` and the returned data.
 *
 * @param mutationKey - `[name]`, or `[name, extraKeys]` when the entry declares `extraKeys`.
 * @param options - The usual `useMutation` options, minus `mutationKey`.
 *
 * @example
 * const mutation = useAppMutation(['updateUser', { tenantId: 't-1' }], {
 *   mutationFn: (vars) => api.updateUser(vars), // `vars` is fully typed
 * });
 *
 * mutation.mutate({ id: '1', name: 'Ada' }); // payload is type-checked
 */
export function useAppMutation<
  K extends keyof AppMutationsMap,
  TData = MutationResponse<K>,
  TError = Error,
  TContext = unknown,
>(
  mutationKey: AppMutationKey<K>,
  options?: AppMutationOptions<K, TData, TError, TContext>,
): UseMutationResult<TData, TError, MutationPayload<K>, TContext> {
  return useMutation<TData, TError, MutationPayload<K>, TContext>({
    mutationKey,
    ...options,
  });
}
