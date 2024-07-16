<script lang="ts">
  import { modal } from "src/lib/web3";
  import { onMount } from "svelte";
  import {
    connected,
    defaultEvmStores,
    signerAddress,
  } from "svelte-ethers-store";

  let sent: boolean = false;

  async function connectWallet() {
    try {
      await defaultEvmStores.setProvider();
    } catch (error) {
      console.log(error, "Something went wrong while connecting wallet");
    }
  }

  let lastClaim: number = 0;

  async function fetchLastClaim() {
    // wait 1 seconds before fetching the last claim
    await new Promise((resolve) => setTimeout(resolve, 100));
    const res = await fetch(
      `https://faucet.sf.exchange/last-claim?to=${$signerAddress}`
    );
    // parse the response as a string
    const text = await res.text();

    console.log(text);

    lastClaim = parseInt(text);
  }

  onMount(fetchLastClaim);

  $: faucetURL = `https://faucet.sf.exchange/?to=${$signerAddress}`;
  // $: faucetURL = `http://localhost:3030/?to=${$signerAddress}`;
</script>

<div class="px-8 lg:px-0 lg:w-1/2 m-auto mt-20 lg:mt-40">
  <h1 class="text-3xl">Faucet</h1>
</div>
<div class="lg:border-2 rounded-lg p-4 bg-gradient lg:w-1/2 m-auto mt-4">
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text font-semibold mx-2 text-lg"
        >Claim your mordor ETC</span
      >
    </label>
    {#if $connected}
      {#if Date.now() / 1000 - lastClaim < 24 * 3600}
        <button class="btn btn-ghost" disabled
          >You need to wait 24 hours between each claim</button
        >
      {:else}
        <button
          class="btn btn-primary mt-4"
          on:click={(_) => fetch(faucetURL).then((res) => (sent = true))}
        >
          {sent ? "Sent!" : "Claim 1 METC"}
        </button>
      {/if}
    {:else}
      <button
        class="btn btn-primary m-auto mt-4"
        on:click={(_) => modal.open()}
      >
        Connect Wallet
      </button>
    {/if}
  </div>
</div>
