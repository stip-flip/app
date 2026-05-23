import type { providers } from "@0xsequence/multicall";
import type { ContractTransaction } from "ethers";
import { provider, sdk } from "src/stores/eth-sdk";
import { chainId, signerAddress } from "svelte-ethers-store";
import { derived, get, writable } from "svelte/store";

export const transactions = derived(
  [chainId, provider, signerAddress],
  ([$chainId, $provider, $signerAddress], set) => {
    if (!$provider) return;

    function resolvePending(hash: string, status: number) {
      resolveTransaction(hash, status);
    }

    function handleFilter() {
      get(pendingTransactions).forEach((pendingTransaction) => {
        if (pendingTransaction.status !== undefined) return;

        $provider
          .getTransactionReceipt(pendingTransaction.hash)
          .then((receipt) => {
            if (!receipt || receipt.confirmations <= 0) return;

            console.log("transaction RES\n", receipt);
            resolvePending(pendingTransaction.hash, receipt.status || 0);
          })
          .catch((err) => {
            console.log("transaction failed\n", err);
          });
      });
      // provider($chainId as Network).getTransactionCount($signerAddress);
    }

    $provider?.addListener("block", handleFilter);
    handleFilter();

    return () => {
      $provider?.removeListener("block", handleFilter);
    };
  },
  0
);

export const pendingTransactions = writable<
  { hash: string; label: string; status?: number; resolved?: string }[]
>([]);

export const resolvedTransactions = writable<
  { hash: string; label: string; status?: number; resolved?: string }[]
>([]);

export function resolveTransaction(hash: string, status: number) {
  const pending = get(pendingTransactions);
  const transaction = pending.find((pt) => pt.hash == hash);
  if (!transaction) return;

  resolvedTransactions.set([
    ...(get(resolvedTransactions) || []),
    { ...transaction, status },
  ]);
  pendingTransactions.set(
    pending.map((pt) => (pt.hash == hash ? { ...pt, status } : pt))
  );
  setTimeout(() => {
    pendingTransactions.set(
      get(pendingTransactions).filter((pt) => pt.hash != hash)
    );
  }, 5000);
}

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
      // get(sdk).TRADER_PERIPHERY.address,
      provider?.network?.chainId == 63
        ? "0xe22BEF2B1bde5997fAe4b171cC175AE8E812e21E"
        : "0x017dB5e8Cd19d272e3AC16cC4df60619ADb8098A",
      "latest"
    );
    console.log("Transaction Count:", transactionCount);
    totalTraderTransactions.set(transactionCount);
    // Update the total transactions in your store or do any other necessary logic
  } catch (error) {
    console.log("Error:", error);
  }
}

export const totalTraderTransactions = writable<number>(0);

// Call the watchAddress function periodically to keep updating the total transactions
setInterval((_) => watchAddress(get(provider)), 5000);
