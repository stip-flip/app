<script lang="ts">
  import Icon from "@iconify/svelte";
  import { env } from "$env/dynamic/public";
  import { closeOnEscape, portal } from "src/actions/modal";
  import { modal } from "src/lib/web3";
  import { connected, signerAddress } from "svelte-ethers-store";

  export let compact = false;
  export let fullWidth = false;

  let open = false;
  let error = "";

  const transakApiKey = env.PUBLIC_TRANSAK_API_KEY;

  $: widgetUrl =
    transakApiKey && $signerAddress
      ? buildTransakUrl(transakApiKey, $signerAddress)
      : "";

  async function openOnramp() {
    error = "";

    if (!$connected || !$signerAddress) {
      await modal.open();
      return;
    }

    if (!transakApiKey) {
      error = "Transak is not configured yet.";
      open = true;
      return;
    }

    open = true;
  }

  function buildTransakUrl(apiKey: string, walletAddress: string) {
    const params = new URLSearchParams({
      apiKey,
      referrerDomain: window.location.hostname,
      productsAvailed: "BUY",
      cryptoCurrencyCode: "ETC",
      network: "mainnet",
      fiatCurrency: "EUR",
      defaultFiatAmount: "50",
      walletAddress,
      disableWalletAddressForm: "true",
      hideMenu: "true",
      redirectURL: window.location.origin + "/wallet",
    });

    return `https://global.transak.com?${params.toString()}`;
  }
</script>

<button
  type="button"
  class:buy-etc-compact={compact}
  class:buy-etc-full={fullWidth}
  class="buy-etc"
  on:click={openOnramp}
>
  <Icon icon="mdi:credit-card-plus-outline" />
  <span>Buy ETC</span>
</button>

{#if open}
  <div
    use:portal
    use:closeOnEscape={() => (open = false)}
    class="buy-etc-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="buy-etc-title"
    tabindex="-1"
  >
    <button
      type="button"
      class="buy-etc-backdrop"
      aria-label="Close ETC onramp"
      on:click={() => (open = false)}
    ></button>
    <div class="buy-etc-panel" role="presentation">
      <div class="buy-etc-header">
        <div>
          <p>Native ETC onramp</p>
          <h2 id="buy-etc-title">Buy ETC with EUR</h2>
        </div>
        <button
          type="button"
          class="buy-etc-close"
          aria-label="Close ETC onramp"
          on:click={() => (open = false)}
        >
          <Icon icon="mdi:close" />
        </button>
      </div>

      {#if error}
        <div class="buy-etc-empty">
          <Icon icon="mdi:alert-circle-outline" />
          <p>{error}</p>
          <span>Set <code>PUBLIC_TRANSAK_API_KEY</code> to enable the embedded Transak widget.</span>
        </div>
      {:else if widgetUrl}
        <iframe
          title="Buy native ETC with EUR"
          src={widgetUrl}
          allow="payment; clipboard-write"
        ></iframe>
      {/if}
    </div>
  </div>
{/if}

<style>
  .buy-etc {
    display: inline-flex;
    min-height: 2rem;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    border: 1px solid rgb(var(--sf-green) / 0.28);
    border-radius: 999px;
    padding: 0.38rem 0.8rem;
    color: hsl(var(--bc));
    background: rgb(var(--sf-green) / 0.12);
    font-size: 0.88rem;
    font-weight: 700;
    line-height: 1;
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      transform 160ms ease;
  }

  .buy-etc:hover {
    border-color: rgb(var(--sf-green) / 0.48);
    background: rgb(var(--sf-green) / 0.18);
    transform: translateY(-1px);
  }

  .buy-etc-compact {
    padding-inline: 0.65rem;
  }

  .buy-etc-full {
    width: 100%;
    min-height: 3rem;
    border-radius: 0.5rem;
  }

  .buy-etc :global(svg) {
    flex: none;
    font-size: 1.08rem;
    color: rgb(var(--sf-green));
  }

  .buy-etc-modal {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgb(0 0 0 / 0.62);
    text-align: left;
  }

  .buy-etc-backdrop {
    position: absolute;
    inset: 0;
    cursor: default;
  }

  .buy-etc-panel {
    position: relative;
    display: flex;
    width: min(100%, 28rem);
    height: min(90vh, 46rem);
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgb(var(--sf-green) / 0.24);
    border-radius: 0.75rem;
    background: hsl(var(--b1));
    box-shadow: 0 28px 80px rgb(0 0 0 / 0.34);
  }

  .buy-etc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid rgb(var(--sf-border) / 0.12);
    padding: 0.9rem 1rem;
  }

  .buy-etc-header p {
    color: rgb(var(--sf-green));
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .buy-etc-header h2 {
    margin-top: 0.15rem;
    font-size: 1.05rem;
    font-weight: 750;
  }

  .buy-etc-close {
    display: grid;
    width: 2rem;
    height: 2rem;
    flex: none;
    place-items: center;
    border-radius: 999px;
    color: hsl(var(--bc));
    background: rgb(255 255 255 / 0.06);
  }

  .buy-etc-close :global(svg) {
    color: currentColor;
    font-size: 1.2rem;
  }

  iframe {
    width: 100%;
    min-height: 0;
    flex: 1;
    border: 0;
    background: white;
  }

  .buy-etc-empty {
    display: grid;
    flex: 1;
    place-content: center;
    gap: 0.7rem;
    padding: 1.5rem;
    text-align: center;
  }

  .buy-etc-empty :global(svg) {
    margin: auto;
    color: rgb(var(--sf-green));
    font-size: 2rem;
  }

  .buy-etc-empty p {
    font-weight: 750;
  }

  .buy-etc-empty span {
    color: hsl(var(--bc) / 0.68);
    font-size: 0.88rem;
    line-height: 1.45;
  }

  .buy-etc-empty code {
    font-size: 0.78rem;
  }
</style>
