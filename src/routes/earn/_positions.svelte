<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatEther } from "ethers/lib/utils";
  import { commify } from "src/lib";
  import Modal from "./_modal.svelte";
  import type { Position } from "src/hooks/pool";

  export let bytes: string[];
  export let poolName: string;
  export let poolAddress: string;
  export let positions: Record<string, Position>;

  let selectedPosition: any;
  $: console.log(positions);
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
      {#each bytes.sort( (a, b) => (positions[b].tick < positions[a].tick ? 0 : -1) ) as b}
        <tr class="hover">
          <td class="w-1/3 lg:w-auto">{positions[b].tick / 100}%</td>
          <td class="w-1/3 lg:w-auto lg:flex items-center">
            <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
            {commify(formatEther(positions[b].liquidity), 3)}
          </td>
          <td class="hidden lg:table-cell">
            <div
              class="rounded-full w-full border border-primary relative"
              class:border-warning={positions[b].liquidityActive < 0.1}
            >
              <div
                class="bg-primary rounded-full whitespace-nowrap"
                class:text-black={positions[b].liquidityActive > 0.5}
                style={`width: ${positions[b].liquidityActive * 100}%`}
              >
                <span class="pl-2"
                  >{commify(
                    (positions[b].liquidityActive * 100).toFixed(2)
                  )}</span
                > %
              </div>
            </div>
          </td>
          <td class="w-1/3 lg:w-auto lg:flex items-center">
            <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
            {commify(formatEther(positions[b].pnl), 3)}
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
        </tr>
      {/each}
    </tbody>
  </table>
</div>
