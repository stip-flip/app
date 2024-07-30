<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatEther, parseEther } from "ethers/lib/utils";
  import { commify } from "src/lib";
  import Modal from "./_modal.svelte";
  import type { Position } from "src/hooks/sf/position";
  import { BigNumber } from "ethers";

  export let bytes: string[];
  export let poolName: string;
  export let poolAddress: string;
  export let positions: Record<string, Position>;
  let open: boolean = false;

  let selectedPosition: any;
  let label: HTMLLabelElement;
  $: console.log(positions);
</script>

<Modal {poolAddress} {poolName} {selectedPosition} bind:open />
<label for={poolAddress} bind:this={label} class="lg:block hidden"></label>
<div class="overflow-x-auto lg:bg-gradient">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="w-1/3 lg:w-1/4">Activation Rate</th>
        <th class="w-1/3 lg:w-1/4">Liquidity</th>
        <th class="hidden lg:table-cell lg:w-1/4">Liquidity Active</th>
        <th class="w-1/3 lg:w-1/4 text-right">PnL</th>
        <!-- <th class="hidden lg-table-cell" /> -->
      </tr>
    </thead>
    <tbody>
      {#each bytes.sort( (a, b) => (positions[b].tick < positions[a].tick ? 0 : -1) ) as b}
        <tr
          class="hover cursor-pointer"
          on:click={(_) => {
            selectedPosition = positions[b];
            label.click();
            open = true;
          }}
        >
          <td class="w-1/3 lg:w-auto">{positions[b].tick / 100}%</td>
          <td class="w-1/3 lg:w-auto lg:flex items-center hidden">
            <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
            {commify(formatEther(positions[b].liquidity), 3)}
          </td>
          <td class="lg:hidden table-cell">
            <div
              class="rounded-full w-full border border-primary bg-primary relative overflow-hidden bg-opacity-40"
              class:border-warning={positions[b].liquidityActive < 0.1}
              class:bg-warning={positions[b].liquidityActive < 0.1}
            >
              <div
                class="bg-primary whitespace-nowrap text-base-300"
                class:bg-warning={positions[b].liquidityActive < 0.1}
                class:text-accent={positions[b].liquidityActive > 0.5}
                style={`width: ${positions[b].liquidityActive * 100}%`}
              >
                <span class="pl-2"
                  >{commify(formatEther(positions[b].liquidity), 3)}</span
                >
              </div>
            </div>
          </td>
          <td class="hidden lg:table-cell">
            <div
              class="rounded-full w-full border border-primary bg-primary relative overflow-hidden bg-opacity-40"
              class:border-warning={positions[b].liquidityActive < 0.1}
              class:bg-warning={positions[b].liquidityActive < 0.1}
            >
              <div
                class="bg-primary whitespace-nowrap text-base-300"
                class:bg-warning={positions[b].liquidityActive < 0.1}
                class:text-accent={positions[b].liquidityActive > 0.5}
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
          <td class="w-1/3 lg:w-auto lg:flex items-end justify-end text-right">
            <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
            {commify(formatEther(positions[b].pnl), 3)}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
