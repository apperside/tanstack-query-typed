/**
 * Self-contained type surface + seed code for the interactive playground.
 *
 * The library is types-only, so the playground's whole job is to run the
 * TypeScript compiler in the browser (via Monaco) against the real key/payload/
 * response semantics. `LIB_DTS` is injected into Monaco as an ambient module so
 * `import … from 'tanstack-query-typed'` resolves and type-checks; it mirrors the
 * conditional types in `../../../src/types.ts` but stubs the TanStack return
 * shapes locally instead of pulling in the full `@tanstack/react-query` types —
 * key correctness (what this library actually checks) doesn't depend on them.
 */

/** Ambient declaration injected into Monaco's TypeScript worker. */
export const LIB_DTS = `
declare module 'tanstack-query-typed' {
  /** Augment these via \`declare module 'tanstack-query-typed'\` to register your app. */
  export interface AppMutationsMap {}
  export interface AppQueriesMap {}

  export type MutationPayload<K extends keyof AppMutationsMap> =
    AppMutationsMap[K] extends { payload: infer P } ? P : void;
  export type MutationResponse<K extends keyof AppMutationsMap> =
    AppMutationsMap[K] extends { response: infer R } ? R : unknown;
  export type MutationExtraKeys<K extends keyof AppMutationsMap> =
    AppMutationsMap[K] extends { extraKeys: infer E } ? E : never;
  export type AppMutationKey<K extends keyof AppMutationsMap> =
    [MutationExtraKeys<K>] extends [never] ? [K] : [K, MutationExtraKeys<K>];

  export type QueryResponse<K extends keyof AppQueriesMap> =
    AppQueriesMap[K] extends { response: infer R } ? R : unknown;
  export type QueryExtraKeys<K extends keyof AppQueriesMap> =
    AppQueriesMap[K] extends { extraKeys: infer E } ? E : never;
  export type AppQueryKey<K extends keyof AppQueriesMap> =
    [QueryExtraKeys<K>] extends [never] ? [K] : [K, QueryExtraKeys<K>];

  export interface QueryResult<TData> {
    data: TData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  }
  export interface MutationResult<K extends keyof AppMutationsMap> {
    mutate: (variables: MutationPayload<K>) => void;
    mutateAsync: (variables: MutationPayload<K>) => Promise<MutationResponse<K>>;
    data: MutationResponse<K> | undefined;
    isPending: boolean;
  }

  export function useAppQuery<K extends keyof AppQueriesMap, TData = QueryResponse<K>>(
    queryKey: AppQueryKey<K>,
    options?: {
      queryFn?: (ctx: { queryKey: AppQueryKey<K> }) => QueryResponse<K> | Promise<QueryResponse<K>>;
      select?: (data: QueryResponse<K>) => TData;
      enabled?: boolean;
    },
  ): QueryResult<TData>;

  export function useAppMutation<K extends keyof AppMutationsMap>(
    mutationKey: AppMutationKey<K>,
    options?: {
      mutationFn?: (variables: MutationPayload<K>) => MutationResponse<K> | Promise<MutationResponse<K>>;
      onSuccess?: (data: MutationResponse<K>, variables: MutationPayload<K>) => void;
    },
  ): MutationResult<K>;
}
`;

/** Starting code shown in the editor (and in the static fallback before it loads). */
export const SEED_CODE = `import { useAppQuery, useAppMutation } from 'tanstack-query-typed';

// 1. Register your queries and mutations once, by name.
declare module 'tanstack-query-typed' {
  interface AppQueriesMap {
    fetchUser: {
      response: { id: string; name: string };
      extraKeys: { userId: string };
    };
    fetchSettings: {
      response: { theme: 'light' | 'dark' };
      // no extraKeys -> the key is just ['fetchSettings']
    };
  }
  interface AppMutationsMap {
    updateUser: {
      payload: { id: string; name: string };
      response: { updatedAt: string };
      extraKeys: { tenantId: string };
    };
  }
}

// 2. Use them. Keys, payloads and responses are all type-checked.

// \`userId\` is required because fetchUser declares extraKeys.
const user = useAppQuery(['fetchUser', { userId: 'u-1' }], {
  queryFn: (ctx) => ({ id: ctx.queryKey[1].userId, name: 'Ada' }),
});

// No extraKeys -> the key is just ['fetchSettings'].
const settings = useAppQuery(['fetchSettings'], {
  queryFn: () => ({ theme: 'light' as const }),
});

const updateUser = useAppMutation(['updateUser', { tenantId: 't-1' }], {
  mutationFn: (vars) => Promise.resolve({ updatedAt: vars.id + ':' + vars.name }),
});
updateUser.mutate({ id: '1', name: 'Ada' });

// 3. Now break something and watch the compiler catch it below:
//    * remove { userId: 'u-1' }            -> missing required key segment
//    * rename 'fetchUser' to 'nope'        -> unknown query name
//    * updateUser.mutate({ id: 1 })        -> wrong payload type

console.log(user.data, settings.data, updateUser.data);
`;
