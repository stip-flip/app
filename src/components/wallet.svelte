<script lang="ts">
  import Icon from "@iconify/svelte";
  import { mainDefaultChainId } from "src/stores";
  import {
    chainId,
    connected,
    defaultEvmStores,
    signerAddress,
  } from "svelte-ethers-store";

  export let trades: any[] = [];

  async function switchNetwork() {
    await window?.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + mainDefaultChainId.toString() }],
    });
  }

  async function connectWallet() {
    try {
      await defaultEvmStores.setProvider();
      // .then((res) => sessionStorage.setItem('acct', $signerAddress));
    } catch (error) {
      console.log(error, "Something went wrong while connecting wallet");
    }
  }
</script>

<div class="relative">
  {#if !$connected || !$signerAddress}
    <div class="border border-primary flex cursor-pointer items-center h-8">
      <button
        on:click={connectWallet}
        class="px-4 text-primary tracking-wider flex cursor-pointer"
        >Connect Wallet</button
      >
    </div>
  {:else}
    <div class="flex items-center space-x-3 relative">
      <button
        class={`h-6 flex-col absolute -left-12 -top-1 cursor-pointer ` +
          ($chainId != mainDefaultChainId ? "" : "hidden")}
        on:click={(_) => {
          // alert('Switch to correct network');
          switchNetwork();
        }}
      >
        <Icon
          icon="material-symbols:warning-outline-rounded"
          class="h-full w-fit m-auto text-warning"
        />
        <p class="text-xs text-warning">Network</p>
      </button>

      <div
        class:border-warning={$chainId != mainDefaultChainId}
        class="dropdown dropdown-bottom dropdown-end border border-primary rounded-full flex cursor-pointer items-center h-8"
      >
        <button
          class={`text-primary tracking-wider px-4 ` +
            ($chainId != mainDefaultChainId ? "text-warning" : "")}
          >{$signerAddress.slice(0, 6) +
            "..." +
            $signerAddress.slice(-4)}</button
        >
        <ul
          tabIndex={0}
          class="dropdown-content menu p-2 shadow bg-secondary border border-primary w-full !top-8"
        >
          <button
            on:click={(_) => {
              defaultEvmStores.disconnect();
              sessionStorage.removeItem("accnt");
            }}
          >
            <li>
              <p>Disconnect</p>
            </li>
          </button>
        </ul>
        <Icon icon="mdi:ethereum" class="h-full py-1 w-8 cursor-default" />
      </div>
    </div>
  {/if}
</div>
