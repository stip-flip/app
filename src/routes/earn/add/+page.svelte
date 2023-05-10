<script lang="ts">
  import Icon from "@iconify/svelte";
  import { parseUnits } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";
  import LiquidityChart from "src/components/liquidity-chart.svelte";
  import { broadcastTransaction } from "src/hooks/blocknumber";
  import {
    increaseAllowance,
    usdcBalance,
    usdcInfo,
    useAllowance,
    type TokenInfo,
  } from "src/hooks/erc20";
  import { usePoolInfos, type PoolInfo } from "src/hooks/pool";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";

  let amount: string;

  let selectedPool: PoolInfo;

  $: pi = usePoolInfos();

  $: usdcAllowance = useAllowance($sdk.USDC.address, selectedPool?.address);

  let lowerFR = -500;
  let upperFR = 500;

  function formatFR(fr: number) {
    return fr / 1000;
  }
</script>

<div
  class="border-2 rounded-lg p-4 bg-transparent w-1/2 m-auto mt-40 bg-gradient"
>
  <div
    class="flex justify-between items-center p-4 border-b border-base-content"
  >
    <a class="w-1/3" href="/earn">
      <Icon icon="ph-arrow-left-bold" class="text-2xl" />
    </a>
    <h1 class="text-lg w-1/3 text-center font-semibold">Add Liquidity</h1>
    <div class="w-1/3" />
  </div>
  <div class="flex justify-between items-stretch p-4 space-x-4">
    <div class="w-1/2 flex flex-col justify-between">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-semibold mx-2 text-base"
            >Deposit amount</span
          >
        </label>
        <label class="input-group">
          <input
            bind:value={amount}
            type="text"
            placeholder="Your amount here"
            class="input input-bordered w-full max-w-xs"
            on:validated={(v) => (amount = v.detail)}
            use:validator={{
              value: amount,
              max: $usdcBalance,
            }}
          />
          <span>USDC</span>
        </label>
      </div>
      <div class="border-b w-full border-base-content" />
      <div>
        <div class="dropdown w-full">
          <label
            tabindex="0"
            class="btn w-full"
            class:btn-outline={selectedPool != undefined}
            >{selectedPool != undefined
              ? selectedPool?.token?.info?.name
              : "Select an exposure"}</label
          >
          <ul
            tabindex="0"
            class="dropdown-content menu shadow bg-base-100 rounded-box w-full"
          >
            {#each $pi || [] as p}
              <li>
                <a on:click={(_) => (selectedPool = p)}>{p.token?.info?.name}</a
                >
              </li>
            {/each}
            <!-- <li><a on:click={(_) => (exposure = 2)}>Neutral</a></li> -->
          </ul>
        </div>
      </div>
      <div class="border-b w-full border-base-content" />
      {#if $usdcAllowance >= Number(amount)}
        <button
          class="btn btn-primary w-full"
          disabled={!selectedPool || !amount}
          on:click={(_) => {
            broadcastTransaction(
              "Minting liquidity tokens",
              $sdk.POOL.attach(selectedPool.address)
                .connect($signer)
                .mint(
                  $signerAddress,
                  lowerFR,
                  upperFR,
                  parseUnits(amount, $usdcInfo.decimals)
                )
            );
          }}>Add Liquidity</button
        >
      {:else}
        <button
          class="btn btn-primary w-full"
          disabled={!selectedPool || !amount}
          on:click={(_) => {
            increaseAllowance($sdk.USDC.address, selectedPool.address);
          }}>Approve USDC</button
        >
      {/if}
    </div>
    <div class="w-1/2">
      {#if selectedPool}
        <LiquidityChart
          initializedTicks={selectedPool.ticks}
          bind:lowerFR
          bind:upperFR
        />
      {:else}
        <div class="text-center h-24">
          <h1 class="pt-8">Your position will appear here</h1>
          <Icon icon="octicon:inbox-24" class="text-4xl m-auto" />
        </div>
      {/if}
      <div class="border-b w-full my-4 border-base-content" />
      <div class="text-center text-lg mt-4 font-semibold">
        Your liquidity will be active from
      </div>
      <div class="flex space-x-4">
        <div
          class="w-1/2 border-2 rounded-3xl space-x-4 flex justify-between items-center p-2 mt-8 border-base-content"
        >
          <div
            class="p-2 text-xl cursor-pointer"
            on:click={(_) => (lowerFR -= 10)}
          >
            <Icon icon="ic:baseline-minus" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="text-xs flex-grow h-8">Lower FR</div>
            <div class="text-lg font-semibold flex-grow text-center h-8">
              {formatFR(lowerFR)}
            </div>
            <div class="flex-grow h-8" />
          </div>
          <div
            class="p-2 text-xl cursor-pointer"
            on:click={(_) =>
              (lowerFR = lowerFR < upperFR - 10 ? lowerFR + 10 : lowerFR)}
          >
            <Icon icon="material-symbols:add" />
          </div>
        </div>
        <div
          class="w-1/2 border-2 rounded-3xl space-x-4 flex justify-between items-center p-2 mt-8 border-base-content"
        >
          <div
            class="p-2 text-xl cursor-pointer"
            on:click={(_) =>
              (upperFR = upperFR > lowerFR + 10 ? upperFR - 10 : upperFR)}
          >
            <Icon icon="ic:baseline-minus" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="text-xs flex-grow h-8">Upper FR</div>
            <div class="text-lg font-semibold flex-grow text-center h-8">
              {formatFR(upperFR)}
            </div>
            <div class="flex-grow h-8" />
          </div>
          <div
            class="p-2 text-xl cursor-pointer"
            on:click={(_) => (upperFR += 10)}
          >
            <Icon icon="material-symbols:add" />
          </div>
        </div>
      </div>
      <div class="text-center text-lg mt-4 font-semibold">And Upward</div>
    </div>
  </div>
</div>
