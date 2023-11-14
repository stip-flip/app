<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import autoAnimate from "@formkit/auto-animate";
  import { onMount } from "svelte";
  import "../app.css";

  import Icon from "@iconify/svelte";
  import Logo from "src/components/logo.svelte";
  import Wallet from "src/components/wallet.svelte";
  import { pendingTransactions, transactions } from "src/hooks/blocknumber";
  import { chainId, defaultEvmStores } from "svelte-ethers-store";
  let theme = "dark";

  $: {
    if (browser) {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", theme);
    }
  }

  onMount(() => {
    try {
      defaultEvmStores.setProvider().catch((e) => console.warn(e));
    } catch (e) {
      console.warn(e);
    }
  });

  const idToChain: any = {
    1: "mainnet",
    5: "goerli",
  };
  // keep this right here
  $: console.log($transactions);

  function saveThemeSelection() {
    localStorage.setItem("theme", theme);
  }
</script>

{#if $page.route.id == "/"}
  <div
    class={`m-auto fixed flex items-stretch justify-between py-4 px-8 border-b border-primary/5 w-full bg-gradient z-10 min-w-[72rem]`}
  >
    <div class="flex items-center w-full">
      <div class="flex items-center w-content h-8 mr-8">
        <a href={"/"} class="flex items-center">
          <Logo />
        </a>
      </div>
    </div>
    <div class="w-1/4 flex justify-end items-center space-x-4">
      <a
        href="https://sf-doc.vercel.app"
        class="btn-info font-bold p-1 px-2 rounded-md">Documentation</a
      >
      <a href="/swap" class="btn-primary font-bold p-1 px-2 rounded-md"
        >Launch App</a
      >
      <button
        on:click={(_) => {
          if (theme == "dark") {
            theme = "light";
            saveThemeSelection();
          } else if (theme == "light") {
            theme = "dark";
            saveThemeSelection();
          }
        }}
        class="border border-primary h-8 w-8 p-1 flex items-center justify-center hover:bg-base-100 cursor-pointer"
      >
        {#if theme === "dark"}
          <Icon icon="ph:moon-bold" class="w-fit h-fit text-primary" />
        {:else if theme === "light"}
          <Icon icon="ph:sun-bold" class="w-fit h-fit text-primary" />
        {/if}
      </button>
    </div>
  </div>
  <slot />
{:else}
  <div class="root overflow-auto full-height">
    <div class="fixed z-50 bottom-4 right-4">
      <div use:autoAnimate>
        {#each $pendingTransactions as pt (pt.hash)}
          <div class="p-4 bg-warning m-2">
            <div class="text-base-200">{pt.label}</div>
            <progress class="progress w-56" />
            <a
              class="block text-xs text-right text-base-200 underline"
              target="_blank"
              rel="noreferrer"
              href={"https://" +
                idToChain[$chainId] +
                ".etherscan.io/tx/" +
                pt.hash}
            >
              View on Explorer
            </a>
          </div>
        {/each}
      </div>
    </div>
    <div
      class={`m-auto fixed flex items-stretch justify-between py-4 px-8 border-b border-primary/5 w-full bg-gradient z-10 min-w-[72rem]`}
    >
      <div class="flex items-center w-full">
        <div class="flex items-center w-content h-8 mr-8">
          <a href={"/"} class="flex items-center">
            <Logo />
          </a>
        </div>
        <div class="tabs space-x-6">
          <a
            href="/wallet"
            class="!border-primary tab text-primary font-bold px-1 relative"
            class:tab-active={$page.route?.id?.startsWith("/wallet")}
            class:tab-bordered={$page.route?.id?.startsWith("/wallet")}
            >Wallet</a
          >
          <a
            href={`/swap/`}
            class="!border-primary tab text-primary font-bold px-1 relative"
            class:tab-active={$page.route?.id?.startsWith("/swap")}
            class:tab-bordered={$page.route?.id?.startsWith("/swap")}>Swap</a
          >
          <a
            href={`/earn/`}
            class="!border-primary tab text-primary font-bold px-1 relative"
            class:tab-active={$page.route?.id?.startsWith("/earn")}
            class:tab-bordered={$page.route?.id?.startsWith("/earn")}>Earn</a
          >
          <a
            href={`/faucet/`}
            class="!border-primary tab text-primary font-bold px-1 relative"
            class:tab-active={$page.route?.id?.startsWith("/faucet")}
            class:tab-bordered={$page.route?.id?.startsWith("/faucet")}
            >Faucet</a
          >
        </div>
      </div>
      <div class="w-1/4 flex justify-end items-center space-x-4">
        <Wallet />
        <button
          on:click={(_) => {
            if (theme == "dark") {
              theme = "light";
              saveThemeSelection();
            } else if (theme == "light") {
              theme = "dark";
              saveThemeSelection();
            }
          }}
          class="cursor-pointer"
        >
          {#if theme === "dark"}
            <Icon icon="ph:moon-bold" class="text-3xl text-primary" />
          {:else if theme === "light"}
            <Icon icon="ph:sun-bold" class="text-3xl text-primary" />
          {/if}
        </button>
      </div>
    </div>
    <slot />
  </div>
{/if}
