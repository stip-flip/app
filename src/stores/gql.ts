import { getSdk, type Sdk } from "src/hooks/subgraph";
import { GraphQLClient } from "graphql-request";
import { derived, type Readable } from "svelte/store";
import { chainId, signer } from "svelte-ethers-store";

export const gqlsdk: Readable<Sdk> = derived(
  [signer, chainId],
  ([$signer, $chainId], set) => {
    switch ($chainId) {
      case 61:
        console.log("61");
        const etc = new GraphQLClient(
          "https://ether-graphiql.sf.exchange/subgraphs/name/sotachi/sf-staging"
        );
        set(getSdk(etc));
        break;
      case 63:
        console.log("63");
        const mordor = new GraphQLClient(
          "https://mordor-graphiql.sf.exchange/subgraphs/name/sotachi/sf"
        );
        set(getSdk(mordor));
        break;
      default:
        break;
    }
  }
);
