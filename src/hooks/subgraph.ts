import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  Int8: any;
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Claim = {
  __typename?: 'Claim';
  amount: Scalars['BigInt'];
  claimed?: Maybe<Scalars['Boolean']>;
  claimer?: Maybe<Scalars['Bytes']>;
  exit: Scalars['Boolean'];
  id: Scalars['ID'];
  owner: Scalars['Bytes'];
  pool: Pool;
  round: Scalars['BigInt'];
};

export type Claim_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  and?: InputMaybe<Array<InputMaybe<Claim_Filter>>>;
  claimed?: InputMaybe<Scalars['Boolean']>;
  claimed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  claimed_not?: InputMaybe<Scalars['Boolean']>;
  claimed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  claimer?: InputMaybe<Scalars['Bytes']>;
  claimer_contains?: InputMaybe<Scalars['Bytes']>;
  claimer_gt?: InputMaybe<Scalars['Bytes']>;
  claimer_gte?: InputMaybe<Scalars['Bytes']>;
  claimer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  claimer_lt?: InputMaybe<Scalars['Bytes']>;
  claimer_lte?: InputMaybe<Scalars['Bytes']>;
  claimer_not?: InputMaybe<Scalars['Bytes']>;
  claimer_not_contains?: InputMaybe<Scalars['Bytes']>;
  claimer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  exit?: InputMaybe<Scalars['Boolean']>;
  exit_in?: InputMaybe<Array<Scalars['Boolean']>>;
  exit_not?: InputMaybe<Scalars['Boolean']>;
  exit_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  or?: InputMaybe<Array<InputMaybe<Claim_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_ends_with?: InputMaybe<Scalars['String']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_gt?: InputMaybe<Scalars['String']>;
  pool_gte?: InputMaybe<Scalars['String']>;
  pool_in?: InputMaybe<Array<Scalars['String']>>;
  pool_lt?: InputMaybe<Scalars['String']>;
  pool_lte?: InputMaybe<Scalars['String']>;
  pool_not?: InputMaybe<Scalars['String']>;
  pool_not_contains?: InputMaybe<Scalars['String']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pool_starts_with?: InputMaybe<Scalars['String']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  round?: InputMaybe<Scalars['BigInt']>;
  round_gt?: InputMaybe<Scalars['BigInt']>;
  round_gte?: InputMaybe<Scalars['BigInt']>;
  round_in?: InputMaybe<Array<Scalars['BigInt']>>;
  round_lt?: InputMaybe<Scalars['BigInt']>;
  round_lte?: InputMaybe<Scalars['BigInt']>;
  round_not?: InputMaybe<Scalars['BigInt']>;
  round_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Claim_OrderBy {
  Amount = 'amount',
  Claimed = 'claimed',
  Claimer = 'claimer',
  Exit = 'exit',
  Id = 'id',
  Owner = 'owner',
  Pool = 'pool',
  PoolId = 'pool__id',
  PoolLong = 'pool__long',
  Round = 'round'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Pool = {
  __typename?: 'Pool';
  id: Scalars['ID'];
  long: Scalars['Boolean'];
  ticks: Array<Tick>;
};


export type PoolTicksArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Tick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Tick_Filter>;
};

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  long?: InputMaybe<Scalars['Boolean']>;
  long_in?: InputMaybe<Array<Scalars['Boolean']>>;
  long_not?: InputMaybe<Scalars['Boolean']>;
  long_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  ticks_?: InputMaybe<Tick_Filter>;
};

export enum Pool_OrderBy {
  Id = 'id',
  Long = 'long',
  Ticks = 'ticks'
}

export type Position = {
  __typename?: 'Position';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  owner: Scalars['Bytes'];
  pool: Pool;
  tick: Scalars['Int'];
};

export type Position_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  and?: InputMaybe<Array<InputMaybe<Position_Filter>>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  or?: InputMaybe<Array<InputMaybe<Position_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_ends_with?: InputMaybe<Scalars['String']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_gt?: InputMaybe<Scalars['String']>;
  pool_gte?: InputMaybe<Scalars['String']>;
  pool_in?: InputMaybe<Array<Scalars['String']>>;
  pool_lt?: InputMaybe<Scalars['String']>;
  pool_lte?: InputMaybe<Scalars['String']>;
  pool_not?: InputMaybe<Scalars['String']>;
  pool_not_contains?: InputMaybe<Scalars['String']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pool_starts_with?: InputMaybe<Scalars['String']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tick?: InputMaybe<Scalars['Int']>;
  tick_gt?: InputMaybe<Scalars['Int']>;
  tick_gte?: InputMaybe<Scalars['Int']>;
  tick_in?: InputMaybe<Array<Scalars['Int']>>;
  tick_lt?: InputMaybe<Scalars['Int']>;
  tick_lte?: InputMaybe<Scalars['Int']>;
  tick_not?: InputMaybe<Scalars['Int']>;
  tick_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum Position_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Owner = 'owner',
  Pool = 'pool',
  PoolId = 'pool__id',
  PoolLong = 'pool__long',
  Tick = 'tick'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  claim?: Maybe<Claim>;
  claims: Array<Claim>;
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


export type QueryClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Claim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Claim_Filter>;
};


export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type QueryPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Position_Filter>;
};


export type QueryTickArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTicksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Tick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Tick_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  claim?: Maybe<Claim>;
  claims: Array<Claim>;
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


export type SubscriptionClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Claim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Claim_Filter>;
};


export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type SubscriptionPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Position_Filter>;
};


export type SubscriptionTickArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTicksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Tick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Tick_Filter>;
};

export type Tick = {
  __typename?: 'Tick';
  id: Scalars['ID'];
  index: Scalars['Int'];
  liquidity: Scalars['BigInt'];
  pool: Pool;
};

export type Tick_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Tick_Filter>>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  index?: InputMaybe<Scalars['Int']>;
  index_gt?: InputMaybe<Scalars['Int']>;
  index_gte?: InputMaybe<Scalars['Int']>;
  index_in?: InputMaybe<Array<Scalars['Int']>>;
  index_lt?: InputMaybe<Scalars['Int']>;
  index_lte?: InputMaybe<Scalars['Int']>;
  index_not?: InputMaybe<Scalars['Int']>;
  index_not_in?: InputMaybe<Array<Scalars['Int']>>;
  liquidity?: InputMaybe<Scalars['BigInt']>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']>;
  liquidity_not?: InputMaybe<Scalars['BigInt']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<Tick_Filter>>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_ends_with?: InputMaybe<Scalars['String']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_gt?: InputMaybe<Scalars['String']>;
  pool_gte?: InputMaybe<Scalars['String']>;
  pool_in?: InputMaybe<Array<Scalars['String']>>;
  pool_lt?: InputMaybe<Scalars['String']>;
  pool_lte?: InputMaybe<Scalars['String']>;
  pool_not?: InputMaybe<Scalars['String']>;
  pool_not_contains?: InputMaybe<Scalars['String']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pool_starts_with?: InputMaybe<Scalars['String']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Tick_OrderBy {
  Id = 'id',
  Index = 'index',
  Liquidity = 'liquidity',
  Pool = 'pool',
  PoolId = 'pool__id',
  PoolLong = 'pool__long'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type PoolFragmentFragment = { __typename?: 'Pool', id: string, long: boolean, ticks: Array<{ __typename?: 'Tick', id: string, index: number, liquidity: number }> };

export type GetPoolsQueryVariables = Exact<{
  where?: InputMaybe<Pool_Filter>;
}>;


export type GetPoolsQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string, long: boolean, ticks: Array<{ __typename?: 'Tick', id: string, index: number, liquidity: number }> }> };

export type PositionFragmentFragment = { __typename?: 'Position', id: string, owner: any, tick: number, amount: number };

export type GetPositionsQueryVariables = Exact<{
  where?: InputMaybe<Position_Filter>;
}>;


export type GetPositionsQuery = { __typename?: 'Query', positions: Array<{ __typename?: 'Position', id: string, owner: any, tick: number, amount: number }> };

export type ClaimFragmentFragment = { __typename?: 'Claim', id: string, owner: any, exit: boolean, amount: number, round: number, claimed?: boolean | null };

export type GetClaimsQueryVariables = Exact<{
  where?: InputMaybe<Claim_Filter>;
}>;


export type GetClaimsQuery = { __typename?: 'Query', claims: Array<{ __typename?: 'Claim', id: string, owner: any, exit: boolean, amount: number, round: number, claimed?: boolean | null }> };

export const PoolFragmentFragmentDoc = gql`
    fragment PoolFragment on Pool {
  id
  long
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
  tick
  amount
}
    `;
export const ClaimFragmentFragmentDoc = gql`
    fragment ClaimFragment on Claim {
  id
  owner
  exit
  amount
  round
  claimed
}
    `;
export const GetPoolsDocument = gql`
    query getPools($where: Pool_filter) {
  pools(where: $where) {
    ...PoolFragment
  }
}
    ${PoolFragmentFragmentDoc}`;
export const GetPositionsDocument = gql`
    query getPositions($where: Position_filter) {
  positions(where: $where) {
    ...PositionFragment
  }
}
    ${PositionFragmentFragmentDoc}`;
export const GetClaimsDocument = gql`
    query getClaims($where: Claim_filter) {
  claims(where: $where) {
    ...ClaimFragment
  }
}
    ${ClaimFragmentFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getPools(variables?: GetPoolsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPoolsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPoolsQuery>(GetPoolsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPools', 'query');
    },
    getPositions(variables?: GetPositionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPositionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPositionsQuery>(GetPositionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPositions', 'query');
    },
    getClaims(variables?: GetClaimsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetClaimsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetClaimsQuery>(GetClaimsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getClaims', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;