<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatUnits, parseEther } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { useBalance } from "src/hooks/balance";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify } from "src/lib";
  import Modal from "../../_modal.svelte";

  import { useAllowance, type TokenInfoAndBalance } from "src/hooks/erc20";
  import { maxLiquidityForAmounts } from "src/lib/uniswap/maxLiquidityForAmount";
  import {
    getAmount0Delta,
    getAmount1Delta,
  } from "src/lib/uniswap/sqrtPriceMath";
  import { getClosestTick, rectifyPrice } from "src/lib/uniswap/tick";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";
  import { signPermit } from "src/actions/sign";
  import { getShares, translatePrice } from "src/lib/sf/math";
  import { usePoolInfos } from "src/hooks/uniswap/pool";

  let debug = false;

  let lowPrice: number = 0.02;
  let highPrice: number = 0.06;

  let amount0: string; // amount0 is the amount of synthetic token
  let amount1: string; // amount1 is the amount of ETC

  let liquidity: number;

  let selectedToken: TokenInfoAndBalance;

  $: si = useSynthInfos;
  $: selectedSynth = $si?.find(
    (p) => p.address == selectedToken?.info?.address
  );

  $: pi = usePoolInfos;

  // this is not meant to be modified
  $: currentPrice = Number(
    formatUnits(selectedSynth?.currentPrice || 0, selectedSynth?.oracleDecimals)
  );

  $: virtualPrice = currentPrice;

  $: allowance = useAllowance(
    selectedToken?.info.address,
    $sdk.POSITION_MANAGER.address,
    $signerAddress
  );

  // translate amount0 to shares
  $: shares = getShares(
    Number(amount0),
    currentPrice,
    selectedSynth?.poolRatio
  );

  $: lowTick = getClosestTick(
    translatePrice(selectedSynth?.poolRatio, currentPrice, lowPrice)
  );

  $: highTick = getClosestTick(
    translatePrice(selectedSynth?.poolRatio, currentPrice, highPrice)
  );

  $: translatedPrice = parseEther(
    String(translatePrice(selectedSynth?.poolRatio, currentPrice, virtualPrice))
  );

  function recomputeAmount0() {
    liquidity = maxLiquidityForAmounts(
      Number(currentPrice),
      Number(lowPrice),
      Number(highPrice),
      0,
      Number(amount1)
    );
    if (currentPrice <= lowPrice) {
      amount0 = String(
        getAmount0Delta(Number(lowPrice), Number(highPrice), liquidity)
      );
    } else if (currentPrice < highPrice) {
      amount0 = String(
        getAmount0Delta(Number(currentPrice), Number(highPrice), liquidity)
      );
    } else {
      amount0 = "0";
    }
  }

  function recomputeAmount1() {
    liquidity = maxLiquidityForAmounts(
      Number(currentPrice),
      Number(lowPrice),
      Number(highPrice),
      Number(amount0),
      0
    );
    if (currentPrice <= lowPrice) {
      amount1 = "0";
    } else if (currentPrice < highPrice) {
      amount1 = String(getAmount1Delta(lowPrice, currentPrice, liquidity));
    } else {
      amount1 = String(getAmount1Delta(lowPrice, highPrice, liquidity));
    }
  }
</script>

<Modal
  id="position-modal"
  bind:selectedToken
  tokenInfosAndBalances={$si.map((p) => p.token) || []}
/>

<div
  class="lg:border-2 rounded-lg p-4 bg-transparent lg:w-1/2 m-auto bg-gradient"
>
  <div
    class="flex justify-between items-center p-4 pb-8 border-b border-base-content"
  >
    <a class="w-1/3" href="/earn/market">
      <Icon icon="ph-arrow-left-bold" class="text-2xl" />
    </a>
    <h1 class="text-xl w-1/3 text-center font-semibold">New Position</h1>
    <div class="w-1/3" />
  </div>
  {#if debug}
    <table class="w-full">
      <thead class="text-left">
        <tr>
          <th>Lower Price-Ratio-Tick</th>
          <th>Higher Price-Ratio-Tick</th>
          <th>Virtual Price-Ratio-Tick</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            >{lowPrice.toFixed(2)}|{translatePrice(
              selectedSynth.poolRatio,
              currentPrice,
              lowPrice
            ).toFixed(2)}|{lowTick}</td
          >
          <td
            >{highPrice.toFixed(2)}|{translatePrice(
              selectedSynth.poolRatio,
              currentPrice,
              highPrice
            ).toFixed(2)}|{highTick}</td
          >
          <td
            >{virtualPrice.toFixed(2)}|{translatePrice(
              selectedSynth.poolRatio,
              currentPrice,
              virtualPrice
            ).toFixed(2)}</td
          >
        </tr>
      </tbody>
    </table>
  {/if}
  <div class="p-4">
    <label class="label">
      <span class="label-text font-semibold text-base">Select pair</span>
    </label>
    <div class="lg:flex lg:space-x-4">
      <div class="lg:w-1/2">
        <label class="btn w-full border bg-opaque fine-border cursor-default"
          ><Icon class="inline text-xl text-green-600" icon="mdi:ethereum" /> ETC</label
        >
      </div>
      <div class="lg:w-1/2">
        <label
          for="position-modal"
          class="btn w-full fine-border"
          class:bg-opaque={selectedSynth != undefined}
        >
          <CoinIcon symbol={selectedSynth?.token?.info?.symbol} />{selectedSynth
            ?.token?.info?.name || "--"}</label
        >
      </div>
    </div>
    {#if selectedSynth}
      {#if !$pi.some((p) => p.token0?.info?.address == selectedSynth?.address)}
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
          <div class="form-control lg:w-full">
            <div class="flex items-center">
              <label class="input-group bg-opaque fine-border p-4 rounded-xl">
                <div
                  class="input input-ghost input-bordered text-2xl lg:w-2/3 flex items-center"
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
        </div>
      {/if}
    {/if}
    <div class="border-b w-full border-base-content hidden lg:block mt-4" />
    <div class:opacity-30={!selectedSynth}>
      <!-- <div class="border-b w-full my-4 border-base-content" /> -->
      <div class="my-4 font-semibold">Set price range</div>

      <div class="flex justify-between items-center space-x-4">
        <div
          class="form-control lg:w-1/2 bg-opaque fine-border px-4 pb-4 rounded-xl"
        >
          <label class="label">
            <span>Low price</span>
          </label>
          <label class="input-group w-full">
            <input
              bind:value={lowPrice}
              on:change={(e) => {
                lowPrice = rectifyPrice(Number(e.currentTarget.value));
                recomputeAmount1();
              }}
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
              class="input input-ghost input-bordered lg:w-2/3 text-2xl"
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
          class="form-control lg:w-1/2 bg-opaque fine-border fine-border px-4 pb-4 rounded-xl"
        >
          <label class="label">
            <span>High price</span>
          </label>
          <label class="input-group w-full">
            <input
              bind:value={highPrice}
              on:change={(e) => {
                if (Number(e.currentTarget.value) < lowPrice)
                  highPrice = rectifyPrice(lowPrice + (lowPrice * 0.6) / 100);
                else highPrice = rectifyPrice(Number(e.currentTarget.value));
                recomputeAmount0();
              }}
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
              class="input input-ghost input-bordered lg:w-2/3 text-2xl"
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
    <div class="border-b w-full my-4 border-base-content" />
    <div class:opacity-30={!selectedSynth}>
      <div class="font-semibold text-base my-4">Deposit amount</div>
      <div class="flex justify-between items-center space-x-4">
        <div class="form-control lg:w-1/2 bg-opaque fine-border p-4 rounded-xl">
          <label class="input-group">
            <input
              bind:value={amount1}
              type="text"
              placeholder="0"
              class="input input-ghost input-bordered lg:w-2/3 text-2xl"
              on:validated={(v) => (amount1 = v.detail)}
              on:change={recomputeAmount0}
              disabled={lowPrice >= currentPrice}
              use:validator={{
                value: amount1,
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
            on:click={(_) => (amount0 = String($useBalance?.balance))}
          >
            <span class="text-xs">Balance: </span>
            <span class="text-xs">{commify($useBalance?.balance)}</span>
          </div>
        </div>
        <div class="form-control lg:w-1/2 bg-opaque fine-border p-4 rounded-xl">
          <label class="input-group">
            <input
              bind:value={amount0}
              type="text"
              placeholder="0"
              class="input input-ghost input-bordered lg:w-2/3 text-2xl"
              disabled={highPrice <= currentPrice}
              on:change={recomputeAmount1}
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
            on:click={(_) => (amount0 = String(selectedSynth?.token?.balance))}
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
      disabled={!selectedSynth || !amount0}
      on:click={async (_) => {
        let signature;
        if ($allowance < Number(shares)) {
          console.log("signature");
          signature = await signPermit(
            selectedSynth?.address || "",
            $sdk.POSITION_MANAGER.address,
            parseEther(String(shares)),
            Math.round(Date.now() / 1000 + 60 * 60)
          );
        }
        console.log(
          selectedSynth?.address,
          translatedPrice,
          lowTick,
          highTick,
          String(shares),
          amount1
        );
        broadcastTransaction(
          `Depositing liquidities to ${selectedSynth?.token?.info?.symbol}`,
          $sdk.POSITION_MANAGER.connect($signer).multicall(
            [
              !!signature
                ? $sdk.POSITION_MANAGER.interface.encodeFunctionData(
                    "selfPermit",
                    [
                      selectedSynth?.address,
                      parseEther(String(shares)),
                      signature.deadline,
                      signature?.v,
                      signature.r,
                      signature.s,
                    ]
                  )
                : "",
              $sdk.POSITION_MANAGER.interface.encodeFunctionData(
                "createAndInitializePoolIfNecessary",
                [
                  selectedSynth?.token?.info?.address || "",
                  $sdk.WETC9.address,
                  3000,
                  translatedPrice.shl(96).div(parseEther("1")),
                ]
              ),
              // ]);
              $sdk.POSITION_MANAGER.interface.encodeFunctionData("mint", [
                {
                  token0: selectedSynth.address,
                  token1: $sdk.WETC9.address,
                  fee: 3000,
                  tickLower: lowTick,
                  tickUpper: highTick,
                  amount0Desired: parseEther(String(shares)),
                  amount1Desired: parseEther(amount1),
                  amount0Min: 0,
                  amount1Min: 0,
                  recipient: $signerAddress,
                  deadline: Math.floor(Date.now() / 1000) + 60 * 60,
                },
              ]),
              $sdk.POSITION_MANAGER.interface.encodeFunctionData("refundETH"),
            ],
            { value: parseEther(amount1) }
          )
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
