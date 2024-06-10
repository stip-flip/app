<script lang="ts">
  import Icon from "@iconify/svelte";
  import Decimal from "decimal.js";
  import { formatEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import type { UniPositionFragment } from "src/hooks/subgraph";
  import type { PoolInfo } from "src/hooks/uniswap/pool";
  import { commify } from "src/lib";
  import { getSynthAmount, uniRatioToSynthPrice } from "src/lib/sf/math";
  import { getAmountsDelta, isInRange } from "src/lib/uniswap/sqrtPriceMath";
  import { getRatioForTick } from "src/lib/uniswap/tick";
  import Modal from "./_modal.svelte";

  export let positions: UniPositionFragment[];
  export let pool: PoolInfo;

  let selectedPosition: UniPositionFragment | undefined;

  let label: HTMLLabelElement;

  console.log("debug", pool, pool.reversed);
</script>

<Modal {pool} {selectedPosition} />
<label for={pool.address} bind:this={label}></label>
<div class="overflow-x-auto bg-gradient">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="hidden lg:table-cell lg:w-1/4">Min Price</th>
        <th class="hidden lg:table-cell lg:w-1/4">Max Price</th>
        <th class="w-1/3 lg:w-1/4">ETC</th>
        <th class="w-1/3 lg:w-1/4">{pool.synth?.info?.symbol}</th>
        <th class="w-1/3 lg:w-1/4 text-right">In Range</th>
        <!-- <th class="hidden lg-table-cell" /> -->
      </tr>
    </thead>
    <tbody>
      {#each positions as position}
        <tr
          class="hover cursor-pointer"
          on:click={(_) => {
            selectedPosition = position;
            label.click();
          }}
        >
          <td class="table-cell"
            >{commify(
              (getRatioForTick(
                pool.reversed ? -position.tickUpper : position.tickLower
              ) *
                pool.synthPrice) /
                pool.synthRatio,
              4
            )}</td
          >
          <td class="table-cell">
            {commify(
              (getRatioForTick(
                pool.reversed ? -position.tickLower : position.tickUpper
              ) *
                pool.synthPrice) /
                pool.synthRatio,
              4
            )}
          </td>
          <td class="table-cell">
            <div class="flex items-center">
              {commify(
                formatEther(
                  new Decimal(
                    String(
                      getAmountsDelta(
                        getRatioForTick(position.tickLower),
                        getRatioForTick(position.tickUpper),
                        pool.ratio,
                        position.liquidity,
                        false
                      )[pool.synthIndex ? 0 : 1]
                    )
                  ).toFixed()
                ),
                3
              )}
              <Icon icon="mdi:ethereum" class="text-green-600 text-2xl" />
            </div>
          </td>
          <td class="table-cell">
            <div class="flex items-center">
              {commify(
                formatEther(
                  new Decimal(
                    String(
                      Math.round(
                        getSynthAmount(
                          getAmountsDelta(
                            getRatioForTick(position.tickLower),
                            getRatioForTick(position.tickUpper),
                            pool.ratio,
                            position.liquidity,
                            false
                          )[pool.synthIndex ? 1 : 0],
                          pool.synthPrice,
                          pool.synthRatio
                        )
                      )
                    )
                  ).toFixed()
                ),
                3
              )}<CoinIcon symbol={pool.synth?.info?.symbol} className="ml-2" />
            </div>
          </td>
          <td class="table-cell text-right">
            <!-- If in range have a green square -->
            <div
              class="rounded-full w-4 h-4 ml-auto"
              class:bg-success={isInRange(
                pool.tick,
                position.tickLower,
                position.tickUpper
              )}
              class:bg-error={!isInRange(
                pool.tick,
                position.tickLower,
                position.tickUpper
              )}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
