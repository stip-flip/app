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

export const transactions = derived(
  [chainId, provider, signerAddress],
  ([$chainId, $provider, $signerAddress], set) => {
    function handleFilter() {
      const lastPending =
        get(pendingTransactions).length &&
        get(pendingTransactions)[get(pendingTransactions).length - 1];
      if (lastPending) {
        $provider
          .getTransactionReceipt(lastPending.hash)
          .then((res) => {
            console.log("transaction RES\n", res);
            if (res.confirmations > 0) {
              resolvedTransactions.set([
                ...(get(resolvedTransactions) || []),
                lastPending,
              ]);
              pendingTransactions.set(
                get(pendingTransactions).filter(
                  (pt) => pt.hash != lastPending.hash
                )
              );
            }
          })
          .catch((err) => {
            console.log("transaction failed\n", err);
          });
      }
      // provider($chainId as Network).getTransactionCount($signerAddress);
    }
    $provider?.addListener("block", handleFilter);
  },
  0
);

export const pendingTransactions = writable<{ hash: string; label: string }[]>(
  []
);

export const resolvedTransactions = writable<{ hash: string; label: string }[]>(
  []
);

export const broadcastTransaction = (
  label: string,
  t: Promise<ContractTransaction>
) => {
  t.then((rt) => {
    pendingTransactions.set([
      ...(get(pendingTransactions) || []),
      { hash: rt.hash, label: label },
    ]);
    console.log("pending", rt.hash);
  }).catch((e) => {
    console.log("rejected TX", e);
  });
  return t;
};
