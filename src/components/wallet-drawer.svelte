<script lang="ts">
  import { chainId, signerAddress } from "svelte-ethers-store";

  import { renderSVGIcon } from "@codingwithmanny/blockies";
  import Icon from "@iconify/svelte";
  import { disconnectMetamask, switchNetwork } from "src/lib";
  import { modal } from "src/lib/web3";
  import Theme from "./theme.svelte";

  let overlay: HTMLInputElement;
</script>

<div class="drawer drawer-end absolute z-20">
  <input
    id="wallet-drawer"
    type="checkbox"
    class="drawer-toggle"
    bind:this={overlay}
  />
  <div class="drawer-content">
    <!-- Page content here -->
  </div>
  <div class="drawer-side z-20">
    <label
      for="wallet-drawer"
      aria-label="close sidebar"
      class="drawer-overlay"
    />
    <ul
      class="menu p-4 lg:w-80 w-2/3 min-h-full bg-base-200 text-base-content z-20 bg-opaque"
    >
      <!-- Sidebar content here -->
      <div class="lg:hidden flex justify-end">
        <Theme />
      </div>
      {#if $signerAddress}
        <div class="lg:flex lg:justify-between lg:mt-8">
          <div class="flex items-center space-x-2">
            <div class="rounded-full overflow-hidden">
              {#await renderSVGIcon({ seed: $signerAddress || "" }) then icon}
                {@html icon}
              {/await}
            </div>
            <span>
              {$signerAddress.slice(0, 4)}...{$signerAddress.slice(-4)}
            </span>
          </div>
          <button
            class="btn btn-outline lg:w-auto w-full lg:mt-0 mt-4"
            on:click={(_) => {
              overlay.click();
              modal.disconnect();
            }}>Disconnect</button
          >
        </div>
        <div class="divider my-8">Networks</div>

        <button
          class="btn btn-outline px-4 flex space-x-2 items-center"
          class:btn-active={$chainId == 61}
          on:click={(_) => switchNetwork(61)}
        >
          <Icon
            icon="mdi:ethereum"
            class="text-green text-2xl"
            style="color: green"
          />
          <span>Ethereum Classic</span>
        </button>

        <div class="divider my-8">Testnets</div>

        <button
          class="btn btn-outline px-4 flex space-x-2 items-center"
          class:btn-active={$chainId == 63}
          on:click={(_) => switchNetwork(63)}
        >
          <Icon icon="mdi:ethereum" class="text-green text-2xl" />
          <span>Ethereum Mordor</span>
        </button>
      {/if}
    </ul>
  </div>
</div>
