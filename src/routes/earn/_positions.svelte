<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatUnits, parseUnits } from "ethers/lib/utils";
  import { usdcInfo } from "src/hooks/erc20";
  import { commify, formatAmount } from "src/lib";
  import { sdk } from "src/stores";
  import { validator } from "src/actions/big-number-input";
  import { signer, signerAddress } from "svelte-ethers-store";
  import { broadcastTransaction } from "src/hooks/blocknumber";

  export let bytes: string[];
  export let poolName: string;
  export let poolAddress: string;
  export let positions: Record<string, any>;

  let withdrawAmount: string;
  let selectedPosition: any;
</script>

<!-- Put this part before </body> tag -->
<input type="checkbox" id={poolAddress} class="modal-toggle" />
<label for={poolAddress} class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-2xl text-center pb-4">Burn and Collect</h3>
    <div class="border-b" />
    <label class="input-group w-full p-4">
      <input
        bind:value={withdrawAmount}
        type="text"
        placeholder="Liquidity to withdraw"
        class="input input-bordered w-full"
        on:validated={(v) => (withdrawAmount = v.detail)}
        use:validator={{
          value: withdrawAmount,
          max: Number(
            formatAmount(selectedPosition?.liquidity, $usdcInfo?.decimals || 18)
          ),
        }}
      />
      <span class="w-24 text-center">USDC</span>
    </label>
    <div
      class="cursor-pointer ml-6 -mt-4"
      on:click={(_) =>
        (withdrawAmount = String(
          formatAmount(selectedPosition?.liquidity, $usdcInfo?.decimals || 18)
        ))}
    >
      Max: {commify(
        formatAmount(selectedPosition?.liquidity, $usdcInfo?.decimals || 18)
      )}
    </div>
    <div class="m-4 mx-12 p-2 font-light bg-blend-lighten rounded-lg">
      Fees accumulated:
      {#await $sdk.POOL.attach(poolAddress).positionPnL(selectedPosition?.tickLower, selectedPosition?.tickUpper, $signerAddress) then pnl}
        {commify(formatUnits(pnl, $usdcInfo?.decimals || 18))}
        <br />
        Total: {commify(
          Number(withdrawAmount) +
            Number(formatUnits(pnl, $usdcInfo?.decimals || 18))
        )}
      {/await}
    </div>
    <div class="border-b" />
    <div class="text-right pt-8">
      <button
        class="btn btn-primary w-full"
        on:click={(_) =>
          broadcastTransaction(
            "Burn and Collect",
            $sdk.POOL.attach(poolAddress)
              .connect($signer)
              .burnAndCollect(
                $signerAddress,
                selectedPosition?.tickLower,
                selectedPosition?.tickUpper,
                parseUnits(withdrawAmount, $usdcInfo?.decimals || 18)
              )
          )}
      >
        Collect
      </button>
    </div>
  </label>
</label>
<div class="overflow-x-auto">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th>FR Range</th>
        <th>Liquidity</th>
        <th>Liquidity Active</th>
        <th>Fees accumulated</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {#each bytes as b}
        <tr class="hover">
          <td
            >{positions[b].tickLower / 1000} to {positions[b].tickUpper /
              1000}%</td
          >
          <td
            >{formatAmount(
              positions[b].liquidity,
              $usdcInfo?.decimals || 18
            )}</td
          >
          <td>{commify((positions[b].liquidityActive * 100).toFixed(2))} %</td>
          <td>
            {#await $sdk.POOL.attach(poolAddress).positionPnL(positions[b].tickLower, positions[b].tickUpper, $signerAddress) then pnl}
              {commify(formatUnits(pnl, $usdcInfo?.decimals || 18))}
            {/await}
          </td>
          <td>
            <label
              for={poolAddress}
              on:click={(_) => (selectedPosition = positions[b])}
            >
              <Icon
                icon="material-symbols:upload"
                class="cursor-pointer w-6 h-6"
              />
            </label>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
