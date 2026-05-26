import { getSdk, type Sdk } from "src/hooks/subgraph";
import { GraphQLClient } from "graphql-request";
import { derived, type Readable } from "svelte/store";
import { chainId } from "svelte-ethers-store";
import { resolvedTransactions } from "src/hooks/transactions";

const etc = new GraphQLClient(
    "https://ether-graphiql.stipflip.xyz/subgraphs/name/sotachi/sf-market",
);

const mordor = new GraphQLClient(
    "https://mordor-graphiql.stipflip.xyz/subgraphs/name/sotachi/sf-market",
);

type CacheEntry<T> = {
    expiresAt: number;
    promise: Promise<T>;
};

type QueryOptions<TVariables, TResult> = {
    chainId: number;
    operationName: string;
    ttlMs: number;
    query: (variables?: TVariables, requestHeaders?: HeadersInit) => Promise<TResult>;
};

type SdkQuery = (variables?: unknown, requestHeaders?: HeadersInit) => Promise<unknown>;

const gqlCache = new Map<string, CacheEntry<unknown>>();

const defaultTtlMs = 30_000;
const operationTtls: Partial<Record<keyof Sdk, number>> = {
    getMarketDetail: 10_000,
    getOracleDetail: 10_000,
    getPositions: 10_000,
    getClaims: 10_000,
    getPositionClaims: 10_000,
    getUniPositions: 10_000,
};

let lastChainId: number | undefined;
let lastResolvedCount = 0;

function clearGqlCache() {
    gqlCache.clear();
}

function stableStringify(value: unknown): string {
    if (value === null || typeof value !== "object") {
        return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
        return `[${value.map(stableStringify).join(",")}]`;
    }

    return `{${Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
        .join(",")}}`;
}

function cachedQuery<TVariables, TResult>({
    chainId,
    operationName,
    ttlMs,
    query,
}: QueryOptions<TVariables, TResult>) {
    return async (variables?: TVariables, requestHeaders?: HeadersInit) => {
        if (requestHeaders) {
            return query(variables, requestHeaders);
        }

        const key = stableStringify([chainId, operationName, variables]);
        const now = Date.now();
        const cached = gqlCache.get(key);

        if (cached && cached.expiresAt > now) {
            return cached.promise as Promise<TResult>;
        }

        const promise = query(variables).catch((error) => {
            gqlCache.delete(key);
            throw error;
        });

        gqlCache.set(key, {
            expiresAt: now + ttlMs,
            promise,
        });

        return promise;
    };
}

function withCache(sdk: Sdk, currentChainId: number): Sdk {
    const sdkQueries = sdk as Record<keyof Sdk, SdkQuery>;

    return (Object.fromEntries(
        (Object.entries(sdkQueries) as [keyof Sdk, SdkQuery][]).map(([operationName, query]) => [
            operationName,
            cachedQuery({
                chainId: currentChainId,
                operationName: String(operationName),
                ttlMs: operationTtls[operationName] || defaultTtlMs,
                query,
            }),
        ])
    ) as unknown) as Sdk;
}

export const gqlsdk: Readable<Sdk> = derived(
    [chainId, resolvedTransactions],
    ([$chainId, $resolvedTransactions], set) => {
        const currentChainId = Number($chainId) || 63;
        const resolvedCount = $resolvedTransactions.length;

        if (lastChainId !== currentChainId || lastResolvedCount !== resolvedCount) {
            clearGqlCache();
            lastChainId = currentChainId;
            lastResolvedCount = resolvedCount;
        }

        switch (currentChainId) {
            case 61:
                set(withCache(getSdk(etc), currentChainId));
                break;
            case 63:
                set(withCache(getSdk(mordor), currentChainId));
                break;
            default:
                set(withCache(getSdk(mordor), currentChainId));
                break;
        }
    },
);
