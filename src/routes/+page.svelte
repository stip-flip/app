<script lang="ts">
  import { appTour } from "src/lib/driver";
  // import {} from "";
  import { modal } from "src/lib/web3";
  import { onMount } from "svelte";
  import { defaultEvmStores } from "svelte-ethers-store";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  onMount(() => {
    document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");

    setTimeout(() => {
      const p = modal.getWalletProvider();
      if (p && !defaultEvmStores.signerAddress) {
        defaultEvmStores.setProvider(p);
        // $page.url = "/wallet";
        goto("/swap");
      }
    }, 500);
  });
</script>

<!-- Slide 1 -->
<div
  class="fixed mobile-height flex flex-col items-center justify-between w-full bg-2 z-20"
>
  <img src="/icon.svg" class="w-1/2" />
  <div class="h-1/2 w-2/3 m-auto">
    <h1 class="text-2xl font-bold mb-8">Welcome to Stip&Flip!</h1>
    <ul class="list-disc">
      <li class="mb-4">Discover the future of decentralized trading.</li>
      <li class="mb-4">Trade synthetic assets securely and efficiently.</li>
      <li class="mb-4">No liquidation risk.</li>
    </ul>
  </div>
  <div class="flex items-center w-full p-4 justify-around pb-12">
    <a href="/swap" class="btn w-1/3">Maybe Later</a>
    <a
      href="/swap"
      class="btn btn-primary w-1/3"
      on:click={(_) => setTimeout((_) => appTour.drive(), 10)}>Take a tour</a
    >
  </div>
</div>

<!-- Slide 2 -->
