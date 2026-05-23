import { getSdk, type Sdk } from "src/hooks/subgraph";
import { GraphQLClient } from "graphql-request";
import { derived, type Readable } from "svelte/store";
import { chainId, signer } from "svelte-ethers-store";

const etc = new GraphQLClient(
    "https://ether-graphiql.stipflip.xyz/subgraphs/name/sotachi/sf-market",
);

const mordor = new GraphQLClient(
    "https://mordor-graphiql.stipflip.xyz/subgraphs/name/sotachi/sf-market",
);

export const gqlsdk: Readable<Sdk> = derived(
    [signer, chainId],
    ([$signer, $chainId], set) => {
        switch (Number($chainId)) {
            case 61:
                set(getSdk(etc));
                break;
            case 63:
                set(getSdk(mordor));
                break;
            default:
                set(getSdk(mordor));
                break;
        }
    },
);
