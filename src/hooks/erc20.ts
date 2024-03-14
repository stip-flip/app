import { constants, type BigNumberish, type Signer } from "ethers";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils.js";
import { formatAmount } from "src/lib";
import { sdk, type Network } from "src/stores";
import { chainId, signer, signerAddress } from "svelte-ethers-store";
import { derived, get, type Readable } from "svelte/store";
import { bn, broadcastTransaction, resolvedTransactions } from "./blocknumber";

export interface TokenInfo {
  icon?: string;
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  description?: string;
}

export const extractERC20Info = async (address: string): Promise<TokenInfo> => {
  try {
    const erc20 = get(sdk).POOL.attach(address);

    const [name, symbol, decimals, description] = await Promise.all([
      erc20.name(),
      erc20.symbol(),
      erc20.decimals(),
      erc20.description().catch(() => ""), // description is NOT part of the ERC20 standard
    ]);
    return {
      name,
      address,
      symbol,
      decimals,
      description,
    };
  } catch (e) {
    console.warn(e);
    return { name: "", decimals: 18, symbol: "", address };
  }
};

export const asyncAllowance = async (
  tokenAddress: string,
  spender: string,
  account?: string
) => {
  if (!tokenAddress || !(account && get(signerAddress))) return 0;
  const token = get(sdk).USDC.connect(tokenAddress);
  const aallowance = token.allowance(account || get(signerAddress), spender);
  const adecimals = token.decimals();
  const [allowance, decimals] = await Promise.all([aallowance, adecimals]);
  return formatUnits(allowance, decimals);
};

export const useAllowance = (
  tokenAddress: string,
  spender: string,
  account?: string
): Readable<number> => {
  return derived(
    [bn, signerAddress, chainId],
    ([$bn, $signerAddress, $chainId], set) => {
      asyncAllowance(tokenAddress, spender, account || $signerAddress).then(
        (res) => {
          set(Number(res));
        }
      );
    }
  );
};

export const asyncBalance = async (tokenAddress: string, account?: string) => {
  try {
    if (!tokenAddress || !(account && get(signerAddress))) return 0;
    if (tokenAddress == "0x0")
      return formatEther(await get(signer).getBalance());
    const token = get(sdk).USDC.attach(tokenAddress as string);
    const aamount = token.balanceOf(account || get(signerAddress));
    // const aamount = parseEther("0");
    const adecimals = token.decimals();
    // const adecimals = "18";
    const [amount, decimals] = await Promise.all([aamount, adecimals]);
    return formatUnits(amount, decimals);
  } catch (e) {
    console.warn(e);
    return 0;
  }
};

export const useBalance = (
  tokenAddress: string,
  account?: string | undefined | null
): Readable<number> => {
  return derived(
    [bn, signerAddress, resolvedTransactions, chainId],
    ([$bn, $signerAddress, $resolvedTransactions, $chainId], set) => {
      asyncBalance(tokenAddress, account || $signerAddress).then((res) => {
        set(Number(res));
      });
    }
  );
};

export const usdcBalance: Readable<number> = useBalance(get(sdk).USDC.address);

export const asyncAllowances = async function (
  tokenAddress: (string | undefined | null)[],
  spender: string,
  account?: string | undefined | null
): Promise<number[]> {
  if (!tokenAddress || !account || !spender) return [];
  const tokens = (tokenAddress || [])
    .filter((t) => !!t)
    .map((t) => get(sdk).USDC.connect(t as string));
  const allowances: number[] = [];
  const results = await Promise.all(
    tokens.reduce((acc, cur) => {
      // if (!cur) return acc;
      acc.push(cur?.decimals());
      acc.push(cur?.allowance(account, spender));
      return acc;
    }, [] as Promise<any>[])
  );
  while (results.length) {
    allowances.push(Number(formatUnits(results.pop(), results.pop())));
  }
  return allowances.reverse();
};

// do not see where its being used might be deprecated
export const useAllowances = (
  tokenAddress: (string | undefined | null)[],
  spender: string,
  account?: string
): Readable<number[]> => {
  return derived(
    [signerAddress, bn, chainId],
    ([$signerAddress, $bn, $chainId], set) => {
      asyncAllowances(tokenAddress, spender, account || $signerAddress)
        .then((res) => {
          set(res);
        })
        .catch((err) => console.error(err));
    },
    [] as number[]
  );
};

export const asyncBalances = async (
  tokenAddresses: (string | undefined | null)[],
  account?: string | undefined | null
) => {
  if (!tokenAddresses || !account) return [];
  const tokens = (tokenAddresses || [])
    .filter((t) => !!t)
    .map((t) => get(sdk).USDC.attach(t as string));
  const balances: number[] = [];
  const results = await Promise.all(
    tokens.reduce((acc, cur) => {
      // if (!cur) return acc;
      acc.push(cur?.decimals());
      acc.push(cur?.balanceOf(account || get(signerAddress)));
      return acc;
    }, [] as Promise<any>[])
  );
  while (results.length) {
    balances.push(Number(formatUnits(results.pop(), results.pop())));
  }
  return balances.reverse();
};

// do not see where its being used might be deprecated
export const useBalances = (
  tokenAddress: (string | undefined | null)[],
  account?: string
): Readable<number[]> => {
  return derived(
    [signerAddress, bn, chainId],
    ([$signerAddress, $bn, $chainId], set) => {
      asyncBalances(tokenAddress, account || $signerAddress)
        .then((res) => {
          set(res);
        })
        .catch((err) => console.error(err));
    },
    [] as number[]
  );
};

// do not see where its being used might be deprecated
export const useInfos = (tokenAddresses: string[]): Readable<TokenInfo[]> => {
  return derived([chainId], ([$chainId], set) => {
    Promise.all(tokenAddresses.map((ta) => extractERC20Info(ta))).then(
      (res) => {
        set(res);
      }
    );
  });
};

export const useInfo = (tokenAddress: string): Readable<TokenInfo> => {
  return derived([chainId], ([$chainId], set) => {
    extractERC20Info(tokenAddress).then((res) => {
      set(res);
    });
  });
};

export const infosAndBalanceAsync = async (address: string) => {
  if (!address) return;
  const infoPromise = extractERC20Info(address);
  const balancePromise = asyncBalance(address, get(signerAddress));
  const [info, balance] = await Promise.all([infoPromise, balancePromise]);
  return { info, balance };
};

export const useInfoAndBalance = (
  address: string,
  account?: string
): Readable<TokenInfoAndBalance> => {
  return derived(
    [chainId, signerAddress, bn],
    ([$chainId, $signerAddress, $bn], set) => {
      infosAndBalanceAsync(address).then((res) => {
        set(res);
      });
    }
  );
};

export type TokenInfoAndBalance = {
  info: TokenInfo;
  balance: number;
};

export const useInfosAndBalances = (
  tokenAddresses: string[]
): Readable<TokenInfoAndBalance[]> => {
  return derived(
    [chainId, signerAddress, bn],
    ([$chainId, $signerAddress, $bn], set) => {
      (async function () {
        const infos = Promise.all(
          tokenAddresses.map((ta) => extractERC20Info(ta))
        );
        const balances = asyncBalances(tokenAddresses, $signerAddress);
        const [resInfos, resBalances] = await Promise.all([infos, balances]);
        console.log(resBalances);
        set(
          resInfos.map((info, i) => ({
            info,
            balance: resBalances[i],
          }))
        );
      })();
    }
  );
};

export const usdcInfo: Readable<TokenInfo> = useInfo(get(sdk).USDC.address);

export async function increaseAllowance(asset: string, spender: string) {
  const erc20 = get(sdk).USDC.attach(asset);
  return broadcastTransaction(
    "Increase Allowance",
    erc20
      .connect(get(signer))
      ["approve(address,uint256)"](spender, constants.MaxUint256)
  );
}
