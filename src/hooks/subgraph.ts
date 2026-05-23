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

export type MarketRoundSnapshot = {
  __typename?: 'MarketRoundSnapshot';
  blockNumber: Scalars['BigInt'];
  enterVolume: Scalars['BigInt'];
  eventCount: Scalars['BigInt'];
  exitVolume: Scalars['BigInt'];
  id: Scalars['ID'];
  pool: Synth;
  poolDebt: Scalars['BigInt'];
  price: Scalars['BigInt'];
  round: Scalars['BigInt'];
  swapLiquidityVolume: Scalars['BigInt'];
  tick: Scalars['Int'];
  timestamp: Scalars['BigInt'];
  totalLiquidity: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
};

export type MarketRoundSnapshot_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  enterVolume?: InputMaybe<Scalars['BigInt']>;
  enterVolume_gt?: InputMaybe<Scalars['BigInt']>;
  enterVolume_gte?: InputMaybe<Scalars['BigInt']>;
  enterVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
  enterVolume_lt?: InputMaybe<Scalars['BigInt']>;
  enterVolume_lte?: InputMaybe<Scalars['BigInt']>;
  enterVolume_not?: InputMaybe<Scalars['BigInt']>;
  enterVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventCount?: InputMaybe<Scalars['BigInt']>;
  eventCount_gt?: InputMaybe<Scalars['BigInt']>;
  eventCount_gte?: InputMaybe<Scalars['BigInt']>;
  eventCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventCount_lt?: InputMaybe<Scalars['BigInt']>;
  eventCount_lte?: InputMaybe<Scalars['BigInt']>;
  eventCount_not?: InputMaybe<Scalars['BigInt']>;
  eventCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  exitVolume?: InputMaybe<Scalars['BigInt']>;
  exitVolume_gt?: InputMaybe<Scalars['BigInt']>;
  exitVolume_gte?: InputMaybe<Scalars['BigInt']>;
  exitVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
  exitVolume_lt?: InputMaybe<Scalars['BigInt']>;
  exitVolume_lte?: InputMaybe<Scalars['BigInt']>;
  exitVolume_not?: InputMaybe<Scalars['BigInt']>;
  exitVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pool?: InputMaybe<Scalars['String']>;
  poolDebt?: InputMaybe<Scalars['BigInt']>;
  poolDebt_gt?: InputMaybe<Scalars['BigInt']>;
  poolDebt_gte?: InputMaybe<Scalars['BigInt']>;
  poolDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolDebt_lt?: InputMaybe<Scalars['BigInt']>;
  poolDebt_lte?: InputMaybe<Scalars['BigInt']>;
  poolDebt_not?: InputMaybe<Scalars['BigInt']>;
  poolDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  price?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  round?: InputMaybe<Scalars['BigInt']>;
  round_gt?: InputMaybe<Scalars['BigInt']>;
  round_gte?: InputMaybe<Scalars['BigInt']>;
  round_in?: InputMaybe<Array<Scalars['BigInt']>>;
  round_lt?: InputMaybe<Scalars['BigInt']>;
  round_lte?: InputMaybe<Scalars['BigInt']>;
  round_not?: InputMaybe<Scalars['BigInt']>;
  round_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapLiquidityVolume?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_gt?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_gte?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapLiquidityVolume_lt?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_lte?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_not?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tick?: InputMaybe<Scalars['Int']>;
  tick_gt?: InputMaybe<Scalars['Int']>;
  tick_gte?: InputMaybe<Scalars['Int']>;
  tick_in?: InputMaybe<Array<Scalars['Int']>>;
  tick_lt?: InputMaybe<Scalars['Int']>;
  tick_lte?: InputMaybe<Scalars['Int']>;
  tick_not?: InputMaybe<Scalars['Int']>;
  tick_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalLiquidity?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum MarketRoundSnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  EnterVolume = 'enterVolume',
  EventCount = 'eventCount',
  ExitVolume = 'exitVolume',
  Id = 'id',
  Pool = 'pool',
  PoolDebt = 'poolDebt',
  Price = 'price',
  Round = 'round',
  SwapLiquidityVolume = 'swapLiquidityVolume',
  Tick = 'tick',
  Timestamp = 'timestamp',
  TotalLiquidity = 'totalLiquidity',
  TotalSupply = 'totalSupply'
}

export type MarketSnapshot = {
  __typename?: 'MarketSnapshot';
  blockNumber: Scalars['BigInt'];
  enterVolume: Scalars['BigInt'];
  eventCount: Scalars['BigInt'];
  exitVolume: Scalars['BigInt'];
  id: Scalars['ID'];
  pool: Synth;
  poolDebt: Scalars['BigInt'];
  price: Scalars['BigInt'];
  swapLiquidityVolume: Scalars['BigInt'];
  tick: Scalars['Int'];
  timestamp: Scalars['BigInt'];
  totalLiquidity: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
};

export type MarketSnapshot_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  enterVolume?: InputMaybe<Scalars['BigInt']>;
  enterVolume_gt?: InputMaybe<Scalars['BigInt']>;
  enterVolume_gte?: InputMaybe<Scalars['BigInt']>;
  enterVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
  enterVolume_lt?: InputMaybe<Scalars['BigInt']>;
  enterVolume_lte?: InputMaybe<Scalars['BigInt']>;
  enterVolume_not?: InputMaybe<Scalars['BigInt']>;
  enterVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventCount?: InputMaybe<Scalars['BigInt']>;
  eventCount_gt?: InputMaybe<Scalars['BigInt']>;
  eventCount_gte?: InputMaybe<Scalars['BigInt']>;
  eventCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventCount_lt?: InputMaybe<Scalars['BigInt']>;
  eventCount_lte?: InputMaybe<Scalars['BigInt']>;
  eventCount_not?: InputMaybe<Scalars['BigInt']>;
  eventCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  exitVolume?: InputMaybe<Scalars['BigInt']>;
  exitVolume_gt?: InputMaybe<Scalars['BigInt']>;
  exitVolume_gte?: InputMaybe<Scalars['BigInt']>;
  exitVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
  exitVolume_lt?: InputMaybe<Scalars['BigInt']>;
  exitVolume_lte?: InputMaybe<Scalars['BigInt']>;
  exitVolume_not?: InputMaybe<Scalars['BigInt']>;
  exitVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pool?: InputMaybe<Scalars['String']>;
  poolDebt?: InputMaybe<Scalars['BigInt']>;
  poolDebt_gt?: InputMaybe<Scalars['BigInt']>;
  poolDebt_gte?: InputMaybe<Scalars['BigInt']>;
  poolDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolDebt_lt?: InputMaybe<Scalars['BigInt']>;
  poolDebt_lte?: InputMaybe<Scalars['BigInt']>;
  poolDebt_not?: InputMaybe<Scalars['BigInt']>;
  poolDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  price?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapLiquidityVolume?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_gt?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_gte?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapLiquidityVolume_lt?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_lte?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_not?: InputMaybe<Scalars['BigInt']>;
  swapLiquidityVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tick?: InputMaybe<Scalars['Int']>;
  tick_gt?: InputMaybe<Scalars['Int']>;
  tick_gte?: InputMaybe<Scalars['Int']>;
  tick_in?: InputMaybe<Array<Scalars['Int']>>;
  tick_lt?: InputMaybe<Scalars['Int']>;
  tick_lte?: InputMaybe<Scalars['Int']>;
  tick_not?: InputMaybe<Scalars['Int']>;
  tick_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalLiquidity?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum MarketSnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  EnterVolume = 'enterVolume',
  EventCount = 'eventCount',
  ExitVolume = 'exitVolume',
  Id = 'id',
  Pool = 'pool',
  PoolDebt = 'poolDebt',
  Price = 'price',
  SwapLiquidityVolume = 'swapLiquidityVolume',
  Tick = 'tick',
  Timestamp = 'timestamp',
  TotalLiquidity = 'totalLiquidity',
  TotalSupply = 'totalSupply'
}

export type MarketTradeEvent = {
  __typename?: 'MarketTradeEvent';
  amount: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  hasTick: Scalars['Boolean'];
  id: Scalars['ID'];
  kind: Scalars['String'];
  pool: Synth;
  poolDebt: Scalars['BigInt'];
  price: Scalars['BigInt'];
  round?: Maybe<Scalars['BigInt']>;
  tick: Scalars['Int'];
  timestamp: Scalars['BigInt'];
  totalLiquidity: Scalars['BigInt'];
  totalSupply: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type MarketTradeEvent_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hasTick?: InputMaybe<Scalars['Boolean']>;
  hasTick_in?: InputMaybe<Array<Scalars['Boolean']>>;
  hasTick_not?: InputMaybe<Scalars['Boolean']>;
  hasTick_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  kind?: InputMaybe<Scalars['String']>;
  kind_contains?: InputMaybe<Scalars['String']>;
  kind_contains_nocase?: InputMaybe<Scalars['String']>;
  kind_ends_with?: InputMaybe<Scalars['String']>;
  kind_ends_with_nocase?: InputMaybe<Scalars['String']>;
  kind_gt?: InputMaybe<Scalars['String']>;
  kind_gte?: InputMaybe<Scalars['String']>;
  kind_in?: InputMaybe<Array<Scalars['String']>>;
  kind_lt?: InputMaybe<Scalars['String']>;
  kind_lte?: InputMaybe<Scalars['String']>;
  kind_not?: InputMaybe<Scalars['String']>;
  kind_not_contains?: InputMaybe<Scalars['String']>;
  kind_not_contains_nocase?: InputMaybe<Scalars['String']>;
  kind_not_ends_with?: InputMaybe<Scalars['String']>;
  kind_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  kind_not_in?: InputMaybe<Array<Scalars['String']>>;
  kind_not_starts_with?: InputMaybe<Scalars['String']>;
  kind_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  kind_starts_with?: InputMaybe<Scalars['String']>;
  kind_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pool?: InputMaybe<Scalars['String']>;
  poolDebt?: InputMaybe<Scalars['BigInt']>;
  poolDebt_gt?: InputMaybe<Scalars['BigInt']>;
  poolDebt_gte?: InputMaybe<Scalars['BigInt']>;
  poolDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolDebt_lt?: InputMaybe<Scalars['BigInt']>;
  poolDebt_lte?: InputMaybe<Scalars['BigInt']>;
  poolDebt_not?: InputMaybe<Scalars['BigInt']>;
  poolDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  price?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalLiquidity?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['Bytes']>;
  transaction_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction_not?: InputMaybe<Scalars['Bytes']>;
  transaction_not_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum MarketTradeEvent_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  HasTick = 'hasTick',
  Id = 'id',
  Kind = 'kind',
  Pool = 'pool',
  PoolDebt = 'poolDebt',
  Price = 'price',
  Round = 'round',
  Tick = 'tick',
  Timestamp = 'timestamp',
  TotalLiquidity = 'totalLiquidity',
  TotalSupply = 'totalSupply',
  Transaction = 'transaction'
}

export type Oracle = {
  __typename?: 'Oracle';
  id: Scalars['ID'];
  lastRound: Scalars['BigInt'];
  lastSubmissionTimestamp: Scalars['BigInt'];
  participantCount: Scalars['BigInt'];
  participants: Array<OracleParticipant>;
  rewardEvents: Array<OracleRewardEvent>;
  rounds: Array<OracleRound>;
  slashEvents: Array<OracleSlashEvent>;
  snapshots: Array<OracleSnapshot>;
  stakeEvents: Array<OracleStakeEvent>;
  submissionCount: Scalars['BigInt'];
  totalMana: Scalars['BigInt'];
  totalRewardsClaimed: Scalars['BigInt'];
  totalSlashed: Scalars['BigInt'];
  totalStake: Scalars['BigInt'];
};


export type OracleParticipantsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleParticipant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OracleParticipant_Filter>;
};


export type OracleRewardEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleRewardEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OracleRewardEvent_Filter>;
};


export type OracleRoundsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleRound_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OracleRound_Filter>;
};


export type OracleSlashEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleSlashEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OracleSlashEvent_Filter>;
};


export type OracleSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OracleSnapshot_Filter>;
};


export type OracleStakeEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleStakeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<OracleStakeEvent_Filter>;
};

export type OracleParticipant = {
  __typename?: 'OracleParticipant';
  id: Scalars['ID'];
  lastSubmittedRound: Scalars['BigInt'];
  mana: Scalars['BigInt'];
  oracle: Oracle;
  rewardsClaimed: Scalars['BigInt'];
  slashed: Scalars['BigInt'];
  stake: Scalars['BigInt'];
  submissionCount: Scalars['BigInt'];
  user: Scalars['Bytes'];
};

export type OracleParticipantSnapshot = {
  __typename?: 'OracleParticipantSnapshot';
  blockNumber: Scalars['BigInt'];
  eventCount: Scalars['BigInt'];
  id: Scalars['ID'];
  lastSubmittedRound: Scalars['BigInt'];
  mana: Scalars['BigInt'];
  oracle: Oracle;
  participant: OracleParticipant;
  rewardsClaimed: Scalars['BigInt'];
  slashed: Scalars['BigInt'];
  stake: Scalars['BigInt'];
  submissionCount: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  user: Scalars['Bytes'];
};

export type OracleParticipantSnapshot_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventCount?: InputMaybe<Scalars['BigInt']>;
  eventCount_gt?: InputMaybe<Scalars['BigInt']>;
  eventCount_gte?: InputMaybe<Scalars['BigInt']>;
  eventCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventCount_lt?: InputMaybe<Scalars['BigInt']>;
  eventCount_lte?: InputMaybe<Scalars['BigInt']>;
  eventCount_not?: InputMaybe<Scalars['BigInt']>;
  eventCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastSubmittedRound?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_gt?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_gte?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastSubmittedRound_lt?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_lte?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_not?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mana?: InputMaybe<Scalars['BigInt']>;
  mana_gt?: InputMaybe<Scalars['BigInt']>;
  mana_gte?: InputMaybe<Scalars['BigInt']>;
  mana_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mana_lt?: InputMaybe<Scalars['BigInt']>;
  mana_lte?: InputMaybe<Scalars['BigInt']>;
  mana_not?: InputMaybe<Scalars['BigInt']>;
  mana_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oracle?: InputMaybe<Scalars['String']>;
  oracle_contains?: InputMaybe<Scalars['String']>;
  oracle_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_ends_with?: InputMaybe<Scalars['String']>;
  oracle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_gt?: InputMaybe<Scalars['String']>;
  oracle_gte?: InputMaybe<Scalars['String']>;
  oracle_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_lt?: InputMaybe<Scalars['String']>;
  oracle_lte?: InputMaybe<Scalars['String']>;
  oracle_not?: InputMaybe<Scalars['String']>;
  oracle_not_contains?: InputMaybe<Scalars['String']>;
  oracle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']>;
  oracle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_starts_with?: InputMaybe<Scalars['String']>;
  oracle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  participant?: InputMaybe<Scalars['String']>;
  participant_contains?: InputMaybe<Scalars['String']>;
  participant_contains_nocase?: InputMaybe<Scalars['String']>;
  participant_ends_with?: InputMaybe<Scalars['String']>;
  participant_ends_with_nocase?: InputMaybe<Scalars['String']>;
  participant_gt?: InputMaybe<Scalars['String']>;
  participant_gte?: InputMaybe<Scalars['String']>;
  participant_in?: InputMaybe<Array<Scalars['String']>>;
  participant_lt?: InputMaybe<Scalars['String']>;
  participant_lte?: InputMaybe<Scalars['String']>;
  participant_not?: InputMaybe<Scalars['String']>;
  participant_not_contains?: InputMaybe<Scalars['String']>;
  participant_not_contains_nocase?: InputMaybe<Scalars['String']>;
  participant_not_ends_with?: InputMaybe<Scalars['String']>;
  participant_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  participant_not_in?: InputMaybe<Array<Scalars['String']>>;
  participant_not_starts_with?: InputMaybe<Scalars['String']>;
  participant_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  participant_starts_with?: InputMaybe<Scalars['String']>;
  participant_starts_with_nocase?: InputMaybe<Scalars['String']>;
  rewardsClaimed?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardsClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_not?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slashed?: InputMaybe<Scalars['BigInt']>;
  slashed_gt?: InputMaybe<Scalars['BigInt']>;
  slashed_gte?: InputMaybe<Scalars['BigInt']>;
  slashed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slashed_lt?: InputMaybe<Scalars['BigInt']>;
  slashed_lte?: InputMaybe<Scalars['BigInt']>;
  slashed_not?: InputMaybe<Scalars['BigInt']>;
  slashed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stake?: InputMaybe<Scalars['BigInt']>;
  stake_gt?: InputMaybe<Scalars['BigInt']>;
  stake_gte?: InputMaybe<Scalars['BigInt']>;
  stake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stake_lt?: InputMaybe<Scalars['BigInt']>;
  stake_lte?: InputMaybe<Scalars['BigInt']>;
  stake_not?: InputMaybe<Scalars['BigInt']>;
  stake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount_lt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_lte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OracleParticipantSnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  EventCount = 'eventCount',
  Id = 'id',
  LastSubmittedRound = 'lastSubmittedRound',
  Mana = 'mana',
  Oracle = 'oracle',
  Participant = 'participant',
  RewardsClaimed = 'rewardsClaimed',
  Slashed = 'slashed',
  Stake = 'stake',
  SubmissionCount = 'submissionCount',
  Timestamp = 'timestamp',
  User = 'user'
}

export type OracleParticipant_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastSubmittedRound?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_gt?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_gte?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastSubmittedRound_lt?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_lte?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_not?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedRound_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mana?: InputMaybe<Scalars['BigInt']>;
  mana_gt?: InputMaybe<Scalars['BigInt']>;
  mana_gte?: InputMaybe<Scalars['BigInt']>;
  mana_in?: InputMaybe<Array<Scalars['BigInt']>>;
  mana_lt?: InputMaybe<Scalars['BigInt']>;
  mana_lte?: InputMaybe<Scalars['BigInt']>;
  mana_not?: InputMaybe<Scalars['BigInt']>;
  mana_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oracle?: InputMaybe<Scalars['String']>;
  oracle_contains?: InputMaybe<Scalars['String']>;
  oracle_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_ends_with?: InputMaybe<Scalars['String']>;
  oracle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_gt?: InputMaybe<Scalars['String']>;
  oracle_gte?: InputMaybe<Scalars['String']>;
  oracle_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_lt?: InputMaybe<Scalars['String']>;
  oracle_lte?: InputMaybe<Scalars['String']>;
  oracle_not?: InputMaybe<Scalars['String']>;
  oracle_not_contains?: InputMaybe<Scalars['String']>;
  oracle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']>;
  oracle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_starts_with?: InputMaybe<Scalars['String']>;
  oracle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  rewardsClaimed?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rewardsClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_not?: InputMaybe<Scalars['BigInt']>;
  rewardsClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slashed?: InputMaybe<Scalars['BigInt']>;
  slashed_gt?: InputMaybe<Scalars['BigInt']>;
  slashed_gte?: InputMaybe<Scalars['BigInt']>;
  slashed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slashed_lt?: InputMaybe<Scalars['BigInt']>;
  slashed_lte?: InputMaybe<Scalars['BigInt']>;
  slashed_not?: InputMaybe<Scalars['BigInt']>;
  slashed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stake?: InputMaybe<Scalars['BigInt']>;
  stake_gt?: InputMaybe<Scalars['BigInt']>;
  stake_gte?: InputMaybe<Scalars['BigInt']>;
  stake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stake_lt?: InputMaybe<Scalars['BigInt']>;
  stake_lte?: InputMaybe<Scalars['BigInt']>;
  stake_not?: InputMaybe<Scalars['BigInt']>;
  stake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount_lt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_lte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OracleParticipant_OrderBy {
  Id = 'id',
  LastSubmittedRound = 'lastSubmittedRound',
  Mana = 'mana',
  Oracle = 'oracle',
  RewardsClaimed = 'rewardsClaimed',
  Slashed = 'slashed',
  Stake = 'stake',
  SubmissionCount = 'submissionCount',
  User = 'user'
}

export type OracleRewardEvent = {
  __typename?: 'OracleRewardEvent';
  amount: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  id: Scalars['ID'];
  oracle: Oracle;
  owner: Scalars['Bytes'];
  participant: OracleParticipant;
  participantMana: Scalars['BigInt'];
  participantRewardsClaimed: Scalars['BigInt'];
  participantStake: Scalars['BigInt'];
  recipient: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  totalRewardsClaimed: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type OracleRewardEvent_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  oracle?: InputMaybe<Scalars['String']>;
  oracle_contains?: InputMaybe<Scalars['String']>;
  oracle_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_ends_with?: InputMaybe<Scalars['String']>;
  oracle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_gt?: InputMaybe<Scalars['String']>;
  oracle_gte?: InputMaybe<Scalars['String']>;
  oracle_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_lt?: InputMaybe<Scalars['String']>;
  oracle_lte?: InputMaybe<Scalars['String']>;
  oracle_not?: InputMaybe<Scalars['String']>;
  oracle_not_contains?: InputMaybe<Scalars['String']>;
  oracle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']>;
  oracle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_starts_with?: InputMaybe<Scalars['String']>;
  oracle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  participant?: InputMaybe<Scalars['String']>;
  participantMana?: InputMaybe<Scalars['BigInt']>;
  participantMana_gt?: InputMaybe<Scalars['BigInt']>;
  participantMana_gte?: InputMaybe<Scalars['BigInt']>;
  participantMana_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantMana_lt?: InputMaybe<Scalars['BigInt']>;
  participantMana_lte?: InputMaybe<Scalars['BigInt']>;
  participantMana_not?: InputMaybe<Scalars['BigInt']>;
  participantMana_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantRewardsClaimed?: InputMaybe<Scalars['BigInt']>;
  participantRewardsClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  participantRewardsClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  participantRewardsClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantRewardsClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  participantRewardsClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  participantRewardsClaimed_not?: InputMaybe<Scalars['BigInt']>;
  participantRewardsClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantStake?: InputMaybe<Scalars['BigInt']>;
  participantStake_gt?: InputMaybe<Scalars['BigInt']>;
  participantStake_gte?: InputMaybe<Scalars['BigInt']>;
  participantStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantStake_lt?: InputMaybe<Scalars['BigInt']>;
  participantStake_lte?: InputMaybe<Scalars['BigInt']>;
  participantStake_not?: InputMaybe<Scalars['BigInt']>;
  participantStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participant_contains?: InputMaybe<Scalars['String']>;
  participant_contains_nocase?: InputMaybe<Scalars['String']>;
  participant_ends_with?: InputMaybe<Scalars['String']>;
  participant_ends_with_nocase?: InputMaybe<Scalars['String']>;
  participant_gt?: InputMaybe<Scalars['String']>;
  participant_gte?: InputMaybe<Scalars['String']>;
  participant_in?: InputMaybe<Array<Scalars['String']>>;
  participant_lt?: InputMaybe<Scalars['String']>;
  participant_lte?: InputMaybe<Scalars['String']>;
  participant_not?: InputMaybe<Scalars['String']>;
  participant_not_contains?: InputMaybe<Scalars['String']>;
  participant_not_contains_nocase?: InputMaybe<Scalars['String']>;
  participant_not_ends_with?: InputMaybe<Scalars['String']>;
  participant_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  participant_not_in?: InputMaybe<Array<Scalars['String']>>;
  participant_not_starts_with?: InputMaybe<Scalars['String']>;
  participant_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  participant_starts_with?: InputMaybe<Scalars['String']>;
  participant_starts_with_nocase?: InputMaybe<Scalars['String']>;
  recipient?: InputMaybe<Scalars['Bytes']>;
  recipient_contains?: InputMaybe<Scalars['Bytes']>;
  recipient_in?: InputMaybe<Array<Scalars['Bytes']>>;
  recipient_not?: InputMaybe<Scalars['Bytes']>;
  recipient_not_contains?: InputMaybe<Scalars['Bytes']>;
  recipient_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardsClaimed?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardsClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_not?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['Bytes']>;
  transaction_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction_not?: InputMaybe<Scalars['Bytes']>;
  transaction_not_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OracleRewardEvent_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  Id = 'id',
  Oracle = 'oracle',
  Owner = 'owner',
  Participant = 'participant',
  ParticipantMana = 'participantMana',
  ParticipantRewardsClaimed = 'participantRewardsClaimed',
  ParticipantStake = 'participantStake',
  Recipient = 'recipient',
  Timestamp = 'timestamp',
  TotalRewardsClaimed = 'totalRewardsClaimed',
  Transaction = 'transaction'
}

export type OracleRound = {
  __typename?: 'OracleRound';
  firstSubmittedAt: Scalars['BigInt'];
  id: Scalars['ID'];
  lastSubmittedAt: Scalars['BigInt'];
  oracle: Oracle;
  prices: Scalars['BigInt'];
  round: Scalars['BigInt'];
  submissionCount: Scalars['BigInt'];
};

export type OracleRound_Filter = {
  firstSubmittedAt?: InputMaybe<Scalars['BigInt']>;
  firstSubmittedAt_gt?: InputMaybe<Scalars['BigInt']>;
  firstSubmittedAt_gte?: InputMaybe<Scalars['BigInt']>;
  firstSubmittedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  firstSubmittedAt_lt?: InputMaybe<Scalars['BigInt']>;
  firstSubmittedAt_lte?: InputMaybe<Scalars['BigInt']>;
  firstSubmittedAt_not?: InputMaybe<Scalars['BigInt']>;
  firstSubmittedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastSubmittedAt?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedAt_gt?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedAt_gte?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastSubmittedAt_lt?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedAt_lte?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedAt_not?: InputMaybe<Scalars['BigInt']>;
  lastSubmittedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oracle?: InputMaybe<Scalars['String']>;
  oracle_contains?: InputMaybe<Scalars['String']>;
  oracle_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_ends_with?: InputMaybe<Scalars['String']>;
  oracle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_gt?: InputMaybe<Scalars['String']>;
  oracle_gte?: InputMaybe<Scalars['String']>;
  oracle_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_lt?: InputMaybe<Scalars['String']>;
  oracle_lte?: InputMaybe<Scalars['String']>;
  oracle_not?: InputMaybe<Scalars['String']>;
  oracle_not_contains?: InputMaybe<Scalars['String']>;
  oracle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']>;
  oracle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_starts_with?: InputMaybe<Scalars['String']>;
  oracle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  prices?: InputMaybe<Scalars['BigInt']>;
  prices_gt?: InputMaybe<Scalars['BigInt']>;
  prices_gte?: InputMaybe<Scalars['BigInt']>;
  prices_in?: InputMaybe<Array<Scalars['BigInt']>>;
  prices_lt?: InputMaybe<Scalars['BigInt']>;
  prices_lte?: InputMaybe<Scalars['BigInt']>;
  prices_not?: InputMaybe<Scalars['BigInt']>;
  prices_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  round?: InputMaybe<Scalars['BigInt']>;
  round_gt?: InputMaybe<Scalars['BigInt']>;
  round_gte?: InputMaybe<Scalars['BigInt']>;
  round_in?: InputMaybe<Array<Scalars['BigInt']>>;
  round_lt?: InputMaybe<Scalars['BigInt']>;
  round_lte?: InputMaybe<Scalars['BigInt']>;
  round_not?: InputMaybe<Scalars['BigInt']>;
  round_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount_lt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_lte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum OracleRound_OrderBy {
  FirstSubmittedAt = 'firstSubmittedAt',
  Id = 'id',
  LastSubmittedAt = 'lastSubmittedAt',
  Oracle = 'oracle',
  Prices = 'prices',
  Round = 'round',
  SubmissionCount = 'submissionCount'
}

export type OracleSlashEvent = {
  __typename?: 'OracleSlashEvent';
  amount: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  id: Scalars['ID'];
  oracle: Oracle;
  owner: Scalars['Bytes'];
  participant: OracleParticipant;
  participantMana: Scalars['BigInt'];
  participantSlashed: Scalars['BigInt'];
  participantStake: Scalars['BigInt'];
  round: Scalars['BigInt'];
  slasher: Scalars['Bytes'];
  slot: Scalars['Int'];
  timestamp: Scalars['BigInt'];
  totalSlashed: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type OracleSlashEvent_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  oracle?: InputMaybe<Scalars['String']>;
  oracle_contains?: InputMaybe<Scalars['String']>;
  oracle_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_ends_with?: InputMaybe<Scalars['String']>;
  oracle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_gt?: InputMaybe<Scalars['String']>;
  oracle_gte?: InputMaybe<Scalars['String']>;
  oracle_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_lt?: InputMaybe<Scalars['String']>;
  oracle_lte?: InputMaybe<Scalars['String']>;
  oracle_not?: InputMaybe<Scalars['String']>;
  oracle_not_contains?: InputMaybe<Scalars['String']>;
  oracle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']>;
  oracle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_starts_with?: InputMaybe<Scalars['String']>;
  oracle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  participant?: InputMaybe<Scalars['String']>;
  participantMana?: InputMaybe<Scalars['BigInt']>;
  participantMana_gt?: InputMaybe<Scalars['BigInt']>;
  participantMana_gte?: InputMaybe<Scalars['BigInt']>;
  participantMana_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantMana_lt?: InputMaybe<Scalars['BigInt']>;
  participantMana_lte?: InputMaybe<Scalars['BigInt']>;
  participantMana_not?: InputMaybe<Scalars['BigInt']>;
  participantMana_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantSlashed?: InputMaybe<Scalars['BigInt']>;
  participantSlashed_gt?: InputMaybe<Scalars['BigInt']>;
  participantSlashed_gte?: InputMaybe<Scalars['BigInt']>;
  participantSlashed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantSlashed_lt?: InputMaybe<Scalars['BigInt']>;
  participantSlashed_lte?: InputMaybe<Scalars['BigInt']>;
  participantSlashed_not?: InputMaybe<Scalars['BigInt']>;
  participantSlashed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantStake?: InputMaybe<Scalars['BigInt']>;
  participantStake_gt?: InputMaybe<Scalars['BigInt']>;
  participantStake_gte?: InputMaybe<Scalars['BigInt']>;
  participantStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantStake_lt?: InputMaybe<Scalars['BigInt']>;
  participantStake_lte?: InputMaybe<Scalars['BigInt']>;
  participantStake_not?: InputMaybe<Scalars['BigInt']>;
  participantStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participant_contains?: InputMaybe<Scalars['String']>;
  participant_contains_nocase?: InputMaybe<Scalars['String']>;
  participant_ends_with?: InputMaybe<Scalars['String']>;
  participant_ends_with_nocase?: InputMaybe<Scalars['String']>;
  participant_gt?: InputMaybe<Scalars['String']>;
  participant_gte?: InputMaybe<Scalars['String']>;
  participant_in?: InputMaybe<Array<Scalars['String']>>;
  participant_lt?: InputMaybe<Scalars['String']>;
  participant_lte?: InputMaybe<Scalars['String']>;
  participant_not?: InputMaybe<Scalars['String']>;
  participant_not_contains?: InputMaybe<Scalars['String']>;
  participant_not_contains_nocase?: InputMaybe<Scalars['String']>;
  participant_not_ends_with?: InputMaybe<Scalars['String']>;
  participant_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  participant_not_in?: InputMaybe<Array<Scalars['String']>>;
  participant_not_starts_with?: InputMaybe<Scalars['String']>;
  participant_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  participant_starts_with?: InputMaybe<Scalars['String']>;
  participant_starts_with_nocase?: InputMaybe<Scalars['String']>;
  round?: InputMaybe<Scalars['BigInt']>;
  round_gt?: InputMaybe<Scalars['BigInt']>;
  round_gte?: InputMaybe<Scalars['BigInt']>;
  round_in?: InputMaybe<Array<Scalars['BigInt']>>;
  round_lt?: InputMaybe<Scalars['BigInt']>;
  round_lte?: InputMaybe<Scalars['BigInt']>;
  round_not?: InputMaybe<Scalars['BigInt']>;
  round_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slasher?: InputMaybe<Scalars['Bytes']>;
  slasher_contains?: InputMaybe<Scalars['Bytes']>;
  slasher_in?: InputMaybe<Array<Scalars['Bytes']>>;
  slasher_not?: InputMaybe<Scalars['Bytes']>;
  slasher_not_contains?: InputMaybe<Scalars['Bytes']>;
  slasher_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  slot?: InputMaybe<Scalars['Int']>;
  slot_gt?: InputMaybe<Scalars['Int']>;
  slot_gte?: InputMaybe<Scalars['Int']>;
  slot_in?: InputMaybe<Array<Scalars['Int']>>;
  slot_lt?: InputMaybe<Scalars['Int']>;
  slot_lte?: InputMaybe<Scalars['Int']>;
  slot_not?: InputMaybe<Scalars['Int']>;
  slot_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSlashed?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_gt?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_gte?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSlashed_lt?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_lte?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_not?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['Bytes']>;
  transaction_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction_not?: InputMaybe<Scalars['Bytes']>;
  transaction_not_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OracleSlashEvent_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  Id = 'id',
  Oracle = 'oracle',
  Owner = 'owner',
  Participant = 'participant',
  ParticipantMana = 'participantMana',
  ParticipantSlashed = 'participantSlashed',
  ParticipantStake = 'participantStake',
  Round = 'round',
  Slasher = 'slasher',
  Slot = 'slot',
  Timestamp = 'timestamp',
  TotalSlashed = 'totalSlashed',
  Transaction = 'transaction'
}

export type OracleSnapshot = {
  __typename?: 'OracleSnapshot';
  blockNumber: Scalars['BigInt'];
  eventCount: Scalars['BigInt'];
  id: Scalars['ID'];
  lastRound: Scalars['BigInt'];
  lastSubmissionTimestamp: Scalars['BigInt'];
  oracle: Oracle;
  participantCount: Scalars['BigInt'];
  submissionCount: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  totalMana: Scalars['BigInt'];
  totalRewardsClaimed: Scalars['BigInt'];
  totalSlashed: Scalars['BigInt'];
  totalStake: Scalars['BigInt'];
};

export type OracleSnapshot_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventCount?: InputMaybe<Scalars['BigInt']>;
  eventCount_gt?: InputMaybe<Scalars['BigInt']>;
  eventCount_gte?: InputMaybe<Scalars['BigInt']>;
  eventCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventCount_lt?: InputMaybe<Scalars['BigInt']>;
  eventCount_lte?: InputMaybe<Scalars['BigInt']>;
  eventCount_not?: InputMaybe<Scalars['BigInt']>;
  eventCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastRound?: InputMaybe<Scalars['BigInt']>;
  lastRound_gt?: InputMaybe<Scalars['BigInt']>;
  lastRound_gte?: InputMaybe<Scalars['BigInt']>;
  lastRound_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastRound_lt?: InputMaybe<Scalars['BigInt']>;
  lastRound_lte?: InputMaybe<Scalars['BigInt']>;
  lastRound_not?: InputMaybe<Scalars['BigInt']>;
  lastRound_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastSubmissionTimestamp?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastSubmissionTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oracle?: InputMaybe<Scalars['String']>;
  oracle_contains?: InputMaybe<Scalars['String']>;
  oracle_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_ends_with?: InputMaybe<Scalars['String']>;
  oracle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_gt?: InputMaybe<Scalars['String']>;
  oracle_gte?: InputMaybe<Scalars['String']>;
  oracle_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_lt?: InputMaybe<Scalars['String']>;
  oracle_lte?: InputMaybe<Scalars['String']>;
  oracle_not?: InputMaybe<Scalars['String']>;
  oracle_not_contains?: InputMaybe<Scalars['String']>;
  oracle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']>;
  oracle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_starts_with?: InputMaybe<Scalars['String']>;
  oracle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  participantCount?: InputMaybe<Scalars['BigInt']>;
  participantCount_gt?: InputMaybe<Scalars['BigInt']>;
  participantCount_gte?: InputMaybe<Scalars['BigInt']>;
  participantCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantCount_lt?: InputMaybe<Scalars['BigInt']>;
  participantCount_lte?: InputMaybe<Scalars['BigInt']>;
  participantCount_not?: InputMaybe<Scalars['BigInt']>;
  participantCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount_lt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_lte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalMana?: InputMaybe<Scalars['BigInt']>;
  totalMana_gt?: InputMaybe<Scalars['BigInt']>;
  totalMana_gte?: InputMaybe<Scalars['BigInt']>;
  totalMana_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalMana_lt?: InputMaybe<Scalars['BigInt']>;
  totalMana_lte?: InputMaybe<Scalars['BigInt']>;
  totalMana_not?: InputMaybe<Scalars['BigInt']>;
  totalMana_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardsClaimed?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardsClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_not?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSlashed?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_gt?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_gte?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSlashed_lt?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_lte?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_not?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStake?: InputMaybe<Scalars['BigInt']>;
  totalStake_gt?: InputMaybe<Scalars['BigInt']>;
  totalStake_gte?: InputMaybe<Scalars['BigInt']>;
  totalStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStake_lt?: InputMaybe<Scalars['BigInt']>;
  totalStake_lte?: InputMaybe<Scalars['BigInt']>;
  totalStake_not?: InputMaybe<Scalars['BigInt']>;
  totalStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum OracleSnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  EventCount = 'eventCount',
  Id = 'id',
  LastRound = 'lastRound',
  LastSubmissionTimestamp = 'lastSubmissionTimestamp',
  Oracle = 'oracle',
  ParticipantCount = 'participantCount',
  SubmissionCount = 'submissionCount',
  Timestamp = 'timestamp',
  TotalMana = 'totalMana',
  TotalRewardsClaimed = 'totalRewardsClaimed',
  TotalSlashed = 'totalSlashed',
  TotalStake = 'totalStake'
}

export type OracleStakeEvent = {
  __typename?: 'OracleStakeEvent';
  amount: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  deposit: Scalars['Boolean'];
  id: Scalars['ID'];
  oracle: Oracle;
  participant: OracleParticipant;
  participantMana: Scalars['BigInt'];
  participantStake: Scalars['BigInt'];
  recipient?: Maybe<Scalars['Bytes']>;
  timestamp: Scalars['BigInt'];
  totalStake: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
  user: Scalars['Bytes'];
};

export type OracleStakeEvent_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deposit?: InputMaybe<Scalars['Boolean']>;
  deposit_in?: InputMaybe<Array<Scalars['Boolean']>>;
  deposit_not?: InputMaybe<Scalars['Boolean']>;
  deposit_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  oracle?: InputMaybe<Scalars['String']>;
  oracle_contains?: InputMaybe<Scalars['String']>;
  oracle_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_ends_with?: InputMaybe<Scalars['String']>;
  oracle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_gt?: InputMaybe<Scalars['String']>;
  oracle_gte?: InputMaybe<Scalars['String']>;
  oracle_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_lt?: InputMaybe<Scalars['String']>;
  oracle_lte?: InputMaybe<Scalars['String']>;
  oracle_not?: InputMaybe<Scalars['String']>;
  oracle_not_contains?: InputMaybe<Scalars['String']>;
  oracle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']>;
  oracle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_starts_with?: InputMaybe<Scalars['String']>;
  oracle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  participant?: InputMaybe<Scalars['String']>;
  participantMana?: InputMaybe<Scalars['BigInt']>;
  participantMana_gt?: InputMaybe<Scalars['BigInt']>;
  participantMana_gte?: InputMaybe<Scalars['BigInt']>;
  participantMana_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantMana_lt?: InputMaybe<Scalars['BigInt']>;
  participantMana_lte?: InputMaybe<Scalars['BigInt']>;
  participantMana_not?: InputMaybe<Scalars['BigInt']>;
  participantMana_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantStake?: InputMaybe<Scalars['BigInt']>;
  participantStake_gt?: InputMaybe<Scalars['BigInt']>;
  participantStake_gte?: InputMaybe<Scalars['BigInt']>;
  participantStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantStake_lt?: InputMaybe<Scalars['BigInt']>;
  participantStake_lte?: InputMaybe<Scalars['BigInt']>;
  participantStake_not?: InputMaybe<Scalars['BigInt']>;
  participantStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participant_contains?: InputMaybe<Scalars['String']>;
  participant_contains_nocase?: InputMaybe<Scalars['String']>;
  participant_ends_with?: InputMaybe<Scalars['String']>;
  participant_ends_with_nocase?: InputMaybe<Scalars['String']>;
  participant_gt?: InputMaybe<Scalars['String']>;
  participant_gte?: InputMaybe<Scalars['String']>;
  participant_in?: InputMaybe<Array<Scalars['String']>>;
  participant_lt?: InputMaybe<Scalars['String']>;
  participant_lte?: InputMaybe<Scalars['String']>;
  participant_not?: InputMaybe<Scalars['String']>;
  participant_not_contains?: InputMaybe<Scalars['String']>;
  participant_not_contains_nocase?: InputMaybe<Scalars['String']>;
  participant_not_ends_with?: InputMaybe<Scalars['String']>;
  participant_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  participant_not_in?: InputMaybe<Array<Scalars['String']>>;
  participant_not_starts_with?: InputMaybe<Scalars['String']>;
  participant_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  participant_starts_with?: InputMaybe<Scalars['String']>;
  participant_starts_with_nocase?: InputMaybe<Scalars['String']>;
  recipient?: InputMaybe<Scalars['Bytes']>;
  recipient_contains?: InputMaybe<Scalars['Bytes']>;
  recipient_in?: InputMaybe<Array<Scalars['Bytes']>>;
  recipient_not?: InputMaybe<Scalars['Bytes']>;
  recipient_not_contains?: InputMaybe<Scalars['Bytes']>;
  recipient_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStake?: InputMaybe<Scalars['BigInt']>;
  totalStake_gt?: InputMaybe<Scalars['BigInt']>;
  totalStake_gte?: InputMaybe<Scalars['BigInt']>;
  totalStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStake_lt?: InputMaybe<Scalars['BigInt']>;
  totalStake_lte?: InputMaybe<Scalars['BigInt']>;
  totalStake_not?: InputMaybe<Scalars['BigInt']>;
  totalStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['Bytes']>;
  transaction_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction_not?: InputMaybe<Scalars['Bytes']>;
  transaction_not_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OracleStakeEvent_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  Deposit = 'deposit',
  Id = 'id',
  Oracle = 'oracle',
  Participant = 'participant',
  ParticipantMana = 'participantMana',
  ParticipantStake = 'participantStake',
  Recipient = 'recipient',
  Timestamp = 'timestamp',
  TotalStake = 'totalStake',
  Transaction = 'transaction',
  User = 'user'
}

export type OracleSubmission = {
  __typename?: 'OracleSubmission';
  blockNumber: Scalars['BigInt'];
  id: Scalars['ID'];
  oracle: Oracle;
  prices: Scalars['BigInt'];
  round: OracleRound;
  submitter: OracleParticipant;
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type OracleSubmission_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  oracle?: InputMaybe<Scalars['String']>;
  oracle_contains?: InputMaybe<Scalars['String']>;
  oracle_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_ends_with?: InputMaybe<Scalars['String']>;
  oracle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_gt?: InputMaybe<Scalars['String']>;
  oracle_gte?: InputMaybe<Scalars['String']>;
  oracle_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_lt?: InputMaybe<Scalars['String']>;
  oracle_lte?: InputMaybe<Scalars['String']>;
  oracle_not?: InputMaybe<Scalars['String']>;
  oracle_not_contains?: InputMaybe<Scalars['String']>;
  oracle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']>;
  oracle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']>;
  oracle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracle_starts_with?: InputMaybe<Scalars['String']>;
  oracle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  prices?: InputMaybe<Scalars['BigInt']>;
  prices_gt?: InputMaybe<Scalars['BigInt']>;
  prices_gte?: InputMaybe<Scalars['BigInt']>;
  prices_in?: InputMaybe<Array<Scalars['BigInt']>>;
  prices_lt?: InputMaybe<Scalars['BigInt']>;
  prices_lte?: InputMaybe<Scalars['BigInt']>;
  prices_not?: InputMaybe<Scalars['BigInt']>;
  prices_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  round?: InputMaybe<Scalars['String']>;
  round_contains?: InputMaybe<Scalars['String']>;
  round_contains_nocase?: InputMaybe<Scalars['String']>;
  round_ends_with?: InputMaybe<Scalars['String']>;
  round_ends_with_nocase?: InputMaybe<Scalars['String']>;
  round_gt?: InputMaybe<Scalars['String']>;
  round_gte?: InputMaybe<Scalars['String']>;
  round_in?: InputMaybe<Array<Scalars['String']>>;
  round_lt?: InputMaybe<Scalars['String']>;
  round_lte?: InputMaybe<Scalars['String']>;
  round_not?: InputMaybe<Scalars['String']>;
  round_not_contains?: InputMaybe<Scalars['String']>;
  round_not_contains_nocase?: InputMaybe<Scalars['String']>;
  round_not_ends_with?: InputMaybe<Scalars['String']>;
  round_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  round_not_in?: InputMaybe<Array<Scalars['String']>>;
  round_not_starts_with?: InputMaybe<Scalars['String']>;
  round_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  round_starts_with?: InputMaybe<Scalars['String']>;
  round_starts_with_nocase?: InputMaybe<Scalars['String']>;
  submitter?: InputMaybe<Scalars['String']>;
  submitter_contains?: InputMaybe<Scalars['String']>;
  submitter_contains_nocase?: InputMaybe<Scalars['String']>;
  submitter_ends_with?: InputMaybe<Scalars['String']>;
  submitter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  submitter_gt?: InputMaybe<Scalars['String']>;
  submitter_gte?: InputMaybe<Scalars['String']>;
  submitter_in?: InputMaybe<Array<Scalars['String']>>;
  submitter_lt?: InputMaybe<Scalars['String']>;
  submitter_lte?: InputMaybe<Scalars['String']>;
  submitter_not?: InputMaybe<Scalars['String']>;
  submitter_not_contains?: InputMaybe<Scalars['String']>;
  submitter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  submitter_not_ends_with?: InputMaybe<Scalars['String']>;
  submitter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  submitter_not_in?: InputMaybe<Array<Scalars['String']>>;
  submitter_not_starts_with?: InputMaybe<Scalars['String']>;
  submitter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  submitter_starts_with?: InputMaybe<Scalars['String']>;
  submitter_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['Bytes']>;
  transaction_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction_not?: InputMaybe<Scalars['Bytes']>;
  transaction_not_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OracleSubmission_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Oracle = 'oracle',
  Prices = 'prices',
  Round = 'round',
  Submitter = 'submitter',
  Timestamp = 'timestamp',
  Transaction = 'transaction'
}

export type Oracle_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastRound?: InputMaybe<Scalars['BigInt']>;
  lastRound_gt?: InputMaybe<Scalars['BigInt']>;
  lastRound_gte?: InputMaybe<Scalars['BigInt']>;
  lastRound_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastRound_lt?: InputMaybe<Scalars['BigInt']>;
  lastRound_lte?: InputMaybe<Scalars['BigInt']>;
  lastRound_not?: InputMaybe<Scalars['BigInt']>;
  lastRound_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastSubmissionTimestamp?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastSubmissionTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  lastSubmissionTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantCount?: InputMaybe<Scalars['BigInt']>;
  participantCount_gt?: InputMaybe<Scalars['BigInt']>;
  participantCount_gte?: InputMaybe<Scalars['BigInt']>;
  participantCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participantCount_lt?: InputMaybe<Scalars['BigInt']>;
  participantCount_lte?: InputMaybe<Scalars['BigInt']>;
  participantCount_not?: InputMaybe<Scalars['BigInt']>;
  participantCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_gte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  submissionCount_lt?: InputMaybe<Scalars['BigInt']>;
  submissionCount_lte?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not?: InputMaybe<Scalars['BigInt']>;
  submissionCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalMana?: InputMaybe<Scalars['BigInt']>;
  totalMana_gt?: InputMaybe<Scalars['BigInt']>;
  totalMana_gte?: InputMaybe<Scalars['BigInt']>;
  totalMana_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalMana_lt?: InputMaybe<Scalars['BigInt']>;
  totalMana_lte?: InputMaybe<Scalars['BigInt']>;
  totalMana_not?: InputMaybe<Scalars['BigInt']>;
  totalMana_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardsClaimed?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardsClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_not?: InputMaybe<Scalars['BigInt']>;
  totalRewardsClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSlashed?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_gt?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_gte?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSlashed_lt?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_lte?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_not?: InputMaybe<Scalars['BigInt']>;
  totalSlashed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStake?: InputMaybe<Scalars['BigInt']>;
  totalStake_gt?: InputMaybe<Scalars['BigInt']>;
  totalStake_gte?: InputMaybe<Scalars['BigInt']>;
  totalStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStake_lt?: InputMaybe<Scalars['BigInt']>;
  totalStake_lte?: InputMaybe<Scalars['BigInt']>;
  totalStake_not?: InputMaybe<Scalars['BigInt']>;
  totalStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Oracle_OrderBy {
  Id = 'id',
  LastRound = 'lastRound',
  LastSubmissionTimestamp = 'lastSubmissionTimestamp',
  ParticipantCount = 'participantCount',
  Participants = 'participants',
  RewardEvents = 'rewardEvents',
  Rounds = 'rounds',
  SlashEvents = 'slashEvents',
  Snapshots = 'snapshots',
  StakeEvents = 'stakeEvents',
  SubmissionCount = 'submissionCount',
  TotalMana = 'totalMana',
  TotalRewardsClaimed = 'totalRewardsClaimed',
  TotalSlashed = 'totalSlashed',
  TotalStake = 'totalStake'
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
  marketRoundSnapshot?: Maybe<MarketRoundSnapshot>;
  marketRoundSnapshots: Array<MarketRoundSnapshot>;
  marketSnapshot?: Maybe<MarketSnapshot>;
  marketSnapshots: Array<MarketSnapshot>;
  marketTradeEvent?: Maybe<MarketTradeEvent>;
  marketTradeEvents: Array<MarketTradeEvent>;
  oracle?: Maybe<Oracle>;
  oracleParticipant?: Maybe<OracleParticipant>;
  oracleParticipantSnapshot?: Maybe<OracleParticipantSnapshot>;
  oracleParticipantSnapshots: Array<OracleParticipantSnapshot>;
  oracleParticipants: Array<OracleParticipant>;
  oracleRewardEvent?: Maybe<OracleRewardEvent>;
  oracleRewardEvents: Array<OracleRewardEvent>;
  oracleRound?: Maybe<OracleRound>;
  oracleRounds: Array<OracleRound>;
  oracleSlashEvent?: Maybe<OracleSlashEvent>;
  oracleSlashEvents: Array<OracleSlashEvent>;
  oracleSnapshot?: Maybe<OracleSnapshot>;
  oracleSnapshots: Array<OracleSnapshot>;
  oracleStakeEvent?: Maybe<OracleStakeEvent>;
  oracleStakeEvents: Array<OracleStakeEvent>;
  oracleSubmission?: Maybe<OracleSubmission>;
  oracleSubmissions: Array<OracleSubmission>;
  oracles: Array<Oracle>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  position?: Maybe<Position>;
  positionClaim?: Maybe<PositionClaim>;
  positionClaims: Array<PositionClaim>;
  positions: Array<Position>;
  synth?: Maybe<Synth>;
  synths: Array<Synth>;
  tick?: Maybe<Tick>;
  tickSnapshot?: Maybe<TickSnapshot>;
  tickSnapshots: Array<TickSnapshot>;
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


export type QueryMarketRoundSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketRoundSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarketRoundSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketRoundSnapshot_Filter>;
};


export type QueryMarketSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarketSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketSnapshot_Filter>;
};


export type QueryMarketTradeEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketTradeEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarketTradeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketTradeEvent_Filter>;
};


export type QueryOracleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOracleParticipantArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOracleParticipantSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOracleParticipantSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleParticipantSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleParticipantSnapshot_Filter>;
};


export type QueryOracleParticipantsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleParticipant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleParticipant_Filter>;
};


export type QueryOracleRewardEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOracleRewardEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleRewardEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleRewardEvent_Filter>;
};


export type QueryOracleRoundArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOracleRoundsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleRound_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleRound_Filter>;
};


export type QueryOracleSlashEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOracleSlashEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleSlashEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleSlashEvent_Filter>;
};


export type QueryOracleSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOracleSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleSnapshot_Filter>;
};


export type QueryOracleStakeEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOracleStakeEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleStakeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleStakeEvent_Filter>;
};


export type QueryOracleSubmissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOracleSubmissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleSubmission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleSubmission_Filter>;
};


export type QueryOraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Oracle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Oracle_Filter>;
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


export type QueryTickSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTickSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TickSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TickSnapshot_Filter>;
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
  marketRoundSnapshot?: Maybe<MarketRoundSnapshot>;
  marketRoundSnapshots: Array<MarketRoundSnapshot>;
  marketSnapshot?: Maybe<MarketSnapshot>;
  marketSnapshots: Array<MarketSnapshot>;
  marketTradeEvent?: Maybe<MarketTradeEvent>;
  marketTradeEvents: Array<MarketTradeEvent>;
  oracle?: Maybe<Oracle>;
  oracleParticipant?: Maybe<OracleParticipant>;
  oracleParticipantSnapshot?: Maybe<OracleParticipantSnapshot>;
  oracleParticipantSnapshots: Array<OracleParticipantSnapshot>;
  oracleParticipants: Array<OracleParticipant>;
  oracleRewardEvent?: Maybe<OracleRewardEvent>;
  oracleRewardEvents: Array<OracleRewardEvent>;
  oracleRound?: Maybe<OracleRound>;
  oracleRounds: Array<OracleRound>;
  oracleSlashEvent?: Maybe<OracleSlashEvent>;
  oracleSlashEvents: Array<OracleSlashEvent>;
  oracleSnapshot?: Maybe<OracleSnapshot>;
  oracleSnapshots: Array<OracleSnapshot>;
  oracleStakeEvent?: Maybe<OracleStakeEvent>;
  oracleStakeEvents: Array<OracleStakeEvent>;
  oracleSubmission?: Maybe<OracleSubmission>;
  oracleSubmissions: Array<OracleSubmission>;
  oracles: Array<Oracle>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  position?: Maybe<Position>;
  positionClaim?: Maybe<PositionClaim>;
  positionClaims: Array<PositionClaim>;
  positions: Array<Position>;
  synth?: Maybe<Synth>;
  synths: Array<Synth>;
  tick?: Maybe<Tick>;
  tickSnapshot?: Maybe<TickSnapshot>;
  tickSnapshots: Array<TickSnapshot>;
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


export type SubscriptionMarketRoundSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMarketRoundSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarketRoundSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketRoundSnapshot_Filter>;
};


export type SubscriptionMarketSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMarketSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarketSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketSnapshot_Filter>;
};


export type SubscriptionMarketTradeEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMarketTradeEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarketTradeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketTradeEvent_Filter>;
};


export type SubscriptionOracleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOracleParticipantArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOracleParticipantSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOracleParticipantSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleParticipantSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleParticipantSnapshot_Filter>;
};


export type SubscriptionOracleParticipantsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleParticipant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleParticipant_Filter>;
};


export type SubscriptionOracleRewardEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOracleRewardEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleRewardEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleRewardEvent_Filter>;
};


export type SubscriptionOracleRoundArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOracleRoundsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleRound_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleRound_Filter>;
};


export type SubscriptionOracleSlashEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOracleSlashEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleSlashEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleSlashEvent_Filter>;
};


export type SubscriptionOracleSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOracleSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleSnapshot_Filter>;
};


export type SubscriptionOracleStakeEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOracleStakeEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleStakeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleStakeEvent_Filter>;
};


export type SubscriptionOracleSubmissionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOracleSubmissionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OracleSubmission_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OracleSubmission_Filter>;
};


export type SubscriptionOraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Oracle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Oracle_Filter>;
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


export type SubscriptionTickSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTickSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TickSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TickSnapshot_Filter>;
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
  roundSnapshots: Array<MarketRoundSnapshot>;
  snapshots: Array<MarketSnapshot>;
  ticks: Array<Tick>;
  tradeEvents: Array<MarketTradeEvent>;
};


export type SynthRoundSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarketRoundSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MarketRoundSnapshot_Filter>;
};


export type SynthSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarketSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MarketSnapshot_Filter>;
};


export type SynthTicksArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Tick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Tick_Filter>;
};


export type SynthTradeEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarketTradeEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MarketTradeEvent_Filter>;
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
  RoundSnapshots = 'roundSnapshots',
  Snapshots = 'snapshots',
  Ticks = 'ticks',
  TradeEvents = 'tradeEvents'
}

export type Tick = {
  __typename?: 'Tick';
  id: Scalars['ID'];
  index: Scalars['Int'];
  liquidity: Scalars['BigInt'];
  pool: Synth;
  snapshots: Array<TickSnapshot>;
};


export type TickSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TickSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TickSnapshot_Filter>;
};

export type TickSnapshot = {
  __typename?: 'TickSnapshot';
  blockNumber: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidity: Scalars['BigInt'];
  pool: Synth;
  tick: Tick;
  tickIndex: Scalars['Int'];
  timestamp: Scalars['BigInt'];
};

export type TickSnapshot_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  tick?: InputMaybe<Scalars['String']>;
  tickIndex?: InputMaybe<Scalars['Int']>;
  tickIndex_gt?: InputMaybe<Scalars['Int']>;
  tickIndex_gte?: InputMaybe<Scalars['Int']>;
  tickIndex_in?: InputMaybe<Array<Scalars['Int']>>;
  tickIndex_lt?: InputMaybe<Scalars['Int']>;
  tickIndex_lte?: InputMaybe<Scalars['Int']>;
  tickIndex_not?: InputMaybe<Scalars['Int']>;
  tickIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tick_contains?: InputMaybe<Scalars['String']>;
  tick_contains_nocase?: InputMaybe<Scalars['String']>;
  tick_ends_with?: InputMaybe<Scalars['String']>;
  tick_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tick_gt?: InputMaybe<Scalars['String']>;
  tick_gte?: InputMaybe<Scalars['String']>;
  tick_in?: InputMaybe<Array<Scalars['String']>>;
  tick_lt?: InputMaybe<Scalars['String']>;
  tick_lte?: InputMaybe<Scalars['String']>;
  tick_not?: InputMaybe<Scalars['String']>;
  tick_not_contains?: InputMaybe<Scalars['String']>;
  tick_not_contains_nocase?: InputMaybe<Scalars['String']>;
  tick_not_ends_with?: InputMaybe<Scalars['String']>;
  tick_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tick_not_in?: InputMaybe<Array<Scalars['String']>>;
  tick_not_starts_with?: InputMaybe<Scalars['String']>;
  tick_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tick_starts_with?: InputMaybe<Scalars['String']>;
  tick_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum TickSnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Liquidity = 'liquidity',
  Pool = 'pool',
  Tick = 'tick',
  TickIndex = 'tickIndex',
  Timestamp = 'timestamp'
}

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
  Pool = 'pool',
  Snapshots = 'snapshots'
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

export type SynthFragmentFragment = { __typename?: 'Synth', id: string, long: boolean, oracle: any, ticks: Array<{ __typename?: 'Tick', id: string, index: number, liquidity: number }> };

export type GetSynthsQueryVariables = Exact<{
  where?: InputMaybe<Synth_Filter>;
}>;


export type GetSynthsQuery = { __typename?: 'Query', synths: Array<{ __typename?: 'Synth', id: string, long: boolean, oracle: any, ticks: Array<{ __typename?: 'Tick', id: string, index: number, liquidity: number }> }> };

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

export type LatestMarketSnapshotFragmentFragment = { __typename?: 'MarketSnapshot', id: string, timestamp: number, blockNumber: number, totalLiquidity: number, totalSupply: number, poolDebt: number, tick: number, price: number, enterVolume: number, exitVolume: number, swapLiquidityVolume: number, eventCount: number };

export type MarketRoundSnapshotFragmentFragment = { __typename?: 'MarketRoundSnapshot', id: string, round: number, timestamp: number, blockNumber: number, totalLiquidity: number, totalSupply: number, poolDebt: number, tick: number, price: number, enterVolume: number, exitVolume: number, swapLiquidityVolume: number, eventCount: number };

export type MarketTradeEventFragmentFragment = { __typename?: 'MarketTradeEvent', id: string, kind: string, round?: number | null, amount: number, tick: number, hasTick: boolean, totalLiquidity: number, totalSupply: number, poolDebt: number, price: number, timestamp: number, blockNumber: number, transaction: any };

export type MarketSummaryFragmentFragment = { __typename?: 'Synth', id: string, long: boolean, oracle: any, latestSnapshots: Array<{ __typename?: 'MarketSnapshot', id: string, timestamp: number, blockNumber: number, totalLiquidity: number, totalSupply: number, poolDebt: number, tick: number, price: number, enterVolume: number, exitVolume: number, swapLiquidityVolume: number, eventCount: number }> };

export type GetMarketSummariesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetMarketSummariesQuery = { __typename?: 'Query', synths: Array<{ __typename?: 'Synth', id: string, long: boolean, oracle: any, latestSnapshots: Array<{ __typename?: 'MarketSnapshot', id: string, timestamp: number, blockNumber: number, totalLiquidity: number, totalSupply: number, poolDebt: number, tick: number, price: number, enterVolume: number, exitVolume: number, swapLiquidityVolume: number, eventCount: number }> }> };

export type GetMarketDetailQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetMarketDetailQuery = { __typename?: 'Query', synth?: { __typename?: 'Synth', id: string, long: boolean, oracle: any, snapshots: Array<{ __typename?: 'MarketSnapshot', id: string, timestamp: number, blockNumber: number, totalLiquidity: number, totalSupply: number, poolDebt: number, tick: number, price: number, enterVolume: number, exitVolume: number, swapLiquidityVolume: number, eventCount: number }>, roundSnapshots: Array<{ __typename?: 'MarketRoundSnapshot', id: string, round: number, timestamp: number, blockNumber: number, totalLiquidity: number, totalSupply: number, poolDebt: number, tick: number, price: number, enterVolume: number, exitVolume: number, swapLiquidityVolume: number, eventCount: number }>, tradeEvents: Array<{ __typename?: 'MarketTradeEvent', id: string, kind: string, round?: number | null, amount: number, tick: number, hasTick: boolean, totalLiquidity: number, totalSupply: number, poolDebt: number, price: number, timestamp: number, blockNumber: number, transaction: any }> } | null };

export type OracleSummaryFragmentFragment = { __typename?: 'Oracle', id: string, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number, lastSubmissionTimestamp: number, latestSnapshots: Array<{ __typename?: 'OracleSnapshot', id: string, timestamp: number, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number }> };

export type OracleSnapshotFragmentFragment = { __typename?: 'OracleSnapshot', id: string, timestamp: number, blockNumber: number, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number, lastSubmissionTimestamp: number, eventCount: number };

export type OracleParticipantFragmentFragment = { __typename?: 'OracleParticipant', id: string, user: any, stake: number, mana: number, rewardsClaimed: number, submissionCount: number, slashed: number, lastSubmittedRound: number };

export type GetOracleSummariesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetOracleSummariesQuery = { __typename?: 'Query', oracles: Array<{ __typename?: 'Oracle', id: string, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number, lastSubmissionTimestamp: number, latestSnapshots: Array<{ __typename?: 'OracleSnapshot', id: string, timestamp: number, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number }> }> };

export type GetOracleSummaryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOracleSummaryQuery = { __typename?: 'Query', oracle?: { __typename?: 'Oracle', id: string, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number, lastSubmissionTimestamp: number, latestSnapshots: Array<{ __typename?: 'OracleSnapshot', id: string, timestamp: number, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number }> } | null };

export type GetOracleDetailQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOracleDetailQuery = { __typename?: 'Query', oracle?: { __typename?: 'Oracle', id: string, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number, lastSubmissionTimestamp: number, snapshots: Array<{ __typename?: 'OracleSnapshot', id: string, timestamp: number, blockNumber: number, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number, lastSubmissionTimestamp: number, eventCount: number }>, participants: Array<{ __typename?: 'OracleParticipant', id: string, user: any, stake: number, mana: number, rewardsClaimed: number, submissionCount: number, slashed: number, lastSubmittedRound: number }>, stakeEvents: Array<{ __typename?: 'OracleStakeEvent', id: string, deposit: boolean, amount: number, user: any, totalStake: number, participantStake: number, participantMana: number, timestamp: number, transaction: any }>, rewardEvents: Array<{ __typename?: 'OracleRewardEvent', id: string, owner: any, recipient: any, amount: number, totalRewardsClaimed: number, participantRewardsClaimed: number, timestamp: number, transaction: any }>, slashEvents: Array<{ __typename?: 'OracleSlashEvent', id: string, owner: any, slasher: any, round: number, slot: number, amount: number, totalSlashed: number, participantSlashed: number, timestamp: number, transaction: any }>, latestSnapshots: Array<{ __typename?: 'OracleSnapshot', id: string, timestamp: number, totalStake: number, totalMana: number, totalRewardsClaimed: number, totalSlashed: number, submissionCount: number, participantCount: number, lastRound: number }> } | null };

export type UniPositionFragment = { __typename?: 'UniPosition', id: string };

export type GetUniPositionsQueryVariables = Exact<{
  where?: InputMaybe<UniPosition_Filter>;
}>;


export type GetUniPositionsQuery = { __typename?: 'Query', uniPositions: Array<{ __typename?: 'UniPosition', id: string }> };

export type PoolFragment = { __typename?: 'Pool', id: string, token0: any, token1: any, fee: number, tickSpacing: number };

export type GetPoolsQueryVariables = Exact<{
  where?: InputMaybe<Pool_Filter>;
}>;


export type GetPoolsQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string, token0: any, token1: any, fee: number, tickSpacing: number }> };

export const SynthFragmentFragmentDoc = gql`
    fragment SynthFragment on Synth {
  id
  long
  oracle
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
export const MarketRoundSnapshotFragmentFragmentDoc = gql`
    fragment MarketRoundSnapshotFragment on MarketRoundSnapshot {
  id
  round
  timestamp
  blockNumber
  totalLiquidity
  totalSupply
  poolDebt
  tick
  price
  enterVolume
  exitVolume
  swapLiquidityVolume
  eventCount
}
    `;
export const MarketTradeEventFragmentFragmentDoc = gql`
    fragment MarketTradeEventFragment on MarketTradeEvent {
  id
  kind
  round
  amount
  tick
  hasTick
  totalLiquidity
  totalSupply
  poolDebt
  price
  timestamp
  blockNumber
  transaction
}
    `;
export const LatestMarketSnapshotFragmentFragmentDoc = gql`
    fragment LatestMarketSnapshotFragment on MarketSnapshot {
  id
  timestamp
  blockNumber
  totalLiquidity
  totalSupply
  poolDebt
  tick
  price
  enterVolume
  exitVolume
  swapLiquidityVolume
  eventCount
}
    `;
export const MarketSummaryFragmentFragmentDoc = gql`
    fragment MarketSummaryFragment on Synth {
  id
  long
  oracle
  latestSnapshots: snapshots(first: 1, orderBy: timestamp, orderDirection: desc) {
    ...LatestMarketSnapshotFragment
  }
}
    ${LatestMarketSnapshotFragmentFragmentDoc}`;
export const OracleSummaryFragmentFragmentDoc = gql`
    fragment OracleSummaryFragment on Oracle {
  id
  totalStake
  totalMana
  totalRewardsClaimed
  totalSlashed
  submissionCount
  participantCount
  lastRound
  lastSubmissionTimestamp
  latestSnapshots: snapshots(first: 1, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    totalStake
    totalMana
    totalRewardsClaimed
    totalSlashed
    submissionCount
    participantCount
    lastRound
  }
}
    `;
export const OracleSnapshotFragmentFragmentDoc = gql`
    fragment OracleSnapshotFragment on OracleSnapshot {
  id
  timestamp
  blockNumber
  totalStake
  totalMana
  totalRewardsClaimed
  totalSlashed
  submissionCount
  participantCount
  lastRound
  lastSubmissionTimestamp
  eventCount
}
    `;
export const OracleParticipantFragmentFragmentDoc = gql`
    fragment OracleParticipantFragment on OracleParticipant {
  id
  user
  stake
  mana
  rewardsClaimed
  submissionCount
  slashed
  lastSubmittedRound
}
    `;
export const UniPositionFragmentDoc = gql`
    fragment UniPosition on UniPosition {
  id
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
export const GetMarketSummariesDocument = gql`
    query getMarketSummaries($first: Int = 1000, $skip: Int = 0) {
  synths(first: $first, skip: $skip) {
    ...MarketSummaryFragment
  }
}
    ${MarketSummaryFragmentFragmentDoc}`;
export const GetMarketDetailDocument = gql`
    query getMarketDetail($id: ID!) {
  synth(id: $id) {
    id
    long
    oracle
    snapshots(first: 365, orderBy: timestamp, orderDirection: asc) {
      ...LatestMarketSnapshotFragment
    }
    roundSnapshots(first: 1000, orderBy: round, orderDirection: asc) {
      ...MarketRoundSnapshotFragment
    }
    tradeEvents(first: 50, orderBy: timestamp, orderDirection: desc) {
      ...MarketTradeEventFragment
    }
  }
}
    ${LatestMarketSnapshotFragmentFragmentDoc}
${MarketRoundSnapshotFragmentFragmentDoc}
${MarketTradeEventFragmentFragmentDoc}`;
export const GetOracleSummariesDocument = gql`
    query getOracleSummaries($first: Int = 1000, $skip: Int = 0) {
  oracles(first: $first, skip: $skip, orderBy: totalStake, orderDirection: desc) {
    ...OracleSummaryFragment
  }
}
    ${OracleSummaryFragmentFragmentDoc}`;
export const GetOracleSummaryDocument = gql`
    query getOracleSummary($id: ID!) {
  oracle(id: $id) {
    ...OracleSummaryFragment
  }
}
    ${OracleSummaryFragmentFragmentDoc}`;
export const GetOracleDetailDocument = gql`
    query getOracleDetail($id: ID!) {
  oracle(id: $id) {
    ...OracleSummaryFragment
    snapshots(first: 365, orderBy: timestamp, orderDirection: asc) {
      ...OracleSnapshotFragment
    }
    participants(first: 100, orderBy: stake, orderDirection: desc) {
      ...OracleParticipantFragment
    }
    stakeEvents(first: 30, orderBy: timestamp, orderDirection: desc) {
      id
      deposit
      amount
      user
      totalStake
      participantStake
      participantMana
      timestamp
      transaction
    }
    rewardEvents(first: 30, orderBy: timestamp, orderDirection: desc) {
      id
      owner
      recipient
      amount
      totalRewardsClaimed
      participantRewardsClaimed
      timestamp
      transaction
    }
    slashEvents(first: 30, orderBy: timestamp, orderDirection: desc) {
      id
      owner
      slasher
      round
      slot
      amount
      totalSlashed
      participantSlashed
      timestamp
      transaction
    }
  }
}
    ${OracleSummaryFragmentFragmentDoc}
${OracleSnapshotFragmentFragmentDoc}
${OracleParticipantFragmentFragmentDoc}`;
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
    getMarketSummaries(variables?: GetMarketSummariesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetMarketSummariesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMarketSummariesQuery>(GetMarketSummariesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getMarketSummaries', 'query');
    },
    getMarketDetail(variables: GetMarketDetailQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetMarketDetailQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMarketDetailQuery>(GetMarketDetailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getMarketDetail', 'query');
    },
    getOracleSummaries(variables?: GetOracleSummariesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetOracleSummariesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetOracleSummariesQuery>(GetOracleSummariesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getOracleSummaries', 'query');
    },
    getOracleSummary(variables: GetOracleSummaryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetOracleSummaryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetOracleSummaryQuery>(GetOracleSummaryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getOracleSummary', 'query');
    },
    getOracleDetail(variables: GetOracleDetailQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetOracleDetailQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetOracleDetailQuery>(GetOracleDetailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getOracleDetail', 'query');
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