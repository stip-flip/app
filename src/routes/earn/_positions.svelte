<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatUnits } from "ethers/lib/utils";
  import { usdcInfo } from "src/hooks/erc20";
  import { commify, formatAmount } from "src/lib";
  import { sdk } from "src/stores";
  import { signerAddress } from "svelte-ethers-store";
  import Modal from "./_modal.svelte";

  export let bytes: string[];
  export let poolName: string;
  export let poolAddress: string;
  export let positions: Record<string, any>;

  let selectedPosition: any;
</script>

<Modal {poolAddress} {selectedPosition} />
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
            >{positions[b].tickLower / 100} to {positions[b].tickUpper /
              100}%</td
          >
          <td
            >{formatAmount(positions[b].liquidity, $usdcInfo?.decimals || 18)} USDC</td
          >
          <td>{commify((positions[b].liquidityActive * 100).toFixed(2))} %</td>
          <td>
            {#await $sdk.POOL.attach(poolAddress).positionPnL(positions[b].tickLower, positions[b].tickUpper, $signerAddress) then pnl}
              {commify(formatUnits(pnl, $usdcInfo?.decimals || 18))} USDC
            {:catch err}
              {positions[b].tickLower}
              {positions[b].tickUpper}
              {$signerAddress}
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
