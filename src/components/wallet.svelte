<script lang="ts">
  import Icon from "@iconify/svelte";
  import { SUPPORTED_NETWORKS, mainDefaultChainId } from "src/stores";
  import {
    chainId,
    connected,
    defaultEvmStores,
    signerAddress,
  } from "svelte-ethers-store";

  import { renderSVGIcon } from "@codingwithmanny/blockies";
  import { switchNetwork } from "src/lib";
  import { modal } from "src/lib/web3";

  export let trades: any[] = [];

  modal.subscribeProvider((state) => {
    console.log("hey");
    if (state) {
      console.log(state);
      if (state.provider) {
        defaultEvmStores.setProvider(state.provider);
      } else {
        defaultEvmStores.disconnect();
      }
    }
  });

  $: supportedNetwork = SUPPORTED_NETWORKS.includes(Number($chainId));
</script>

<div class="relative" id="wallet-connect">
  {#if !$connected || !$signerAddress}
    <div
      class="border border-primary flex cursor-pointer items-center h-8 rounded-full"
    >
      <button
        on:click={(_) => modal.open()}
        class="px-4 text-primary tracking-wider flex cursor-pointer"
        >Connect <span class="lg:visible hidden">Wallet</span></button
      >
    </div>
  {:else}
    <div class="flex items-center relative space-x-4">
      <button
        class={`h-6 flex-col absolute -left-12 -top-1 cursor-pointer ` +
          (!supportedNetwork ? "" : "hidden")}
        on:click={(_) => {
          // alert('Switch to correct network');
          // switchNetwork();
        }}
      >
        <Icon
          icon="material-symbols:warning-outline-rounded"
          class="h-full w-fit m-auto text-warning"
        />
        <p class="text-xs text-warning">Network</p>
      </button>
      <label
        for="wallet-drawer"
        class:border-warning={!supportedNetwork}
        class="border border-primary rounded-full flex cursor-pointer items-center h-8 bg-gradient"
      >
        <div
          class="text-primary tracking-wider px-4 hidden lg:inline-block"
          class:text-warning={!supportedNetwork}
        >
          {$signerAddress.slice(0, 6) + "..." + $signerAddress.slice(-4)}
        </div>
        <div
          class="text-primary tracking-wider lg:hidden overflow-hidden rounded-full"
          class:text-warning={!supportedNetwork}
        >
          {#await renderSVGIcon({ seed: $signerAddress || "" }) then icon}
            {@html icon}
          {/await}
        </div>
        <Icon icon="mdi:ethereum" class="h-full py-1 w-8" />
      </label>
    </div>
  {/if}
</div>
