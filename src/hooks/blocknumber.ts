import { derived, get, writable, type Readable } from "svelte/store";
import { chainId, signerAddress } from "svelte-ethers-store";
import type { ContractTransaction } from "ethers";
import { provider } from "src/stores";

export const useBlockNumber = (defaultChainId?: number): Readable<number> => {
  const result = derived(
    [chainId, provider],
    ([$chainId, $provider], set) => {
      $provider.getBlockNumber().then((res: any) => set(res));
    },
    0
  );
  const blockNumber = derived(
    [chainId, provider, result],
    ([$chainId, $provider, $result], set) => {
      set($result as number);
      function handleNewBlock(block: number) {
        set(block);
      }
      $provider?.addListener("block", handleNewBlock);
      return function () {
        $provider?.removeListener("block", handleNewBlock);
      };
    },
    0
  );
  return blockNumber;
};

export const bn = derived(
  [chainId, provider],
  ([$chainId, $provider], set) => {
    // set($result.data as number);
    function handleNewBlock(block: number) {
      set(block);
    }
    $provider?.addListener("block", handleNewBlock);
    return function () {
      $provider?.removeListener("block", handleNewBlock);
    };
  },
  0
);
