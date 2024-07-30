<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { commify, updateVc } from "src/lib";
  import Modal from "../../_modal.svelte";

  import { useAllowance, type TokenInfoAndBalance } from "src/hooks/erc20";
  import { usePoolInfos } from "src/hooks/uniswap/pool";
  import { navigate } from "src/lib/path";
  import { reverseRatio } from "src/lib/sf/reverse";
  import { computeAmount0, computeAmount1 } from "src/lib/uniswap/math";
  import {
    getClosestTick,
    getRatioForTick,
    rectifyPrice,
  } from "src/lib/uniswap/tick";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";
  import { useBalance } from "src/hooks/balance";
  import { onMount } from "svelte";
  import { validator } from "src/actions/big-number-input";
  import { signPermit } from "src/actions/sign";
  import { broadcastTransaction } from "src/hooks/transactions";
  import type { RSV } from "eth-permit/dist/rpc";

  let open: boolean = false;

  let synthAmount: string; // synthAmount is the amount of synthetic token (amount0)
  let etcAmount: string; // etcAmount is the amount of ETC (amount1)

  let selectedToken: TokenInfoAndBalance;

  $: url = new URL($page.url);

  $: si = useSynthInfos;
  $: selectedSynth = $si?.find(
    (p) => p.address == selectedToken?.info?.address
  );

  $: pi = usePoolInfos;

  $: pool = $pi.find(
    (p) =>
      p.token0?.info?.address == selectedSynth?.address ||
      p.token1?.info?.address == selectedSynth?.address
  );

  // the current ratio for the uni pool
  // from which we can derive the price once we know the synth price and synth ratio
  $: currentRatio = reverseRatio(pool?.ratio, isReversed) || synthRatio;

  $: synthPrice = Number(
    formatUnits(selectedSynth?.currentPrice || 0, selectedSynth?.oracleDecimals)
  );

  $: synthRatio = Number(formatEther(selectedSynth?.ratio || 1));

  // this is not meant to be modified
  // if the pool exist, take the ratio from the pool and get the price for it
  // if the pool does not exist, take the price from the synth
  $: currentPrice = (currentRatio * synthPrice) / synthRatio;

  $: lowPrice = currentPrice * 0.95;
  $: lowDifference = ((lowPrice - currentPrice) / currentPrice) * 100;

  $: highPrice = currentPrice * 1.05;
  $: highDifference = ((highPrice - currentPrice) / currentPrice) * 100;

  $: virtualPrice = currentPrice;

  // the ratio of the pool, if changed (for new pools creation)
  $: virtualRatio = (virtualPrice * synthRatio) / synthPrice;

  $: lowRatio = (lowPrice * synthRatio) / synthPrice;
  $: highRatio = (highPrice * synthRatio) / synthPrice;

  $: allowance = useAllowance(
    selectedToken?.info.address,
    $sdk.POSITION_MANAGER.address,
    $signerAddress
  );

  // the amount of shares to be minted translated from the synth amount
  $: shares = (Number(synthAmount) * synthPrice) / synthRatio;

  $: isReversed = (selectedSynth?.address || "") > $sdk.WETC9.address;

  $: console.log("debug", currentRatio);

  $: tickLower = getClosestTick(lowRatio);

  $: tickUpper = getClosestTick(highRatio);

  let signature: RSV | undefined;

  // recompute synth (amount0)
  function recomputeSynth() {
    if (!selectedSynth) return;
    signature = undefined;
    const shares = computeAmount0(
      currentRatio,
      getRatioForTick(tickLower),
      getRatioForTick(tickUpper),
      Number(etcAmount)
    );

    synthAmount = String((shares * synthRatio) / synthPrice);

    console.log("recomputeSynth", shares, synthAmount);
  }

  $: {
    if (selectedToken && selectedSynth && !!etcAmount) {
      recomputeSynth();
      console.log(selectedSynth, etcAmount, synthPrice, synthRatio);
    }
  }

  // recompute ETC (amount1)
  function recomputeETC() {
    if (!selectedSynth) return;
    etcAmount = String(
      computeAmount1(
        currentRatio,
        getRatioForTick(tickLower),
        getRatioForTick(tickUpper),
        (Number(synthAmount) * synthPrice) / synthRatio
      )
    );
  }
  onMount(() => {
    updateVc();
  });
</script>

<Modal
  id="position-modal"
  bind:selectedToken
  bind:open
  tokenInfosAndBalances={$si.map((p) => p.token) || []}
/>

<div
  class="lg:border-2 rounded-lg lg:p-4 bg-transparent lg:w-1/2 m-auto lg:bg-gradient"
>
  <div class="p-4 lg:h-auto lg:pt-0 container-height" id="container">
    <label class="label">
      <span class="label-text font-semibold text-base">Select pair</span>
    </label>
    <div class="flex space-x-4">
      <div class="w-1/2">
        <label
          class="btn w-full lg:btn-md btn-sm border bg-opaque fine-border cursor-default"
          ><Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
          ETC</label
        >
      </div>
      <div class="w-1/2">
        <label
          for="position-modal"
          class="lg:btn hidden w-full fine-border"
          class:bg-opaque={selectedSynth != undefined}
        >
          <CoinIcon symbol={selectedSynth?.token?.info?.symbol} />{selectedSynth
            ?.token?.info?.name || "--"}</label
        >
        <button
          class="btn btn-sm w-full fine-border lg:hidden"
          class:bg-opaque={selectedSynth != undefined}
          on:click={(_) => (open = true)}
          ><CoinIcon
            className="!w-4 !h-4"
            symbol={selectedSynth?.token?.info?.symbol}
          />{selectedSynth?.token?.info?.name || "--"}</button
        >
      </div>
    </div>
    {#if selectedSynth}
      {#if !pool}
        <div
          class="border border-info bg-info text-info-content p-4 rounded-xl mt-4"
        >
          This pool must be initialized before you can add liquidity. To
          initialize, select a starting price for the pool. Then, enter your
          liquidity price range and deposit amount. Gas fees will be higher than
          usual due to the initialization transaction.
        </div>
        <div class="my-4 font-semibold">Starting Price</div>
        <div class="flex justify-between items-center space-x-4">
          <div class="lg:form-control lg:w-full hidden">
            <div class="flex items-center">
              <label class="input-group bg-opaque fine-border p-4 rounded-xl">
                <div
                  class="lg:input lg:input-ghost lg:input-bordered text-2xl lg:w-2/3 flex items-center"
                >
                  1
                </div>
                <span
                  class="text-center flex items-center justify-center flex-grow"
                  ><CoinIcon
                    className="mr-2"
                    symbol={selectedSynth?.token?.info?.symbol}
                  />
                  {selectedSynth?.token?.info?.symbol}</span
                >
              </label>
              <Icon class="text-5xl" icon="pepicons-pop:equal" />
              <label class="input-group bg-opaque fine-border p-4 rounded-xl">
                <input
                  type="number"
                  inputmode="decimal"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  bind:value={virtualPrice}
                  class="input input-ghost input-bordered text-2xl lg:w-2/3"
                />
                <span
                  class="text-center flex items-center justify-center flex-grow"
                  ><Icon
                    class="inline text-xl text-green-600"
                    icon="mdi:ethereum"
                  />
                  ETC</span
                >
              </label>
            </div>
          </div>
          <div class="lg:hidden flex items-center space-x-1">
            <span>1</span>
            <CoinIcon
              className="mr-2"
              symbol={selectedSynth?.token?.info?.symbol}
            /> <span>=</span>
            <span
              >{virtualPrice}<Icon
                class="inline text-2xl text-green-600"
                icon="mdi:ethereum"
              /></span
            >
          </div>
        </div>
      {:else}
        <div class="pt-4 lg:font-bold">
          Current Price: {commify(currentPrice, 4)}
          <Icon icon="mdi:ethereum" class="inline lg:text-xl text-green-600" />
        </div>
      {/if}
    {/if}
    <div class="border-b w-full border-base-content hidden lg:block mt-4" />
    <div class:opacity-30={!selectedSynth}>
      <!-- <div class="border-b w-full my-4 border-base-content" /> -->
      <div class="my-4 font-semibold">Set price range</div>

      <div class="lg:flex lg:justify-between lg:items-center lg:space-x-4">
        <div
          class="lg:form-control lg:w-1/2 bg-opaque fine-border px-4 pb-4 rounded-xl"
        >
          <label class="label">
            <span>Low price</span>
            <span
              >{lowDifference > 0
                ? "+" + commify(lowDifference, 2)
                : commify(lowDifference, 2)}%</span
            >
          </label>
          <label class="input-group w-full">
            <input
              bind:value={lowPrice}
              on:change={(e) => {
                lowPrice = rectifyPrice(Number(e.currentTarget.value));
                recomputeETC();
              }}
              type="number"
              inputmode="decimal"
              min="0"
              step="0.1"
              placeholder="0"
              class="input input-ghost input-bordered w-2/3 lg:text-2xl"
            />
            <span class="justify-center flex items-center flex-grow"
              ><Icon
                class="inline text-xl text-green-600"
                icon="mdi:ethereum"
              />
              ETC</span
            >
          </label>
        </div>
        <div
          class="form-control lg:w-1/2 bg-opaque fine-border fine-border px-4 pb-4 rounded-xl lg:mt-0 mt-4"
        >
          <label class="label">
            <span>High price</span>
            <span
              >{highDifference > 0
                ? "+" + commify(highDifference, 2)
                : commify(highDifference, 2)}%</span
            >
          </label>
          <label class="input-group w-full">
            <input
              bind:value={highPrice}
              on:change={(e) => {
                if (Number(e.currentTarget.value) < lowPrice)
                  highPrice = rectifyPrice(lowPrice + (lowPrice * 0.6) / 100);
                else highPrice = rectifyPrice(Number(e.currentTarget.value));
                recomputeSynth();
              }}
              type="number"
              inputmode="decimal"
              min="0"
              step="0.1"
              placeholder="0"
              class="input input-ghost input-bordered w-2/3 lg:text-2xl"
            />
            <span class="justify-center flex items-center flex-grow"
              ><Icon
                class="inline text-xl text-green-600"
                icon="mdi:ethereum"
              />
              ETC</span
            >
          </label>
        </div>
      </div>
    </div>
    <div class="border-b w-full my-4 border-base-content lg:block hidden" />
    <div class:opacity-30={!selectedSynth}>
      <div class="font-semibold text-base my-4">Deposit amount</div>
      <div class="lg:flex lg:justify-between items-center lg:space-x-4">
        <div class="form-control lg:w-1/2 bg-opaque fine-border p-4 rounded-xl">
          <label class="input-group">
            <input
              bind:value={etcAmount}
              type="text"
              inputmode="decimal"
              placeholder="0"
              class="input input-ghost input-bordered w-2/3 lg:text-2xl"
              class:input-error={Number(etcAmount) >
                Number($useBalance?.balance)}
              on:validated={(v) => (etcAmount = v.detail)}
              on:input={recomputeSynth}
              disabled={lowPrice >= currentPrice}
              use:validator={{
                value: etcAmount,
                max: $useBalance?.balance,
              }}
            />
            <span
              class="w-24 text-center flex items-center justify-center flex-grow"
              ><Icon
                class="inline text-xl text-green-600"
                icon="mdi:ethereum"
              />
              ETC</span
            >
          </label>
          <div
            class="text-right px-4 cursor-pointer"
            on:click={(_) => {
              etcAmount = String($useBalance?.balance);
              recomputeSynth();
            }}
          >
            <span class="text-xs">Balance: </span>
            <span class="text-xs">{commify($useBalance?.balance)}</span>
          </div>
        </div>
        <div
          class="form-control lg:w-1/2 bg-opaque fine-border p-4 rounded-xl lg:mt-0 mt-4"
        >
          <label class="input-group">
            <input
              bind:value={synthAmount}
              type="text"
              inputmode="decimal"
              placeholder="0"
              class="input input-ghost input-bordered w-2/3 lg:text-2xl"
              class:input-error={Number(synthAmount) >
                Number(selectedSynth?.token?.balance)}
              disabled={highPrice <= currentPrice}
              on:input={recomputeETC}
            />
            <span class="text-center flex items-center justify-center flex-grow"
              ><CoinIcon
                className="mr-2"
                symbol={selectedSynth?.token?.info?.symbol}
              />
              {selectedSynth?.token?.info?.symbol}</span
            >
          </label>
          <div
            class="text-right px-4 cursor-pointer"
            on:click={(_) => {
              synthAmount = String(selectedSynth?.token?.balance);
              recomputeETC();
            }}
          >
            <span class="text-xs">Balance: </span>
            <span class="text-xs">{commify(selectedSynth?.token?.balance)}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="border-b w-full border-base-content hidden lg:block mt-4" />
    <button
      class="btn btn-primary w-full mt-8"
      disabled={!selectedSynth ||
        !synthAmount ||
        Number(selectedToken?.balance) < Number(synthAmount) ||
        Number($useBalance?.balance) < Number(etcAmount)}
      on:click={async (_) => {
        console.log("click", $allowance, shares, synthAmount);
        const shares_ = (Number(synthAmount) * synthPrice) / synthRatio;
        if ($allowance < shares_ && !signature) {
          console.log("signature");
          signature = await signPermit(
            selectedSynth?.address || "",
            $sdk.POSITION_MANAGER.address,
            parseEther(shares_.toString()),
            Math.round(Date.now() / 1000 + 60 * 60)
          );
          return;
        }
        console.log(tickLower, tickUpper, selectedSynth?.address);
        broadcastTransaction(
          `Depositing liquidities to ${selectedSynth?.token?.info?.symbol}`,
          $sdk.POSITION_MANAGER.connect($signer).multicall(
            [
              !!signature
                ? $sdk.POSITION_MANAGER.interface.encodeFunctionData(
                    "selfPermit",
                    [
                      selectedSynth?.address,
                      parseEther(shares_.toString()),
                      signature.deadline,
                      signature?.v,
                      signature.r,
                      signature.s,
                    ]
                  )
                : "",
              !pool
                ? $sdk.POSITION_MANAGER.interface.encodeFunctionData(
                    "createAndInitializePoolIfNecessary",
                    [
                      isReversed
                        ? $sdk.WETC9.address
                        : selectedSynth?.address || "",
                      isReversed
                        ? selectedSynth?.address || ""
                        : $sdk.WETC9.address,
                      3000,
                      parseEther(
                        String(
                          reverseRatio(Math.sqrt(virtualRatio), isReversed)
                        )
                      )
                        .shl(96)
                        .div(parseEther("1")),
                    ]
                  )
                : "",
              $sdk.POSITION_MANAGER.interface.encodeFunctionData("mint", [
                {
                  token0: isReversed
                    ? $sdk.WETC9.address
                    : selectedSynth?.address || "",
                  token1: isReversed
                    ? selectedSynth?.address || ""
                    : $sdk.WETC9.address,
                  fee: 3000,
                  tickLower: isReversed ? -tickUpper : tickLower,
                  tickUpper: isReversed ? -tickLower : tickUpper,
                  amount0Desired: parseEther(
                    String(isReversed ? etcAmount : shares_)
                  ),
                  amount1Desired: parseEther(
                    String(isReversed ? shares_ : etcAmount)
                  ),
                  amount0Min: 0,
                  amount1Min: 0,
                  recipient: $signerAddress,
                  deadline: Math.floor(Date.now() / 1000) + 60 * 60,
                },
              ]),
              $sdk.POSITION_MANAGER.interface.encodeFunctionData("refundETH"),
            ].filter((t) => !!t),
            { value: parseEther(etcAmount) }
          )
        );
      }}
    >
      {#if Number(selectedToken?.balance) < Number(synthAmount)}
        Insufficient {selectedToken.info.symbol} balance
      {:else if Number($useBalance?.balance) < Number(etcAmount)}
        Insufficient ETC balance
      {:else if $allowance < (Number(synthAmount) * synthPrice) / synthRatio && !signature}
        Approve
      {:else}
        Add Liquidity
      {/if}
    </button>
  </div>
</div>

<style>
  :global(input[type="number"]::-webkit-inner-spin-button),
  :global(input[type="number"]::-webkit-outer-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
