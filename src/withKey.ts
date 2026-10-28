/**
 * Normalises the two hook call forms — `(key, options?)` and `(definition)` —
 * into the single options object TanStack expects. Internal helper: the public
 * overloads carry the typing, so this only reshapes values.
 */
export function withKey<TOptions>(
  keyProp: 'queryKey' | 'mutationKey',
  keyOrDefinition: readonly unknown[] | object,
  options?: object,
): TOptions {
  return (
    Array.isArray(keyOrDefinition) ? { [keyProp]: keyOrDefinition, ...options } : keyOrDefinition
  ) as TOptions;
}
