import type { providers } from "@0xsequence/multicall";
import type { ContractTransaction } from "ethers";
import { provider, sdk } from "src/stores/eth-sdk";
import { chainId, signerAddress } from "svelte-ethers-store";
import { derived, get, writable } from "svelte/store";

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
                { ...lastPending, status: res.status },
              ]);
              pendingTransactions.set([
                ...get(pendingTransactions).filter(
                  (pt) => pt.hash != lastPending.hash
                ),
                { ...lastPending, status: res.status },
              ]);
              setTimeout(() => {
                pendingTransactions.set(
                  get(pendingTransactions).filter(
                    (pt) => pt.hash != lastPending.hash
                  )
                );
              }, 5000);
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

export const pendingTransactions = writable<
  { hash: string; label: string; status?: number; resolved?: string }[]
>([]);

export const resolvedTransactions = writable<
  { hash: string; label: string; status?: number; resolved?: string }[]
>([]);

export const broadcastTransaction = (
  label: string,
  t: Promise<ContractTransaction>,
  resolved?: string
) => {
  t.then((rt) => {
    pendingTransactions.set([
      ...(get(pendingTransactions) || []),
      { hash: rt.hash, label: label, resolved },
    ]);
    console.log("pending", rt.hash);
  }).catch((e) => {
    console.log("rejected TX", e);
  });
  return t;
};

// Function to watch the address and update the total transactions
async function watchAddress(provider: providers.MulticallProvider) {
  // check if we are on the server
  if (typeof window === "undefined") return;
  try {
    const transactionCount = await provider?.getTransactionCount(
      get(sdk).TRADER_PERIPHERY.address,
      "latest"
    );
    totalTraderTransactions.set(transactionCount);
    // Update the total transactions in your store or do any other necessary logic
  } catch (error) {
    console.log("Error:", error);
  }
}

export const totalTraderTransactions = writable<number>(0);

// Call the watchAddress function periodically to keep updating the total transactions
setInterval((_) => watchAddress(get(provider)), 5000);
