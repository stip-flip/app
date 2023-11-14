<script lang="ts">
  import { BigNumber, ethers } from "ethers";
  import { formatEther, formatUnits, parseUnits } from "ethers/lib/utils";
  import _ from "lodash";
  import { validator } from "src/actions/big-number-input";
  import Tokens from "src/components/tokens.svelte";
  import { broadcastTransaction } from "src/hooks/blocknumber";
  import {
    useAllowance,
    useInfoAndBalance,
    type TokenInfoAndBalance,
  } from "src/hooks/erc20";
  import { usePoolInfos } from "src/hooks/pool";
  import { commify } from "src/lib";
  import { MAX_FR, sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";

  let amountOut: string = "0";
  let amountIn: string = "0";
  let leverage: number = 0;

  let selectedToken0: TokenInfoAndBalance;
  let selectedToken1: TokenInfoAndBalance;

  let enter: boolean = true;

  // do we want to trade in advanced mode?
  let advanced: boolean = false;

  $: poolInfos = usePoolInfos();

  $: quoteToken = useInfoAndBalance($sdk.USDC.address);

  $: allowance = useAllowance(
    selectedToken0?.info.address,
    selectedPool?.address || ""
  );

  $: tokenInfosAndBalances = [
    ...($poolInfos || []).map((pi) => pi.token),
    $quoteToken,
  ].filter((t) => !!t);

  $: console.log(tokenInfosAndBalances, $poolInfos);

  $: filteredSelectedToken1 = tokenInfosAndBalances.filter(
    (t: TokenInfoAndBalance) => {
      if (!selectedToken0) return true;
      if (
        selectedToken0?.info.address == $sdk.USDC.address &&
        t.info.address != $sdk.USDC.address
      )
        return true;
      if (
        selectedToken0?.info.address != $sdk.USDC.address &&
        t.info.address == $sdk.USDC.address
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

  $: enter = selectedToken0?.info.address == $sdk.USDC.address;

  $: selectedPool = $poolInfos.find(
    (pi) =>
      pi.address == selectedToken0?.info.address ||
      pi.address == selectedToken1?.info.address
  );
  let feeAmount: BigNumber = BigNumber.from(0);
  let frAfter: BigNumber = BigNumber.from(0);
  let pnl: BigNumber = BigNumber.from(0);

  $: {
    if (selectedToken0 && selectedToken1 && selectedPool) {
      debOut();
    }
  }
  // debounce outgoing amount
  const debOut = _.debounce(async () => {
    if (selectedToken0 && selectedToken1 && selectedPool) {
      // console.log("debounce");
      if (enter) {
        const enter = await $sdk?.POOL.attach(
          selectedPool?.address
        ).previewEnter(
          parseUnits(amountOut, selectedToken0?.info.decimals || 0)
        );
        feeAmount = enter.feeAmount;
        frAfter = enter.frAfter;
        amountIn = formatEther(enter.swapOut.mul(-1));
      } else {
        const exit = await $sdk?.POOL.attach(selectedPool?.address)
          .connect($signerAddress)
          .previewExit(
            parseUnits(amountOut, selectedToken0?.info.decimals || 0)
          );
        feeAmount = exit.feeAmount;
        frAfter = exit.frAfter;
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
        frAfter = enter.frAfter;
        amountOut = formatEther(enter.swapOut);
      } else {
        const exit = await $sdk?.POOL.attach(selectedPool?.address)
          .connect($signerAddress)
          .previewExit(
            parseUnits(amountIn, selectedToken1?.info.decimals || 0).mul(-1)
          );
        feeAmount = exit.feeAmount;
        frAfter = exit.frAfter;
        amountOut = formatEther(exit.swapOut);
      }
    }
  }, 1000);
  $: console.log(amountIn);
</script>

<Tokens
  id="selectedToken0"
  {tokenInfosAndBalances}
  bind:selectedToken={selectedToken0}
/>

<Tokens
  id="selectedToken1"
  tokenInfosAndBalances={filteredSelectedToken1}
  bind:selectedToken={selectedToken1}
/>

<div class="w-1/3 m-auto mt-40 flex justify-between items-center">
  <h1 class="text-3xl">Swap</h1>
</div>
<div class="w-1/3 m-auto mt-4 mb-24 border-2 rounded-lg p-4 bg-gradient">
  <div class="w-full flex space-x-4 mt-8 p-8 bg-slate-200 rounded-3xl">
    <input
      bind:value={amountOut}
      type="text"
      placeholder="Amount to swap"
      class="input input-ghost w-1/2 text-white text-2xl"
      on:validated={(v) => (amountOut = v.detail)}
      on:input={debOut}
      use:validator={{
        value: amountOut,
        max: selectedToken0?.balance || 0,
      }}
    />
    <div class="w-1/2">
      <label for="selectedToken0" tabindex="0" class="w-full btn rounded-full"
        >{selectedToken0 != undefined
          ? selectedToken0?.info.name || "NUSD"
          : "Select a token"}</label
      >
      {#if selectedToken0 != undefined}
        <div
          class="absolute ml-4 text-sm cursor-pointer"
          on:click={(_) => {
            console.log(selectedToken0?.balance);
            amountOut = String(selectedToken0?.balance || 0);
            debOut();
          }}
        >
          Balance: {commify(selectedToken0?.balance)}
        </div>
      {/if}
    </div>
  </div>
  <div class="w-full flex space-x-4 mt-4 p-8 bg-slate-200 rounded-3xl relative">
    <input
      bind:value={amountIn}
      type="text"
      placeholder="Amount to swap"
      class="input input-ghost w-1/2 text-white text-2xl"
      on:validated={(v) => (amountIn = v.detail)}
      on:input={debIn}
      use:validator={{
        value: amountIn,
        max: String(1e18),
      }}
    />
    <div class="dropdown w-1/2">
      <label for="selectedToken1" tabindex="0" class="w-full btn rounded-full"
        >{selectedToken1 != undefined
          ? selectedToken1?.info.name || "NUSD"
          : "Select a token"}</label
      >
    </div>
  </div>
  {#if selectedPool}
    <div class="px-4">
      <div class="flex justify-between my-4 text-lg">
        <strong> Current Price </strong>
        <strong>
          {commify(formatUnits(selectedPool.currentPrice, 6))}
        </strong>
      </div>
      <div class="flex justify-between my-4 text-lg">
        <strong>Funding Rate</strong>
        <strong>
          {#if Number(amountOut)}
            {commify(formatUnits(frAfter, 18 + 2))} %
          {:else}
            {commify(formatUnits(selectedPool.fr, 18 + 2))} %
          {/if}
        </strong>
      </div>
    </div>
    {#if Number(amountOut)}
      <div class="px-4">
        <div class="flex justify-between my-4 text-lg">
          <strong> Fees </strong>
          <strong>
            {commify(
              formatUnits(feeAmount || 0, selectedToken0?.info.decimals || 0)
            )} USDC
          </strong>
        </div>
        {#if !enter && selectedToken0?.info.address && selectedToken1?.info.address}
          <div class="flex justify-between my-4 text-lg">
            <strong> PNL </strong>
            <strong>
              {commify(formatUnits(pnl, selectedToken1?.info.decimals || 18))}
            </strong>
          </div>
        {/if}
      </div>
    {/if}
  {/if}
  {#if enter && selectedToken1}
    <div class="collapse">
      <input type="checkbox" />
      <div class="collapse-title flex flex-col w-full border-opacity-50">
        <div class="divider">Advanced</div>
      </div>
      <!-- <div class=" text-xl font-medium">Advanced</div> -->
      <div class="collapse-content">
        <div class="flex justify-between text-lg">
          <strong> Leverage </strong>
          <strong>
            {leverage}x
          </strong>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          bind:value={leverage}
          on:input={debOut}
          class="range"
          step="2"
        />
        <div class="w-full flex justify-between text-xs px-2">
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
      </div>
    </div>
  {/if}

  <button
    class="btn btn-primary btn-lg w-full mt-8"
    on:click={(_) => {
      if (enter) {
        if ($allowance > Number(amountOut)) {
          broadcastTransaction(
            "Swapping " +
              selectedToken0.info.name +
              " for " +
              selectedToken1.info.name,
            $sdk.POOL.attach(selectedToken1.info.address)
              .connect($signer)
              .enter(
                parseUnits(amountOut, selectedToken0.info.decimals),
                parseUnits(amountOut, selectedToken0.info.decimals).mul(
                  leverage > 1 ? leverage : 1
                ),
                MAX_FR,
                $signerAddress
              )
          );
        } else {
          broadcastTransaction(
            "Increase Allowance",
            $sdk.USDC.connect($signer).approve(
              selectedPool?.address || "",
              ethers.constants.MaxUint256
            )
          );
        }
      } else {
        broadcastTransaction(
          "Swapping " +
            selectedToken0.info.name +
            " for " +
            selectedToken1.info.name,
          $sdk.POOL.attach(selectedToken0.info.address)
            .connect($signer)
            .exit(
              parseUnits(amountOut, selectedToken0.info.decimals),
              $signerAddress,
              { gasLimit: 1000000 }
            )
        );
      }
    }}
    >{!selectedToken1 || $allowance > Number(amountOut)
      ? "Swap"
      : "Approve"}</button
  >
</div>
