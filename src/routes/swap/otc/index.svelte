<script lang="ts">
  import Icon from "@iconify/svelte";
  import { BigNumber } from "ethers";
  import {
    formatEther,
    formatUnits,
    parseEther,
    parseUnits,
  } from "ethers/lib/utils";
  import _ from "lodash";
  import { validator } from "src/actions/big-number-input";
  import { useBalance } from "src/hooks/balance";
  import { broadcastTransaction } from "src/hooks/transactions";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { useBalance as useBal } from "src/hooks/erc20";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { commify, getTimeDifference } from "src/lib";
  import { sdk, timestamp } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";
  import Modal from "../components/_modal.svelte";
  import CoinIcon from "src/components/coin-icon.svelte";

  let amountOut: string;
  let amountIn: string;

  let selectToken: "token0" | "token1";
  let selectedToken0: TokenInfoAndBalance;
  let selectedToken1: TokenInfoAndBalance;

  let enter: boolean = true;

  let automate: boolean = true;

  let checkbox: HTMLInputElement;

  let mode: "OTC" | "MARKET" = "OTC";

  const ZERO_ADDRESS = "0x0";

  $: poolInfos = useSynthInfos;

  $: quoteToken = useBalance;

  $: balance0 = useBal(selectedToken0?.info.address, $signerAddress);

  $: tokenInfosAndBalances = [
    ...($poolInfos || []).map((pi) => pi.token),
    $quoteToken,
  ].filter((t) => !!t);

  $: filteredSelectedToken1 = tokenInfosAndBalances.filter(
    (t: TokenInfoAndBalance) => {
      if (!selectedToken0) return true;
      if (
        selectedToken0?.info.address == ZERO_ADDRESS &&
        t.info.address != ZERO_ADDRESS
      )
        return true;
      if (
        selectedToken0?.info.address != ZERO_ADDRESS &&
        t.info.address == ZERO_ADDRESS
      )
        return true;
    }
  );

  $: {
    if (
      selectedToken0 &&
      selectedToken1 &&
      filteredSelectedToken1.length &&
      !filteredSelectedToken1.some(
        (t) => t?.info?.address == selectedToken1?.info.address
      )
    ) {
      selectedToken1 = undefined;
    }
  }

  $: enter = selectedToken0?.info.address == ZERO_ADDRESS;

  $: selectedPool = $poolInfos.find(
    (pi) =>
      pi.address == selectedToken0?.info.address ||
      pi.address == selectedToken1?.info.address
  );

  let feeAmount: BigNumber = BigNumber.from(0);
  $: frAfter = selectedPool?.tick || 0;
  let pnl: BigNumber = BigNumber.from(0);

  $: {
    if (selectedToken0 && selectedToken1 && selectedPool) {
      debOut();
    }
  }

  $: timeleft = getTimeDifference(
    selectedPool?.settlementTimestamp || 0,
    $timestamp
  );

  const reset = () => {
    amountOut = "0";
    amountIn = "0";
    selectedToken0 = undefined;
    selectedToken1 = undefined;
  };

  // debounce outgoing amount
  const debOut = _.debounce(async () => {
    if (selectedToken0 && selectedToken1 && selectedPool) {
      if (enter) {
        if (amountOut == "0") {
          feeAmount = BigNumber.from(0);

          amountIn = "0";
          return;
        }
        const enter = await $sdk?.POOL.attach(
          selectedPool?.address
        ).previewEnter(
          parseUnits(amountOut, selectedToken0?.info.decimals || 0)
        );
        feeAmount = enter.feeAmount;
        // frAfter = enter.frAfter;
        amountIn = formatEther(enter.swapOut.mul(-1));
      } else {
        if (amountOut == "0") {
          feeAmount = BigNumber.from(0);

          amountIn = "0";
          return;
        }
        const exit = await $sdk?.POOL.attach(selectedPool?.address)
          .connect($signerAddress)
          .previewExit(
            parseUnits(amountOut, selectedToken0?.info.decimals || 0)
          );
        feeAmount = exit.feeAmount;

        amountIn = formatEther(exit.swapOut.mul(-1));
      }
    }
  }, 1000);

  // debounce incoming amount
  const debIn = _.debounce(async () => {
    if (selectedToken0 && selectedToken1 && selectedPool) {
      if (enter) {
        const enter = await $sdk?.POOL.attach(
          selectedPool?.address
        ).previewEnter(
          parseUnits(amountIn, selectedToken1?.info.decimals || 0).mul(-1)
        );
        feeAmount = enter.feeAmount;

        amountOut = formatEther(enter.swapOut);
      } else {
        const exit = await $sdk?.POOL.attach(selectedPool?.address)
          .connect($signerAddress)
          .previewExit(
            parseUnits(amountIn, selectedToken1?.info.decimals || 0).mul(-1)
          );
        feeAmount = exit.feeAmount;

        amountOut = formatEther(exit.swapOut);
      }
    }
  }, 1000);
</script>

<Modal
  id="selectToken"
  otherTokenSelected={selectToken == "token0" ? selectedToken1 : selectedToken0}
  tokenInfosAndBalances={selectToken == "token0"
    ? tokenInfosAndBalances
    : filteredSelectedToken1}
  bind:selectToken
  bind:selectedToken0
  bind:selectedToken1
  bind:checkbox
/>

<div
  class="lg:w-1/3 m-auto mt-4 mb-24 lg:border-2 lg:border-primary rounded-lg p-4 lg:bg-gradient"
>
  <div
    class="w-full flex space-x-4 mt-8 p-8 bg-slate-200 rounded-3xl shadow-lg"
  >
    <input
      bind:value={amountOut}
      type="text"
      placeholder="0"
      class="input input-ghost w-1/2 text-white text-2xl"
      class:input-error={Number(amountOut) > $balance0}
      on:validated={(v) => (amountOut = v.detail)}
      on:input={debOut}
      use:validator={{
        value: amountOut,
        max: $balance0 || 0,
      }}
    />
    <div class="w-1/2">
      <label
        for="selectToken"
        tabindex="0"
        id="token0"
        class="w-full btn rounded-full shadow-lg"
        on:click={(_) => {
          selectToken = "token0";
        }}
      >
        {#if selectedToken0 != undefined}
          <div class="flex space-x-2 items-center">
            <CoinIcon symbol={selectedToken0?.info?.symbol} />
            <span>{selectedToken0?.info.symbol}</span>
          </div>
        {:else}
          Sell token
        {/if}
      </label>
      {#if selectedToken0 != undefined}
        <div
          class="absolute ml-4 text-sm text-neutral cursor-pointer"
          on:click={(_) => {
            amountOut = String($balance0 || 0);
            debOut();
          }}
        >
          Balance: {commify($balance0, 4)}
        </div>
      {/if}
    </div>
  </div>
  <div class="w-full flex justify-center h-0">
    <span
      class="z-10"
      on:click={(_) => {
        [selectedToken0, selectedToken1] = [selectedToken1, selectedToken0];
        [amountIn, amountOut] = [amountOut, amountIn];
        debOut();
      }}
    >
      <Icon
        class="text-4xl text-primary bg-slate-200 -mt-2 cursor-pointer"
        icon="mdi:swap-vertical"
      />
    </span>
  </div>
  <div
    class="w-full flex space-x-4 mt-4 p-8 bg-slate-200 rounded-3xl relative shadow-lg"
  >
    <input
      bind:value={amountIn}
      type="text"
      placeholder="0"
      class="input input-ghost w-1/2 text-white text-2xl"
      on:validated={(v) => (amountIn = v.detail)}
      on:input={debIn}
      use:validator={{
        value: amountIn,
        max: String(1e18),
      }}
    />
    <div class="dropdown w-1/2">
      <label
        for="selectToken"
        tabindex="0"
        class="w-full btn rounded-full shadow-lg"
        on:click={(_) => {
          selectToken = "token1";
        }}
        >{#if selectedToken1 != undefined}
          <div class="flex space-x-2 items-center">
            <CoinIcon symbol={selectedToken1?.info?.symbol} />
            <span>{selectedToken1?.info.symbol}</span>
          </div>
        {:else}
          Buy token
        {/if}</label
      >
    </div>
  </div>
  {#if selectedPool}
    <div class="px-4">
      <div id="current-price" class="flex justify-between my-4 text-lg">
        <strong> Current Price </strong>
        <strong>
          {commify(
            formatUnits(selectedPool.currentPrice, selectedPool.oracleDecimals)
          )}
          <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
        </strong>
      </div>
      <div id="funding-rate" class="flex justify-between my-4 text-lg">
        <strong>Funding Rate</strong>
        <strong>
          {commify(formatUnits(selectedPool.tick, 2))} %
        </strong>
      </div>
      <div id="settlement" class="flex justify-between my-4 text-lg">
        <strong>Next Settlement</strong>
        <strong> {timeleft} </strong>
      </div>
    </div>
    {#if Number(amountOut)}
      <div class="px-4">
        <div class="flex justify-between my-4 text-lg">
          <strong> Fees </strong>
          <strong>
            {commify(
              formatUnits(feeAmount || 0, selectedToken0?.info.decimals || 0),
              4
            )}
            <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
          </strong>
        </div>
      </div>
    {/if}
    <div class="divider" />
    <div id="automate" class="flex justify-between my-4 px-4 text-lg">
      <strong>Automate Claim</strong>
      <input
        type="checkbox"
        class="toggle toggle-primary"
        bind:checked={automate}
      />
    </div>
  {/if}

  <button
    id="swap"
    class="btn btn-primary btn-lg w-full mt-8"
    on:click={(_) => {
      if (!selectedToken0 || !selectedToken1) checkbox.click();
      if (Number(amountOut) > $balance0) return;
      if (enter) {
        broadcastTransaction(
          "Swapping " +
            selectedToken0.info.symbol +
            " for " +
            selectedToken1.info.symbol,
          $sdk.POOL.attach(selectedToken1.info.address)
            .connect($signer)
            .enter(automate ? $sdk.TRADER_PERIPHERY.address : $signerAddress, {
              value: parseEther(amountOut),
            }),
          "Swap Successful 🎉 check your <a class='text-primary' href='/wallet'>wallet</a>"
        );
      } else {
        broadcastTransaction(
          "Swapping " +
            selectedToken0.info.symbol +
            " for " +
            selectedToken1.info.symbol,
          $sdk.POOL.attach(selectedToken0.info.address)
            .connect($signer)
            .exit(
              parseUnits(
                amountOut == String($balance0) ? "0" : amountOut, // if amountOut is max, set to 0
                selectedToken0.info.decimals
              ),
              automate ? $sdk.TRADER_PERIPHERY.address : $signerAddress
            ),
          "Swap Successful 🎉 check your <a class='text-primary' href='/wallet'>wallet</a>"
        );
      }
    }}
  >
    {#if selectedToken0 && selectedToken1}
      Swap <CoinIcon symbol={selectedToken0.info.symbol} />for <CoinIcon
        symbol={selectedToken1.info.symbol}
      />
    {:else if Number(amountOut) > $balance0}
      Insufficient balance
    {:else}
      Select tokens
    {/if}
  </button>
</div>
