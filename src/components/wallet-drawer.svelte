<script lang="ts">
  import {
    chainId,
    connected,
    defaultEvmStores,
    signerAddress,
  } from "svelte-ethers-store";

  import { renderSVGIcon } from "@codingwithmanny/blockies";
  import { switchNetwork } from "src/lib";
  import Icon from "@iconify/svelte";
</script>

<div class="drawer drawer-end absolute z-10">
  <input id="wallet-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
  </div>
  <div class="drawer-side z-10">
    <label
      for="wallet-drawer"
      aria-label="close sidebar"
      class="drawer-overlay"
    />
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content z-10">
      <!-- Sidebar content here -->
      {#if $signerAddress}
        <div class="flex justify-between mt-8">
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
            class="btn btn-outline"
            on:click={(_) => {
              defaultEvmStores.disconnect();
              sessionStorage.removeItem("accnt");
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
          class:btn-active={$chainId == 5}
          on:click={(_) => switchNetwork(5)}
        >
          <Icon icon="mdi:ethereum" class="text-green text-2xl" />
          <span>Ethereum Goerli</span>
        </button>
      {/if}
    </ul>
  </div>
</div>
