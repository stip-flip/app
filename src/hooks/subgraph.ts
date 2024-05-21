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
};

/** The block at which the query should be executed. */
export type Block_Height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['Bytes']>;
  /** Value containing a block number */
  number?: InputMaybe<Scalars['Int']>;
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   *
   */
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
  pool: Synth;
  round: Scalars['BigInt'];
};

export type Claim_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  claimed?: InputMaybe<Scalars['Boolean']>;
  claimed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  claimed_not?: InputMaybe<Scalars['Boolean']>;
  claimed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  claimer?: InputMaybe<Scalars['Bytes']>;
  claimer_contains?: InputMaybe<Scalars['Bytes']>;
  claimer_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pool?: InputMaybe<Scalars['String']>;
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
  Round = 'round'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Pool = {
  __typename?: 'Pool';
  fee: Scalars['Int'];
  id: Scalars['ID'];
  tickSpacing: Scalars['Int'];
  token0: Scalars['Bytes'];
  token1: Scalars['Bytes'];
};

export type Pool_Filter = {
  fee?: InputMaybe<Scalars['Int']>;
  fee_gt?: InputMaybe<Scalars['Int']>;
  fee_gte?: InputMaybe<Scalars['Int']>;
  fee_in?: InputMaybe<Array<Scalars['Int']>>;
  fee_lt?: InputMaybe<Scalars['Int']>;
  fee_lte?: InputMaybe<Scalars['Int']>;
  fee_not?: InputMaybe<Scalars['Int']>;
  fee_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  tickSpacing?: InputMaybe<Scalars['Int']>;
  tickSpacing_gt?: InputMaybe<Scalars['Int']>;
  tickSpacing_gte?: InputMaybe<Scalars['Int']>;
  tickSpacing_in?: InputMaybe<Array<Scalars['Int']>>;
  tickSpacing_lt?: InputMaybe<Scalars['Int']>;
  tickSpacing_lte?: InputMaybe<Scalars['Int']>;
  tickSpacing_not?: InputMaybe<Scalars['Int']>;
  tickSpacing_not_in?: InputMaybe<Array<Scalars['Int']>>;
  token0?: InputMaybe<Scalars['Bytes']>;
  token0_contains?: InputMaybe<Scalars['Bytes']>;
  token0_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token0_not?: InputMaybe<Scalars['Bytes']>;
  token0_not_contains?: InputMaybe<Scalars['Bytes']>;
  token0_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token1?: InputMaybe<Scalars['Bytes']>;
  token1_contains?: InputMaybe<Scalars['Bytes']>;
  token1_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token1_not?: InputMaybe<Scalars['Bytes']>;
  token1_not_contains?: InputMaybe<Scalars['Bytes']>;
  token1_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Pool_OrderBy {
  Fee = 'fee',
  Id = 'id',
  TickSpacing = 'tickSpacing',
  Token0 = 'token0',
  Token1 = 'token1'
}

export type Position = {
  __typename?: 'Position';
  id: Scalars['ID'];
  owner: Scalars['Bytes'];
  pool: Synth;
  shares: Scalars['BigInt'];
  tick: Scalars['Int'];
};

export type PositionClaim = {
  __typename?: 'PositionClaim';
  amount: Scalars['BigInt'];
  burn: Scalars['Boolean'];
  claimed?: Maybe<Scalars['Boolean']>;
  claimer?: Maybe<Scalars['Bytes']>;
  id: Scalars['ID'];
  owner: Scalars['Bytes'];
  pool: Synth;
  round: Scalars['BigInt'];
  tick: Scalars['Int'];
};

export type PositionClaim_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  burn?: InputMaybe<Scalars['Boolean']>;
  burn_in?: InputMaybe<Array<Scalars['Boolean']>>;
  burn_not?: InputMaybe<Scalars['Boolean']>;
  burn_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  claimed?: InputMaybe<Scalars['Boolean']>;
  claimed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  claimed_not?: InputMaybe<Scalars['Boolean']>;
  claimed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  claimer?: InputMaybe<Scalars['Bytes']>;
  claimer_contains?: InputMaybe<Scalars['Bytes']>;
  claimer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  claimer_not?: InputMaybe<Scalars['Bytes']>;
  claimer_not_contains?: InputMaybe<Scalars['Bytes']>;
  claimer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pool?: InputMaybe<Scalars['String']>;
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
  tick?: InputMaybe<Scalars['Int']>;
  tick_gt?: InputMaybe<Scalars['Int']>;
  tick_gte?: InputMaybe<Scalars['Int']>;
  tick_in?: InputMaybe<Array<Scalars['Int']>>;
  tick_lt?: InputMaybe<Scalars['Int']>;
  tick_lte?: InputMaybe<Scalars['Int']>;
  tick_not?: InputMaybe<Scalars['Int']>;
  tick_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum PositionClaim_OrderBy {
  Amount = 'amount',
  Burn = 'burn',
  Claimed = 'claimed',
  Claimer = 'claimer',
  Id = 'id',
  Owner = 'owner',
  Pool = 'pool',
  Round = 'round',
  Tick = 'tick'
}

export type Position_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pool?: InputMaybe<Scalars['String']>;
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
  shares?: InputMaybe<Scalars['BigInt']>;
  shares_gt?: InputMaybe<Scalars['BigInt']>;
  shares_gte?: InputMaybe<Scalars['BigInt']>;
  shares_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shares_lt?: InputMaybe<Scalars['BigInt']>;
  shares_lte?: InputMaybe<Scalars['BigInt']>;
  shares_not?: InputMaybe<Scalars['BigInt']>;
  shares_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  Id = 'id',
  Owner = 'owner',
  Pool = 'pool',
  Shares = 'shares',
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
  positionClaim?: Maybe<PositionClaim>;
  positionClaims: Array<PositionClaim>;
  positions: Array<Position>;
  synth?: Maybe<Synth>;
  synths: Array<Synth>;
  tick?: Maybe<Tick>;
  ticks: Array<Tick>;
  uniPosition?: Maybe<UniPosition>;
  uniPositions: Array<UniPosition>;
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


export type QueryPositionClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPositionClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PositionClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionClaim_Filter>;
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


export type QuerySynthArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySynthsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Synth_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Synth_Filter>;
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


export type QueryUniPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUniPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UniPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UniPosition_Filter>;
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
  positionClaim?: Maybe<PositionClaim>;
  positionClaims: Array<PositionClaim>;
  positions: Array<Position>;
  synth?: Maybe<Synth>;
  synths: Array<Synth>;
  tick?: Maybe<Tick>;
  ticks: Array<Tick>;
  uniPosition?: Maybe<UniPosition>;
  uniPositions: Array<UniPosition>;
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


export type SubscriptionPositionClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPositionClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PositionClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionClaim_Filter>;
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


export type SubscriptionSynthArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSynthsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Synth_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Synth_Filter>;
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


export type SubscriptionUniPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUniPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UniPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UniPosition_Filter>;
};

export type Synth = {
  __typename?: 'Synth';
  id: Scalars['ID'];
  long: Scalars['Boolean'];
  oracle: Scalars['Bytes'];
  ticks: Array<Tick>;
};


export type SynthTicksArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Tick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Tick_Filter>;
};

export type Synth_Filter = {
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
  oracle?: InputMaybe<Scalars['Bytes']>;
  oracle_contains?: InputMaybe<Scalars['Bytes']>;
  oracle_in?: InputMaybe<Array<Scalars['Bytes']>>;
  oracle_not?: InputMaybe<Scalars['Bytes']>;
  oracle_not_contains?: InputMaybe<Scalars['Bytes']>;
  oracle_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Synth_OrderBy {
  Id = 'id',
  Long = 'long',
  Oracle = 'oracle',
  Ticks = 'ticks'
}

export type Tick = {
  __typename?: 'Tick';
  id: Scalars['ID'];
  index: Scalars['Int'];
  liquidity: Scalars['BigInt'];
  pool: Synth;
};

export type Tick_Filter = {
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
  pool?: InputMaybe<Scalars['String']>;
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
  Pool = 'pool'
}

export type UniPosition = {
  __typename?: 'UniPosition';
  id: Scalars['ID'];
  liquidity: Scalars['BigInt'];
  owner: Scalars['Bytes'];
  tickLower: Scalars['Int'];
  tickUpper: Scalars['Int'];
  token0: Scalars['Bytes'];
  token1: Scalars['Bytes'];
  tokensOwed0: Scalars['BigInt'];
  tokensOwed1: Scalars['BigInt'];
};

export type UniPosition_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidity?: InputMaybe<Scalars['BigInt']>;
  liquidity_gt?: InputMaybe<Scalars['BigInt']>;
  liquidity_gte?: InputMaybe<Scalars['BigInt']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: InputMaybe<Scalars['BigInt']>;
  liquidity_lte?: InputMaybe<Scalars['BigInt']>;
  liquidity_not?: InputMaybe<Scalars['BigInt']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tickLower?: InputMaybe<Scalars['Int']>;
  tickLower_gt?: InputMaybe<Scalars['Int']>;
  tickLower_gte?: InputMaybe<Scalars['Int']>;
  tickLower_in?: InputMaybe<Array<Scalars['Int']>>;
  tickLower_lt?: InputMaybe<Scalars['Int']>;
  tickLower_lte?: InputMaybe<Scalars['Int']>;
  tickLower_not?: InputMaybe<Scalars['Int']>;
  tickLower_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tickUpper?: InputMaybe<Scalars['Int']>;
  tickUpper_gt?: InputMaybe<Scalars['Int']>;
  tickUpper_gte?: InputMaybe<Scalars['Int']>;
  tickUpper_in?: InputMaybe<Array<Scalars['Int']>>;
  tickUpper_lt?: InputMaybe<Scalars['Int']>;
  tickUpper_lte?: InputMaybe<Scalars['Int']>;
  tickUpper_not?: InputMaybe<Scalars['Int']>;
  tickUpper_not_in?: InputMaybe<Array<Scalars['Int']>>;
  token0?: InputMaybe<Scalars['Bytes']>;
  token0_contains?: InputMaybe<Scalars['Bytes']>;
  token0_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token0_not?: InputMaybe<Scalars['Bytes']>;
  token0_not_contains?: InputMaybe<Scalars['Bytes']>;
  token0_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token1?: InputMaybe<Scalars['Bytes']>;
  token1_contains?: InputMaybe<Scalars['Bytes']>;
  token1_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token1_not?: InputMaybe<Scalars['Bytes']>;
  token1_not_contains?: InputMaybe<Scalars['Bytes']>;
  token1_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tokensOwed0?: InputMaybe<Scalars['BigInt']>;
  tokensOwed0_gt?: InputMaybe<Scalars['BigInt']>;
  tokensOwed0_gte?: InputMaybe<Scalars['BigInt']>;
  tokensOwed0_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokensOwed0_lt?: InputMaybe<Scalars['BigInt']>;
  tokensOwed0_lte?: InputMaybe<Scalars['BigInt']>;
  tokensOwed0_not?: InputMaybe<Scalars['BigInt']>;
  tokensOwed0_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokensOwed1?: InputMaybe<Scalars['BigInt']>;
  tokensOwed1_gt?: InputMaybe<Scalars['BigInt']>;
  tokensOwed1_gte?: InputMaybe<Scalars['BigInt']>;
  tokensOwed1_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokensOwed1_lt?: InputMaybe<Scalars['BigInt']>;
  tokensOwed1_lte?: InputMaybe<Scalars['BigInt']>;
  tokensOwed1_not?: InputMaybe<Scalars['BigInt']>;
  tokensOwed1_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum UniPosition_OrderBy {
  Id = 'id',
  Liquidity = 'liquidity',
  Owner = 'owner',
  TickLower = 'tickLower',
  TickUpper = 'tickUpper',
  Token0 = 'token0',
  Token1 = 'token1',
  TokensOwed0 = 'tokensOwed0',
  TokensOwed1 = 'tokensOwed1'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
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

export type SynthFragmentFragment = { __typename?: 'Synth', id: string, long: boolean, ticks: Array<{ __typename?: 'Tick', id: string, index: number, liquidity: number }> };

export type GetSynthsQueryVariables = Exact<{
  where?: InputMaybe<Synth_Filter>;
}>;


export type GetSynthsQuery = { __typename?: 'Query', synths: Array<{ __typename?: 'Synth', id: string, long: boolean, ticks: Array<{ __typename?: 'Tick', id: string, index: number, liquidity: number }> }> };

export type PositionFragmentFragment = { __typename?: 'Position', id: string, owner: any, tick: number, shares: number };

export type GetPositionsQueryVariables = Exact<{
  where?: InputMaybe<Position_Filter>;
}>;


export type GetPositionsQuery = { __typename?: 'Query', positions: Array<{ __typename?: 'Position', id: string, owner: any, tick: number, shares: number }> };

export type ClaimFragmentFragment = { __typename?: 'Claim', id: string, owner: any, exit: boolean, amount: number, round: number, claimed?: boolean | null, claimer?: any | null };

export type GetClaimsQueryVariables = Exact<{
  where?: InputMaybe<Claim_Filter>;
}>;


export type GetClaimsQuery = { __typename?: 'Query', claims: Array<{ __typename?: 'Claim', id: string, owner: any, exit: boolean, amount: number, round: number, claimed?: boolean | null, claimer?: any | null }> };

export type PositionClaimFragmentFragment = { __typename?: 'PositionClaim', id: string, owner: any, tick: number, burn: boolean, amount: number, round: number, claimer?: any | null, claimed?: boolean | null };

export type GetPositionClaimsQueryVariables = Exact<{
  where?: InputMaybe<PositionClaim_Filter>;
}>;


export type GetPositionClaimsQuery = { __typename?: 'Query', positionClaims: Array<{ __typename?: 'PositionClaim', id: string, owner: any, tick: number, burn: boolean, amount: number, round: number, claimer?: any | null, claimed?: boolean | null }> };

export type UniPositionFragment = { __typename?: 'UniPosition', id: string, owner: any, liquidity: number, token0: any, token1: any, tickLower: number, tickUpper: number, tokensOwed0: number, tokensOwed1: number };

export type GetUniPositionsQueryVariables = Exact<{
  where?: InputMaybe<UniPosition_Filter>;
}>;


export type GetUniPositionsQuery = { __typename?: 'Query', uniPositions: Array<{ __typename?: 'UniPosition', id: string, owner: any, liquidity: number, token0: any, token1: any, tickLower: number, tickUpper: number, tokensOwed0: number, tokensOwed1: number }> };

export type PoolFragment = { __typename?: 'Pool', id: string, token0: any, token1: any, fee: number, tickSpacing: number };

export type GetPoolsQueryVariables = Exact<{
  where?: InputMaybe<Pool_Filter>;
}>;


export type GetPoolsQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string, token0: any, token1: any, fee: number, tickSpacing: number }> };

export const SynthFragmentFragmentDoc = gql`
    fragment SynthFragment on Synth {
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
  shares
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
  claimer
}
    `;
export const PositionClaimFragmentFragmentDoc = gql`
    fragment PositionClaimFragment on PositionClaim {
  id
  owner
  tick
  burn
  amount
  round
  claimer
  claimed
}
    `;
export const UniPositionFragmentDoc = gql`
    fragment UniPosition on UniPosition {
  id
  owner
  liquidity
  token0
  token1
  tickLower
  tickUpper
  tokensOwed0
  tokensOwed1
}
    `;
export const PoolFragmentDoc = gql`
    fragment Pool on Pool {
  id
  token0
  token1
  fee
  tickSpacing
}
    `;
export const GetSynthsDocument = gql`
    query getSynths($where: Synth_filter) {
  synths(where: $where) {
    ...SynthFragment
  }
}
    ${SynthFragmentFragmentDoc}`;
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
export const GetPositionClaimsDocument = gql`
    query getPositionClaims($where: PositionClaim_filter) {
  positionClaims(where: $where) {
    ...PositionClaimFragment
  }
}
    ${PositionClaimFragmentFragmentDoc}`;
export const GetUniPositionsDocument = gql`
    query getUniPositions($where: UniPosition_filter) {
  uniPositions(where: $where) {
    ...UniPosition
  }
}
    ${UniPositionFragmentDoc}`;
export const GetPoolsDocument = gql`
    query getPools($where: Pool_filter) {
  pools(where: $where) {
    ...Pool
  }
}
    ${PoolFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getSynths(variables?: GetSynthsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetSynthsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSynthsQuery>(GetSynthsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSynths', 'query');
    },
    getPositions(variables?: GetPositionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPositionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPositionsQuery>(GetPositionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPositions', 'query');
    },
    getClaims(variables?: GetClaimsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetClaimsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetClaimsQuery>(GetClaimsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getClaims', 'query');
    },
    getPositionClaims(variables?: GetPositionClaimsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPositionClaimsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPositionClaimsQuery>(GetPositionClaimsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPositionClaims', 'query');
    },
    getUniPositions(variables?: GetUniPositionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUniPositionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUniPositionsQuery>(GetUniPositionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUniPositions', 'query');
    },
    getPools(variables?: GetPoolsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPoolsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPoolsQuery>(GetPoolsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPools', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;