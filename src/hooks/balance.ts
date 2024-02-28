import { formatEther } from "ethers/lib/utils";
import { provider } from "src/stores/eth-sdk";
import { chainId, signerAddress } from "svelte-ethers-store";
import { derived, type Readable } from "svelte/store";
import type { TokenInfoAndBalance } from "./erc20";

export const useBalance: Readable<TokenInfoAndBalance> = derived(
  [chainId, signerAddress, provider],
  ([$chainId, $signerAddress, $provider], set) => {
    if (!$signerAddress || !$provider) return;
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
);
