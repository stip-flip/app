import type { GraphQLClient } from "graphql-request";
import type * as Dom from "graphql-request/dist/types.dom";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: number;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars["Int"];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars["Bytes"]>;
  number?: InputMaybe<Scalars["Int"]>;
  number_gte?: InputMaybe<Scalars["Int"]>;
};

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type Pool = {
  __typename?: "Pool";
  collateral: Scalars["Bytes"];
  fee: Scalars["Int"];
  id: Scalars["ID"];
  long: Scalars["Boolean"];
  oracle: Scalars["Bytes"];
  ticks: Array<Tick>;
};

export type PoolTicksArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Tick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Tick_Filter>;
};

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  collateral?: InputMaybe<Scalars["Bytes"]>;
  collateral_contains?: InputMaybe<Scalars["Bytes"]>;
  collateral_gt?: InputMaybe<Scalars["Bytes"]>;
  collateral_gte?: InputMaybe<Scalars["Bytes"]>;
  collateral_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  collateral_lt?: InputMaybe<Scalars["Bytes"]>;
  collateral_lte?: InputMaybe<Scalars["Bytes"]>;
  collateral_not?: InputMaybe<Scalars["Bytes"]>;
  collateral_not_contains?: InputMaybe<Scalars["Bytes"]>;
  collateral_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  fee?: InputMaybe<Scalars["Int"]>;
  fee_gt?: InputMaybe<Scalars["Int"]>;
  fee_gte?: InputMaybe<Scalars["Int"]>;
  fee_in?: InputMaybe<Array<Scalars["Int"]>>;
  fee_lt?: InputMaybe<Scalars["Int"]>;
  fee_lte?: InputMaybe<Scalars["Int"]>;
  fee_not?: InputMaybe<Scalars["Int"]>;
  fee_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  long?: InputMaybe<Scalars["Boolean"]>;
  long_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  long_not?: InputMaybe<Scalars["Boolean"]>;
  long_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  oracle?: InputMaybe<Scalars["Bytes"]>;
  oracle_contains?: InputMaybe<Scalars["Bytes"]>;
  oracle_gt?: InputMaybe<Scalars["Bytes"]>;
  oracle_gte?: InputMaybe<Scalars["Bytes"]>;
  oracle_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  oracle_lt?: InputMaybe<Scalars["Bytes"]>;
  oracle_lte?: InputMaybe<Scalars["Bytes"]>;
  oracle_not?: InputMaybe<Scalars["Bytes"]>;
  oracle_not_contains?: InputMaybe<Scalars["Bytes"]>;
  oracle_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  ticks_?: InputMaybe<Tick_Filter>;
};

export enum Pool_OrderBy {
  Collateral = "collateral",
  Fee = "fee",
  Id = "id",
  Long = "long",
  Oracle = "oracle",
  Ticks = "ticks",
}

export type Position = {
  __typename?: "Position";
  amount: Scalars["BigInt"];
  id: Scalars["ID"];
  owner: Scalars["Bytes"];
  pool: Pool;
  tickLower: Scalars["Int"];
  tickUpper: Scalars["Int"];
};

export type Position_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigInt"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  and?: InputMaybe<Array<InputMaybe<Position_Filter>>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  or?: InputMaybe<Array<InputMaybe<Position_Filter>>>;
  owner?: InputMaybe<Scalars["Bytes"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_gt?: InputMaybe<Scalars["Bytes"]>;
  owner_gte?: InputMaybe<Scalars["Bytes"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_lt?: InputMaybe<Scalars["Bytes"]>;
  owner_lte?: InputMaybe<Scalars["Bytes"]>;
  owner_not?: InputMaybe<Scalars["Bytes"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  pool?: InputMaybe<Scalars["String"]>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars["String"]>;
  pool_contains_nocase?: InputMaybe<Scalars["String"]>;
  pool_ends_with?: InputMaybe<Scalars["String"]>;
  pool_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  pool_gt?: InputMaybe<Scalars["String"]>;
  pool_gte?: InputMaybe<Scalars["String"]>;
  pool_in?: InputMaybe<Array<Scalars["String"]>>;
  pool_lt?: InputMaybe<Scalars["String"]>;
  pool_lte?: InputMaybe<Scalars["String"]>;
  pool_not?: InputMaybe<Scalars["String"]>;
  pool_not_contains?: InputMaybe<Scalars["String"]>;
  pool_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  pool_not_ends_with?: InputMaybe<Scalars["String"]>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  pool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  pool_not_starts_with?: InputMaybe<Scalars["String"]>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  pool_starts_with?: InputMaybe<Scalars["String"]>;
  pool_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  tickLower?: InputMaybe<Scalars["Int"]>;
  tickLower_gt?: InputMaybe<Scalars["Int"]>;
  tickLower_gte?: InputMaybe<Scalars["Int"]>;
  tickLower_in?: InputMaybe<Array<Scalars["Int"]>>;
  tickLower_lt?: InputMaybe<Scalars["Int"]>;
  tickLower_lte?: InputMaybe<Scalars["Int"]>;
  tickLower_not?: InputMaybe<Scalars["Int"]>;
  tickLower_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  tickUpper?: InputMaybe<Scalars["Int"]>;
  tickUpper_gt?: InputMaybe<Scalars["Int"]>;
  tickUpper_gte?: InputMaybe<Scalars["Int"]>;
  tickUpper_in?: InputMaybe<Array<Scalars["Int"]>>;
  tickUpper_lt?: InputMaybe<Scalars["Int"]>;
  tickUpper_lte?: InputMaybe<Scalars["Int"]>;
  tickUpper_not?: InputMaybe<Scalars["Int"]>;
  tickUpper_not_in?: InputMaybe<Array<Scalars["Int"]>>;
};

export enum Position_OrderBy {
  Amount = "amount",
  Id = "id",
  Owner = "owner",
  Pool = "pool",
  PoolCollateral = "pool__collateral",
  PoolFee = "pool__fee",
  PoolId = "pool__id",
  PoolLong = "pool__long",
  PoolOracle = "pool__oracle",
  TickLower = "tickLower",
  TickUpper = "tickUpper",
}

export type Query = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  position?: Maybe<Position>;
  positions: Array<Position>;
  tick?: Maybe<Tick>;
  ticks: Array<Tick>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};

export type QueryPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Position_Filter>;
};

export type QueryTickArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTicksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Tick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Tick_Filter>;
};

export type Subscription = {
  __typename?: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  position?: Maybe<Position>;
  positions: Array<Position>;
  tick?: Maybe<Tick>;
  ticks: Array<Tick>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};

export type SubscriptionPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Position_Filter>;
};

export type SubscriptionTickArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTicksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Tick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Tick_Filter>;
};

export type Tick = {
  __typename?: "Tick";
  id: Scalars["ID"];
  index: Scalars["Int"];
  liquidity: Scalars["BigInt"];
  pool: Pool;
};

export type Tick_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Tick_Filter>>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  index?: InputMaybe<Scalars["Int"]>;
  index_gt?: InputMaybe<Scalars["Int"]>;
  index_gte?: InputMaybe<Scalars["Int"]>;
  index_in?: InputMaybe<Array<Scalars["Int"]>>;
  index_lt?: InputMaybe<Scalars["Int"]>;
  index_lte?: InputMaybe<Scalars["Int"]>;
  index_not?: InputMaybe<Scalars["Int"]>;
  index_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  liquidity?: InputMaybe<Scalars["BigInt"]>;
  liquidity_gt?: InputMaybe<Scalars["BigInt"]>;
  liquidity_gte?: InputMaybe<Scalars["BigInt"]>;
  liquidity_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  liquidity_lt?: InputMaybe<Scalars["BigInt"]>;
  liquidity_lte?: InputMaybe<Scalars["BigInt"]>;
  liquidity_not?: InputMaybe<Scalars["BigInt"]>;
  liquidity_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  or?: InputMaybe<Array<InputMaybe<Tick_Filter>>>;
  pool?: InputMaybe<Scalars["String"]>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars["String"]>;
  pool_contains_nocase?: InputMaybe<Scalars["String"]>;
  pool_ends_with?: InputMaybe<Scalars["String"]>;
  pool_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  pool_gt?: InputMaybe<Scalars["String"]>;
  pool_gte?: InputMaybe<Scalars["String"]>;
  pool_in?: InputMaybe<Array<Scalars["String"]>>;
  pool_lt?: InputMaybe<Scalars["String"]>;
  pool_lte?: InputMaybe<Scalars["String"]>;
  pool_not?: InputMaybe<Scalars["String"]>;
  pool_not_contains?: InputMaybe<Scalars["String"]>;
  pool_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  pool_not_ends_with?: InputMaybe<Scalars["String"]>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  pool_not_in?: InputMaybe<Array<Scalars["String"]>>;
  pool_not_starts_with?: InputMaybe<Scalars["String"]>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  pool_starts_with?: InputMaybe<Scalars["String"]>;
  pool_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum Tick_OrderBy {
  Id = "id",
  Index = "index",
  Liquidity = "liquidity",
  Pool = "pool",
  PoolCollateral = "pool__collateral",
  PoolFee = "pool__fee",
  PoolId = "pool__id",
  PoolLong = "pool__long",
  PoolOracle = "pool__oracle",
}

export type _Block_ = {
  __typename?: "_Block_";
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]>;
  /** The block number */
  number: Scalars["Int"];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: "_Meta_";
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars["String"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny",
}

export type PoolFragmentFragment = {
  __typename?: "Pool";
  id: string;
  collateral: any;
  oracle: any;
  long: boolean;
  fee: number;
  ticks: Array<{
    __typename?: "Tick";
    id: string;
    index: number;
    liquidity: number;
  }>;
};

export type GetPoolsQueryVariables = Exact<{
  where?: InputMaybe<Pool_Filter>;
}>;

export type GetPoolsQuery = {
  __typename?: "Query";
  pools: Array<{
    __typename?: "Pool";
    id: string;
    collateral: any;
    oracle: any;
    long: boolean;
    fee: number;
    ticks: Array<{
      __typename?: "Tick";
      id: string;
      index: number;
      liquidity: number;
    }>;
  }>;
};

export type PositionFragmentFragment = {
  __typename?: "Position";
  id: string;
  owner: any;
  tickLower: number;
  tickUpper: number;
  amount: number;
};

export type GetPositionsQueryVariables = Exact<{
  where?: InputMaybe<Position_Filter>;
}>;

export type GetPositionsQuery = {
  __typename?: "Query";
  positions: Array<{
    __typename?: "Position";
    id: string;
    owner: any;
    tickLower: number;
    tickUpper: number;
    amount: number;
  }>;
};

export const PoolFragmentFragmentDoc = gql`
  fragment PoolFragment on Pool {
    id
    collateral
    oracle
    long
    fee
    ticks {
      id
      index
      liquidity
    }
  }
`;
export const PositionFragmentFragmentDoc = gql`
  fragment PositionFragment on Position {
    id
    owner
    tickLower
    tickUpper
    amount
  }
`;
export const GetPoolsDocument = gql`
  query getPools($where: Pool_filter) {
    pools(where: $where) {
      ...PoolFragment
    }
  }
  ${PoolFragmentFragmentDoc}
`;
export const GetPositionsDocument = gql`
  query getPositions($where: Position_filter) {
    positions(where: $where) {
      ...PositionFragment
    }
  }
  ${PositionFragmentFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    getPools(
      variables?: GetPoolsQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetPoolsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetPoolsQuery>(GetPoolsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "getPools",
        "query"
      );
    },
    getPositions(
      variables?: GetPositionsQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetPositionsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetPositionsQuery>(GetPositionsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "getPositions",
        "query"
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
