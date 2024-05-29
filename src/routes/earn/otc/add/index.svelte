<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { parseEther } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";
  import LiquidityChart from "src/components/liquidity-chart.svelte";
  import { useBalance } from "src/hooks/balance";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signer } from "svelte-ethers-store";
  import Modal from "../../_modal.svelte";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { navigate } from "src/lib/path";

  let amount: string;

  let selectedToken: TokenInfoAndBalance;

  $: pi = useSynthInfos;
  $: selectedPool = $pi?.find((p) => p.address == selectedToken?.info?.address);

  $: url = new URL($page.url);

  let FR = 500;
  // fr is actually a tick here
  function formatFR(fr: number) {
    return Number(fr.toFixed(1)) / 100;
  }
</script>

<Modal
  id="position-modal"
  bind:selectedToken
  tokenInfosAndBalances={$pi.map((p) => p.token) || []}
/>

<div
  class="lg:border-2 rounded-lg p-4 bg-transparent lg:w-1/2 m-auto bg-gradient"
>
  <div
    class="flex justify-between items-center p-4 pb-8 border-b border-base-content"
  >
    <a class="w-1/3" href={navigate("/earn", url)}>
      <Icon icon="ph-arrow-left-bold" class="text-2xl" />
    </a>
    <h1 class="text-xl w-1/3 text-center font-semibold">New Position</h1>
    <div class="w-1/3" />
  </div>
  <div class="p-4">
    <div class="lg:flex lg:space-x-4">
      <div class="lg:w-1/2">
        <label class="label">
          <span class="label-text font-semibold mx-2 text-base"
            >Lend liquidity to</span
          >
        </label>
        <label
          for="position-modal"
          class="btn btn-outline w-full border border-current"
          class:btn-outline={selectedPool != undefined}
          >{selectedPool?.token?.info?.name || "--"}</label
        >
      </div>
      <div class="form-control lg:w-1/2">
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
              max: $useBalance?.balance,
            }}
          />
          <span class="w-24 text-center flex items-center"
            ><Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
            ETC</span
          >
        </label>
        <div
          class="text-right px-4 cursor-pointer"
          on:click={(_) => (amount = String($useBalance?.balance))}
        >
          <span class="text-xs text-gray-400">Balance: </span>
          <span class="text-xs">{commify($useBalance?.balance)}</span>
        </div>
      </div>
    </div>
    <div class="border-b w-full border-base-content hidden lg:block mt-4" />
    <div class="">
      <!-- <div class="border-b w-full my-4 border-base-content" /> -->
      <div class="text-center text-lg mt-4 font-semibold">
        Your liquidity will be active from
      </div>
      <div class="">
        <div
          class="lg:w-1/2 m-auto border-2 rounded-3xl flex justify-between items-center p-2 mt-8 border-base-content"
        >
          <div class="p-2 text-xl cursor-pointer" on:click={(_) => (FR -= 10)}>
            <Icon icon="ic:baseline-minus" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex-grow h-8 text-center">Activation Rate</div>
            <input
              class="text-lg font-semibold flex-grow text-center h-8 bg-transparent appearance-none"
              value={formatFR(FR)}
              on:change={(e) => (FR = Number(e.currentTarget.value) * 100)}
              type="number"
              step="0.1"
              min="0"
              max="640"
            />

            <div class="flex-grow h-8 text-center items-end mt-1">% / Year</div>
          </div>
          <div class="p-2 text-xl cursor-pointer" on:click={(_) => (FR += 10)}>
            <Icon icon="material-symbols:add" />
          </div>
        </div>
      </div>
      <div class="text-center text-lg mt-4 font-semibold">And Upward</div>
    </div>
    <div class="border-b w-full my-4 border-base-content" />
    {#if selectedPool}
      <LiquidityChart
        initializedTicks={selectedPool.ticks}
        bind:FR
        className="!h-40"
      />
    {:else}
      <div class="text-center h-24">
        <h1 class="pt-8">Your position will appear here</h1>
        <Icon icon="octicon:inbox-24" class="text-4xl m-auto" />
      </div>
    {/if}
    <button
      class="btn btn-primary w-full mt-8"
      disabled={!selectedPool || !amount}
      on:click={(_) => {
        broadcastTransaction(
          `Depositing liquidities to ${selectedPool?.token?.info?.symbol}`,
          $sdk.POOL.attach(selectedPool?.address || "")
            .connect($signer)
            .mint(FR, $sdk.TRADER_PERIPHERY.address, {
              value: parseEther(amount),
            })
        );
      }}>Add Liquidity</button
    >
  </div>
</div>

<style>
  :global(input[type="number"]::-webkit-inner-spin-button),
  :global(input[type="number"]::-webkit-outer-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
