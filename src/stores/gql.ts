import { getSdk } from "src/hooks/subgraph";
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/ticruz38/five"
);
export const gqlsdk = getSdk(client);
