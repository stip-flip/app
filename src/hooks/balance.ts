import { formatEther } from "ethers/lib/utils";
import { provider } from "src/stores/eth-sdk";
import { chainId, signerAddress } from "svelte-ethers-store";
import { derived, type Readable } from "svelte/store";
import type { TokenInfoAndBalance } from "./erc20";
import { resolvedTransactions } from "./transactions";

export const useBalance: Readable<TokenInfoAndBalance> = derived(
  [chainId, signerAddress, provider, resolvedTransactions],
  ([$chainId, $signerAddress, $provider, $rt], set) => {
    if (!$signerAddress || !$provider) {
      set({
        info: {
          name: "Ether Classic",
          icon: "mdi:ethereum",
          address: "0x0",
          symbol: "ETC",
          decimals: 18,
        },
        balance: 0,
      });
    } else {
      $provider?.getBalance($signerAddress).then((res) => {
        set({
          info: {
            name: "Ether Classic",
            icon: "mdi:ethereum",
            address: "0x0",
            symbol: "ETC",
            decimals: 18,
          },
          balance: Number(formatEther(res)),
        });
      });
    }
  }
);
