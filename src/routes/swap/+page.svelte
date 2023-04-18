<script lang="ts">
  import { BigNumber } from "ethers";
  import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
  import _ from "lodash";
  import { validator } from "src/actions/big-number-input";
  import Tokens from "src/components/tokens.svelte";
  import { broadcastTransaction } from "src/hooks/blocknumber";
  import { useInfoAndBalance, type TokenInfoAndBalance } from "src/hooks/erc20";
  import { usePoolInfos } from "src/hooks/pool";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";

  let amount: string = "0";
  let leverage: number = 0;

  let selectedToken0: TokenInfoAndBalance;
  let selectedToken1: TokenInfoAndBalance;

  let enter: boolean = true;

  $: poolInfos = usePoolInfos();

  $: quoteToken = useInfoAndBalance($sdk.USDC.address);

  $: tokenInfosAndBalances = [
    ...($poolInfos || []).map((pi) => pi.token),
    $quoteToken,
  ].filter((t) => !!t);

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
  let liquidityMoved: BigNumber = BigNumber.from(0);
  let feeAmount: BigNumber = BigNumber.from(0);
  let frAfter: BigNumber = BigNumber.from(0);
  const deb = _.debounce(async () => {
    if (selectedToken0 && selectedToken1 && selectedPool) {
      console.log("debounce");
      if (enter) {
        const enter = await $sdk?.POOL.attach(
          selectedPool?.address
        ).previewEnter(
          parseUnits(amount, selectedToken0?.info.decimals || 0),
          parseUnits(
            String(Number(amount) * (leverage > 1 ? leverage : 1)),
            selectedToken0?.info.decimals || 0
          ),
          parseUnits("887000", 9)
        );
        liquidityMoved = enter.liquidityMoved;
        feeAmount = enter.feeAmount;
        frAfter = enter.frAfter;
      } else {
        const exit = await $sdk?.POOL.attach(selectedPool?.address).previewExit(
          parseUnits(amount, selectedToken0?.info.decimals || 0)
        );
        liquidityMoved = exit.liquidityMoved;
        feeAmount = exit.feeAmount;
        frAfter = exit.frAfter;
      }
    }
  }, 1000);
  $: console.log(feeAmount);
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

<div class="w-1/3 m-auto mt-32 border-2 rounded-lg p-4">
  <div class="flex justify-between items-center">
    <h1 class="text-3xl">Swap</h1>
  </div>
  <div class="w-full flex space-x-4 mt-8 p-8 bg-slate-200 rounded-3xl">
    <input
      bind:value={amount}
      type="text"
      placeholder="Amount to swap"
      class="input input-ghost w-1/2 text-white text-2xl"
      on:validated={(v) => (amount = v.detail)}
      on:input={deb}
      use:validator={{
        value: amount,
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
          on:click={(_) => (amount = String(selectedToken0?.balance || 0))}
        >
          Balance: {commify(selectedToken0?.balance.toFixed(2))}
        </div>
      {/if}
    </div>
  </div>
  <div class="w-full flex space-x-4 mt-4 p-8 bg-slate-200 rounded-3xl relative">
    <input
      value={amount}
      type="text"
      placeholder="Amount to swap"
      class="input input-ghost w-1/2 text-white text-2xl"
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
    <div>
      <div class="flex justify-between my-4 text-lg">
        <strong> Price </strong>
        <strong>
          {commify(formatUnits(selectedPool.lastPrice, 8))}
        </strong>
      </div>
      <div class="flex justify-between my-4 text-lg">
        <strong> Funding Rate </strong>
        <strong>
          {commify(formatUnits(selectedPool.slot0.fr, 9 + 3))} %
        </strong>
      </div>
    </div>
    {#if amount != "0"}
      <div class="border-b border-slate-200 mt-8" />
      <div class="flex justify-between my-4 text-lg">
        <strong> Fee </strong>
        <strong>
          {commify(formatUnits(feeAmount, selectedToken0?.info.decimals || 0))}
        </strong>
      </div>
      <div class="flex justify-between my-4 text-lg">
        <strong> Liquidity Moved </strong>
        <strong>
          {commify(
            formatUnits(liquidityMoved, selectedToken0?.info.decimals || 0)
          )}
        </strong>
      </div>
      <div class="flex justify-between my-4 text-lg">
        <strong> FR After </strong>
        <strong>
          {commify(formatUnits(frAfter, 9 + 3))} %
        </strong>
      </div>
    {/if}
  {/if}
  {#if enter}
    <div class="border-b border-slate-200 mt-8" />
    <div class="flex justify-between my-4 text-lg">
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
  {/if}

  <button
    class="btn-lg btn-primary w-full mt-8 rounded-full"
    disabled={!selectedToken1}
    on:click={(_) => {
      if (enter) {
        broadcastTransaction(
          "Swapping " +
            selectedToken0.info.name +
            " for " +
            selectedToken1.info.name,
          $sdk.POOL.attach(selectedToken1.info.address)
            .connect($signer)
            .enter(
              parseUnits(amount, selectedToken0.info.decimals),
              parseUnits(amount, selectedToken0.info.decimals).mul(
                leverage > 1 ? leverage : 1
              ),
              parseUnits("887000", 9),
              $signerAddress
            )
        );
      } else {
        broadcastTransaction(
          "Swapping " +
            selectedToken0.info.name +
            " for " +
            selectedToken1.info.name,
          $sdk.POOL.attach(selectedToken0.info.address)
            .connect($signer)
            .exit(
              parseUnits(amount, selectedToken0.info.decimals),
              $signerAddress,
              { gasLimit: 1000000 }
            )
        );
      }
    }}>Swap</button
  >
</div>
