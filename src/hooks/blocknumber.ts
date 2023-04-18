import { derived, get, writable, type Readable } from "svelte/store";
import { chainId, signerAddress } from "svelte-ethers-store";
import { provider, type Network } from "src/stores/provider";
import type { ContractTransaction } from "ethers";

export const useBlockNumber = (defaultChainId?: number): Readable<number> => {
  const result = derived(
    [chainId],
    ([$chainId], set) => {
      provider($chainId as Network)
        .getBlockNumber()
        .then((res: any) => set(res));
    },
    0
  );
  const blockNumber = derived(
    [chainId, result],
    ([$chainId, $result], set) => {
      set($result as number);
      function handleNewBlock(block: number) {
        set(block);
      }
      provider($chainId as Network, defaultChainId as Network).addListener(
        "block",
        handleNewBlock
      );
      return function () {
        provider($chainId as Network, defaultChainId as Network).removeListener(
          "block",
          handleNewBlock
        );
      };
    },
    0
  );
  return blockNumber;
};

export const bn = derived(
  [chainId],
  ([$chainId], set) => {
    // set($result.data as number);
    function handleNewBlock(block: number) {
      set(block);
    }
    provider($chainId as Network)?.addListener("block", handleNewBlock);
    return function () {
      provider($chainId as Network).removeListener("block", handleNewBlock);
    };
  },
  0
);

export const transactions = derived(
  [chainId, signerAddress],
  ([$chainId, $signerAddress], set) => {
    function handleFilter() {
      const lastPending =
        get(pendingTransactions).length &&
        get(pendingTransactions)[get(pendingTransactions).length - 1];
      if (lastPending) {
        provider($chainId as Network)
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
    provider($chainId as Network)?.addListener("block", handleFilter);
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
