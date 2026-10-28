import {
  useMutation as useTanstackMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import { withKey } from './withKey';

import type {
  AppMutationDefinition,
  AppMutationKey,
  AppMutationOptions,
  AppMutationsRegistry,
  MutationPayload,
  MutationResponse,
} from './types';

/**
 * A thin wrapper around TanStack Query's `useMutation` that enforces strongly
 * typed mutation keys, payloads and responses based on the {@link AppMutationsRegistry}
 * registry.
 *
 * Two call forms:
 * - `useMutation(mutationKey, options?)` — the name (and its `extraKeys`, when
 *   declared) are type-checked through the first argument.
 * - `useMutation(definition)` — a full definition from {@link appMutationOptions},
 *   so the mutation is declared once and reused.
 *
 * The `payload` and `response` from the registry flow into `mutationFn`,
 * `mutate`, `mutateAsync` and the returned data.
 *
 * @example
 * const mutation = useMutation(['updateUser', { tenantId: 't-1' }], {
 *   mutationFn: (vars) => api.updateUser(vars), // `vars` is fully typed
 * });
 *
 * mutation.mutate({ id: '1', name: 'Ada' }); // payload is type-checked
 *
 * @example // reusing a definition
 * const updateUser = useMutation(updateUserMutation);
 */
export function useMutation<
  K extends keyof AppMutationsRegistry,
  TData = MutationResponse<K>,
  TError = Error,
  TContext = unknown,
>(
  mutationKey: AppMutationKey<K>,
  options?: AppMutationOptions<K, TData, TError, TContext>,
): UseMutationResult<TData, TError, MutationPayload<K>, TContext>;
export function useMutation<
  K extends keyof AppMutationsRegistry,
  TData = MutationResponse<K>,
  TError = Error,
  TContext = unknown,
>(
  definition: AppMutationDefinition<K, TData, TError, TContext>,
): UseMutationResult<TData, TError, MutationPayload<K>, TContext>;
export function useMutation(
  keyOrDefinition: readonly unknown[] | object,
  options?: object,
): UseMutationResult<unknown, unknown, unknown, unknown> {
  return useTanstackMutation(
    withKey<UseMutationOptions<unknown, unknown, unknown, unknown>>(
      'mutationKey',
      keyOrDefinition,
      options,
    ),
  );
}
