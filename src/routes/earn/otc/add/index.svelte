<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { parseEther } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";
  import LiquidityChart from "src/components/liquidity-chart.svelte";
  import { useBalance } from "src/hooks/balance";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify, updateVc } from "src/lib";
  import { sdk } from "src/stores";
  import { onMount } from "svelte";
  import { signer } from "svelte-ethers-store";
  import Modal from "../../_modal.svelte";

  let trigger: HTMLLabelElement;

  let amount: string;

  let open: boolean = false;

  let selectedToken: TokenInfoAndBalance;

  $: pi = useSynthInfos;
  $: selectedPool = $pi?.find((p) => p.address == selectedToken?.info?.address);

  $: url = new URL($page.url);

  let FR = 500;
  // fr is actually a tick here
  function formatFR(fr: number) {
    return Number(fr.toFixed(1)) / 100;
  }

  onMount(updateVc);
</script>

<Modal
  id="position-modal"
  bind:selectedToken
  bind:open
  tokenInfosAndBalances={$pi.map((p) => p.token) || []}
/>

<section class="earn-add-shell px-4 pb-12 pt-44 lg:px-8 lg:pt-0" id="container">
  <div class="mx-auto max-w-7xl">
    <div class="earn-add-hero">
      <div>
        <p class="app-label">Issuance and redemption</p>
        <h2>Back canonical settlement.</h2>
        <p>
          Protocol liquidity supplies the ETC collateral that position tokens use when they are minted, redeemed, and settled by oracle rounds.
        </p>
      </div>
      <div class="earn-add-proof">
        <span>Role</span>
        <strong>Protocol collateral</strong>
      </div>
    </div>

    <div class="app-panel earn-add-panel">
      <div class="earn-add-section">
        <div>
          <p class="app-label">1. Exposure</p>
          <h3>Choose the position token to back</h3>
        </div>
        <div>
        <button
          class="token-chip token-chip--button token-chip--mobile w-full"
          type="button"
          on:click={(_) => (open = true)}
        >
          {selectedPool?.token?.info?.name || "Select token"}
        </button>
        <label
          for="position-modal"
          id="position-opener"
          class="token-chip token-chip--button token-chip--desktop w-full"
          class:token-chip--selected={selectedPool != undefined}
          >{selectedPool?.token?.info?.name || "Select token"}</label
        >
      </div>
    </div>

      <div class="earn-add-section">
        <div>
          <p class="app-label">2. Collateral</p>
          <h3>Commit ETC to protocol settlement</h3>
        </div>
        <div class="form-slab">
          <label class="input-group">
            <input
              bind:value={amount}
              type="text"
              inputmode="decimal"
              placeholder="0"
              class="input input-ghost input-bordered w-full text-2xl"
              on:validated={(v) => (amount = v.detail)}
              use:validator={{
                value: amount,
                max: $useBalance?.balance,
              }}
            />
            <span class="w-24 text-center flex items-center justify-center"
              ><Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
              ETC</span
            >
          </label>
          <button
            class="balance-button"
            type="button"
            on:click={(_) => (amount = String($useBalance?.balance))}
          >
            Balance: {commify($useBalance?.balance)} ETC
          </button>
        </div>
      </div>

      <div class="earn-add-section earn-add-section--stacked">
        <div>
          <p class="app-label">3. Activation</p>
          <h3>Set where this collateral starts earning</h3>
        </div>
        <div class="rate-control">
          <button class="rate-button" type="button" on:click={(_) => (FR -= 10)}>
            <Icon icon="ic:baseline-minus" />
          </button>
          <div class="flex flex-col justify-between" id="activation-rate">
            <div class="flex-grow h-8 text-center app-muted">Activation rate</div>
            <input
              class="text-lg font-semibold flex-grow text-center h-8 bg-transparent appearance-none"
              value={formatFR(FR)}
              on:change={(e) => (FR = Number(e.currentTarget.value) * 100)}
              type="number"
              inputmode="decimal"
              step="0.1"
              min="0"
              max="640"
            />

            <div class="flex-grow h-8 text-center items-end mt-1 app-muted">% / Year</div>
          </div>
          <button class="rate-button" type="button" on:click={(_) => (FR += 10)}>
            <Icon icon="material-symbols:add" />
          </button>
        </div>
      </div>

    {#if selectedPool}
      <LiquidityChart
        initializedTicks={selectedPool.ticks}
        bind:FR
        className="!h-40"
      />
    {:else}
      <div class="empty-preview">
        <div class="app-label">Preview</div>
        <h3>Your settlement position will appear here</h3>
        <Icon icon="octicon:inbox-24" class="text-4xl text-primary" />
      </div>
    {/if}
    <button
      class="btn btn-primary w-full mt-8 rounded-full"
      disabled={!selectedPool || !Number(amount)}
      on:click={(_) => {
        broadcastTransaction(
          `Depositing liquidities to ${selectedPool?.token?.info?.symbol}`,
          $sdk.POOL.attach(selectedPool?.address || "")
            .connect($signer)
            .mint(FR, $sdk.TRADER_PERIPHERY.address, {
              value: parseEther(amount),
            })
        );
      }}>Back protocol settlement</button
    >
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

  .earn-add-proof,
  .form-slab,
  .rate-control,
  .empty-preview {
    border: 1px solid rgb(var(--sf-border) / 0.12);
    border-radius: 0.5rem;
    background: rgb(255 255 255 / 0.035);
  }

  .earn-add-proof {
    justify-self: start;
    border-color: rgb(var(--sf-green) / 0.18);
    padding: 0.85rem 1rem;
    background: rgb(17 18 28 / 0.46);
  }

  .earn-add-proof span {
    display: block;
    color: hsl(var(--bc) / 0.62);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .earn-add-proof strong {
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

  .earn-add-section h3,
  .empty-preview h3 {
    margin-top: 0.35rem;
    font-size: 1.25rem;
    font-weight: 750;
  }

  .earn-add-section--stacked {
    display: block;
  }

  .token-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3rem;
    gap: 0.5rem;
    padding: 0 1rem;
    border: 1px solid rgb(var(--sf-border) / 0.12);
    border-radius: 0.5rem;
    background: rgb(255 255 255 / 0.035);
    font-weight: 750;
    cursor: pointer;
  }

  .token-chip--desktop {
    display: none;
  }

  .token-chip--selected,
  .token-chip:hover {
    border-color: rgb(var(--sf-green) / 0.25);
    background: rgb(var(--sf-green) / 0.08);
  }

  .form-slab {
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

  .rate-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 28rem;
    margin: 1rem auto 0;
    padding: 0.5rem;
  }

  .rate-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 999px;
    color: hsl(var(--bc));
  }

  .rate-button:hover {
    background: rgb(var(--sf-green) / 0.1);
  }

  .empty-preview {
    display: grid;
    gap: 0.75rem;
    justify-items: center;
    margin-top: 1rem;
    padding: 2rem;
    text-align: center;
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
