<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatEther, formatUnits } from "ethers/lib/utils";
  import { usdcInfo } from "src/hooks/erc20";
  import { commify, formatAmount } from "src/lib";
  import { sdk } from "src/stores";
  import { signerAddress } from "svelte-ethers-store";
  import Modal from "./_modal.svelte";
  import { BigNumber } from "ethers";

  export let bytes: string[];
  export let poolName: string;
  export let poolAddress: string;
  export let positions: Record<string, any>;

  let selectedPosition: any;
</script>

<Modal {poolAddress} {selectedPosition} />
<div class="overflow-x-auto bg-gradient">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="w-1/3 lg:w-auto">Funding Rate</th>
        <th class="w-1/3 lg:w-auto">Liquidity</th>
        <th class="hidden lg:table-cell">Liquidity Active</th>
        <th class="w-1/3 lg:w-auto">PnL</th>
        <th class="hidden lg-table-cell" />
      </tr>
    </thead>
    <tbody>
      {#each bytes as b}
        <tr class="hover">
          {#await $sdk.POOL.attach(poolAddress).positionPnL(positions[b].tick, $signerAddress) then pnl}
            <td class="w-1/3 lg:w-auto">{positions[b].tick / 100}%</td>
            <td class="w-1/3 lg:w-auto"
              >{commify(
                formatEther(BigNumber.from(positions[b].liquidity).add(pnl)),
                3
              )}
              <Icon
                class="inline text-xl text-green-600"
                icon="mdi:ethereum"
              /></td
            >
            <td class="hidden lg:table-cell"
              >{commify((positions[b].liquidityActive * 100).toFixed(2))} %</td
            >
            <td class="w-1/3 lg:w-auto">
              {commify(formatEther(pnl), 3)}
              <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
            </td>
            <td class="hidden lg:table-cell">
              <label
                for={poolAddress}
                on:click={(_) => {
                  selectedPosition = positions[b];
                }}
              >
                <Icon
                  icon="material-symbols:upload"
                  class="cursor-pointer w-6 h-6"
                />
              </label>
            </td>
          {:catch err}
            <!-- {err} -->
            <!-- {positions[b].tick}
            {$signerAddress} -->
          {/await}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
