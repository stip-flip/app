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

  $: tickLower = getClosestTick(lowRatio);

  $: tickUpper = getClosestTick(highRatio);

  let signature: RSV | undefined;

  const floorAmount = (value: number | string | undefined, decimals = 12) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "";
    const factor = 10 ** decimals;
    return String(Math.floor(amount * factor) / factor);
  };

  $: maxEtcAmount = floorAmount($useBalance?.balance);

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

  }

  $: {
    if (selectedToken && selectedSynth && !!etcAmount) {
      recomputeSynth();
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

<section class="earn-add-shell px-4 pb-12 pt-44 lg:px-8 lg:pt-0" id="container">
  <div class="mx-auto max-w-7xl">
    <div class="earn-add-hero">
      <div>
        <p class="app-label">Secondary trading</p>
        <h2>Provide depth for position tokens.</h2>
        <p>
          Market liquidity helps tokenized exposure move between wallets and venues while protocol settlement remains canonical.
        </p>
      </div>
      <div class="earn-add-proof">
        <span>Mode</span>
        <strong>ETC / position token</strong>
      </div>
    </div>

    <div class="app-panel earn-add-panel">
      <div class="earn-add-section">
        <div>
          <p class="app-label">1. Pair</p>
          <h3>Select the exposure token to back</h3>
        </div>
        <div class="earn-add-pair">
          <div class="token-chip token-chip--fixed">
            <Icon class="text-xl text-green-600" icon="mdi:ethereum" />
            <span>ETC</span>
          </div>
          <label
            for="position-modal"
            class="token-chip token-chip--button token-chip--desktop"
            class:token-chip--selected={selectedSynth != undefined}
          >
            <CoinIcon symbol={selectedSynth?.token?.info?.symbol} />{selectedSynth
              ?.token?.info?.name || "Select token"}
          </label>
          <button
            class="token-chip token-chip--button token-chip--mobile"
            class:token-chip--selected={selectedSynth != undefined}
            type="button"
            on:click={(_) => (open = true)}
            ><CoinIcon
              className="!w-4 !h-4"
              symbol={selectedSynth?.token?.info?.symbol}
            />{selectedSynth?.token?.info?.name || "Select token"}</button
          >
        </div>
      </div>

    {#if selectedSynth}
      {#if !pool}
        <div class="earn-add-notice">
          <strong>Pool initialization required.</strong>
          Choose a starting price, then set the active range and deposit amounts. The first transaction initializes secondary trading for this exposure token.
        </div>
        <div class="earn-add-section earn-add-section--stacked">
          <div>
            <p class="app-label">Starting price</p>
            <h3>Set the first secondary-market price</h3>
          </div>
          <div class="hidden lg:block">
            <div class="flex items-center">
              <label class="input-group form-slab">
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
              <label class="input-group form-slab">
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
          <div class="lg:hidden flex items-center gap-2 app-muted">
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
        <div class="earn-add-current">
          <span>Current secondary price</span>
          <strong>{commify(currentPrice, 4)}</strong>
          <Icon icon="mdi:ethereum" class="inline lg:text-xl text-green-600" />
        </div>
      {/if}
    {/if}
    <div class:opacity-30={!selectedSynth}>
      <div class="earn-add-section earn-add-section--stacked">
        <div>
          <p class="app-label">2. Range</p>
          <h3>Choose where this liquidity is active</h3>
        </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div class="form-slab">
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
        <div class="form-slab">
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
    </div>
    <div class:opacity-30={!selectedSynth}>
      <div class="earn-add-section earn-add-section--stacked">
        <div>
          <p class="app-label">3. Deposit</p>
          <h3>Commit collateral and exposure token inventory</h3>
        </div>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="form-slab">
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
                max: maxEtcAmount,
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
          <button
            class="balance-button"
            type="button"
            on:click={(_) => {
              etcAmount = maxEtcAmount;
              recomputeSynth();
            }}
          >
            <span class="text-xs">Balance: </span>
            <span class="text-xs">{commify($useBalance?.balance)}</span>
          </button>
        </div>
        <div class="form-slab">
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
              {selectedSynth?.token?.info?.symbol || "Token"}</span
            >
          </label>
          <button
            class="balance-button"
            type="button"
            on:click={(_) => {
              synthAmount = String(selectedSynth?.token?.balance);
              recomputeETC();
            }}
          >
            <span class="text-xs">Balance: </span>
            <span class="text-xs">{commify(selectedSynth?.token?.balance)}</span
            >
          </button>
        </div>
      </div>
      </div>
    </div>
    <button
      class="btn btn-primary w-full rounded-full mt-8"
      disabled={!selectedSynth ||
        !synthAmount ||
        Number(selectedToken?.balance) < Number(synthAmount) ||
        Number($useBalance?.balance) < Number(etcAmount)}
      on:click={async (_) => {
        const shares_ = (Number(synthAmount) * synthPrice) / synthRatio;
        if ($allowance < shares_ && !signature) {
          signature = await signPermit(
            selectedSynth?.address || "",
            $sdk.POSITION_MANAGER.address,
            parseEther(shares_.toString()),
            Math.round(Date.now() / 1000 + 60 * 60)
          );
          return;
        }
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
        Back secondary market
      {/if}
    </button>
  </div>
  </div>
</section>

<style>
  .earn-add-shell {
    min-height: calc(var(--vc, 1vh) * 100);
    overflow: visible;
    padding-bottom: calc(var(--footer-height, 6rem) + 3rem);
    padding-top: 11rem;
  }

  .earn-add-hero {
    display: grid;
    gap: 1.5rem;
    align-items: end;
    padding: 1rem 0 1.25rem;
  }

  .earn-add-hero h2 {
    max-width: 48rem;
    margin-top: 0.45rem;
    color: hsl(var(--bc));
    font-size: clamp(2.25rem, 6vw, 5.25rem);
    font-weight: 800;
    line-height: 0.94;
  }

  .earn-add-hero p:not(.app-label) {
    max-width: 44rem;
    margin-top: 1rem;
    color: hsl(var(--bc) / 0.72);
    font-size: 1rem;
    line-height: 1.65;
  }

  .earn-add-proof {
    justify-self: start;
    border: 1px solid rgb(var(--sf-green) / 0.18);
    border-radius: 0.5rem;
    padding: 0.85rem 1rem;
    background: rgb(17 18 28 / 0.46);
  }

  .earn-add-proof span,
  .earn-add-current span {
    display: block;
    color: hsl(var(--bc) / 0.62);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .earn-add-proof strong,
  .earn-add-current strong {
    display: block;
    margin-top: 0.25rem;
    color: hsl(var(--bc));
  }

  .earn-add-panel {
    padding: 1rem;
  }

  .earn-add-section {
    display: grid;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid rgb(var(--sf-border) / 0.1);
  }

  .earn-add-section:first-child {
    padding-top: 0;
  }

  .earn-add-section h3 {
    margin-top: 0.35rem;
    font-size: 1.25rem;
    font-weight: 750;
  }

  .earn-add-section--stacked {
    display: block;
  }

  .earn-add-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .token-chip,
  .form-slab {
    border: 1px solid rgb(var(--sf-border) / 0.12);
    border-radius: 0.5rem;
    background: rgb(255 255 255 / 0.035);
  }

  .token-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3rem;
    gap: 0.5rem;
    padding: 0 1rem;
    font-weight: 750;
  }

  .token-chip--desktop {
    display: none;
  }

  .token-chip--button {
    cursor: pointer;
  }

  .token-chip--selected,
  .token-chip--button:hover {
    border-color: rgb(var(--sf-green) / 0.25);
    background: rgb(var(--sf-green) / 0.08);
  }

  .earn-add-notice,
  .earn-add-current {
    margin-top: 1rem;
    border: 1px solid rgb(var(--sf-green) / 0.18);
    border-radius: 0.5rem;
    padding: 1rem;
    background: rgb(var(--sf-green) / 0.08);
    color: hsl(var(--bc) / 0.78);
  }

  .form-slab {
    margin-top: 1rem;
    padding: 1rem;
  }

  .balance-button {
    display: block;
    margin: 0.75rem 0 0 auto;
    color: hsl(var(--bc) / 0.68);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .balance-button:hover {
    color: rgb(var(--sf-green));
  }

  :global(input[type="number"]::-webkit-inner-spin-button),
  :global(input[type="number"]::-webkit-outer-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (min-width: 1024px) {
    .earn-add-shell {
      padding-bottom: 3rem;
      padding-top: 0;
    }

    .earn-add-hero {
      grid-template-columns: minmax(0, 1fr) auto;
      padding-top: 1.5rem;
    }

    .earn-add-panel {
      padding: 1.5rem;
    }

    .earn-add-section {
      grid-template-columns: 18rem minmax(0, 1fr);
      align-items: center;
    }

    .token-chip--desktop {
      display: inline-flex;
    }

    .token-chip--mobile {
      display: none;
    }
  }
</style>
