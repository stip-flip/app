import { getSdk, type Sdk } from "src/hooks/subgraph";
import { GraphQLClient } from "graphql-request";
import { derived, type Readable } from "svelte/store";
import { chainId, signer } from "svelte-ethers-store";
import type { GoerliSdk } from "eth-sdk/build";

const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/ticruz38/five"
);
// export const gqlsdk = getSdk(client);

export const gqlsdk: Readable<Sdk> = derived(
  [signer, chainId],
  ([$signer, $chainId], set) => {
    switch ($chainId) {
      case 5:
        const goerli = new GraphQLClient(
          "https://api.thegraph.com/subgraphs/name/ticruz38/five"
        );
        set(getSdk(goerli));
        break;
      case 63:
        const mordor = new GraphQLClient(
          "https://graphiql.sf.exchange/subgraphs/name/sotachi/sf"
        );
        set(getSdk(mordor));
        break;
      default:
        break;
    }
  }
);
