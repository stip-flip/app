<script lang="ts">
  import "../app.css";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import autoAnimate from "@formkit/auto-animate";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  import { pendingTransactions, transactions } from "src/hooks/blocknumber";
  import { mainDefaultChainId } from "src/stores";
  import {
    chainId,
    connected,
    defaultEvmStores,
    signerAddress,
  } from "svelte-ethers-store";
  let theme = "dark";

  $: {
    // console.log(theme);
    if (browser) {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", theme);
    }
  }

  // $: console.log('ACCESS USERS\n', $accessUsers);

  onMount(() => {
    // defaultEvmStores.setProvider();
    if (browser) {
      connectWallet();
      if (localStorage?.getItem("theme")) {
        // console.log('found our local storage', localStorage.getItem('theme') || 'dark');
        theme = String(localStorage.getItem("theme") || "dark");
      } else {
        saveThemeSelection();
      }
    } else {
      console.log("window not found");
      // defaultEvmStores.setProvider();
    }
  });

  async function connectWallet() {
    try {
      await defaultEvmStores.setProvider();
      // .then((res) => sessionStorage.setItem('acct', $signerAddress));
    } catch (error) {
      console.log(error, "Something went wrong while connecting wallet");
    }
  }

  const idToChain: any = {
    1: "mainnet",
    4: "rinkeby",
    5: "goerli",
  };
  // keep this right here
  $: console.log($transactions);

  async function switchNetwork() {
    await window?.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + mainDefaultChainId.toString() }],
    });
  }

  function saveThemeSelection() {
    localStorage.setItem("theme", theme);
  }
</script>

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
        <a href={"/swap/"} class="flex items-center">
          <!-- <div class="min-w-[32px] w-fit mr-2">
								<SartorianLogo fillColor={logoColor} />
							</div>
							<div class="min-w-[180px]">
								<SartorianTypeface fillColor={typefaceColor} />
							</div> -->
          {#if theme == "dark"}
            <div class="w-40">
              <!-- <BrandDarkTheme /> -->
            </div>
          {:else}
            <div class="w-40">
              <!-- <BrandLightTheme /> -->
            </div>
          {/if}
        </a>
      </div>
      <div class="tabs space-x-6">
        <a
          href="/wallet"
          class="!border-primary tab text-primary font-bold px-1 relative"
          class:tab-active={$page.route?.id?.startsWith("/wallet")}
          class:tab-bordered={$page.route?.id?.startsWith("/wallet")}>Wallet</a
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
          class:tab-bordered={$page.route?.id?.startsWith("/faucet")}>Faucet</a
        >
        <!-- <a
            href="/manageFunds"
            class="!border-primary tab text-primary font-bold px-1 relative"
            class:tab-active={$page.route?.id?.startsWith("/manageFunds")}
            class:tab-bordered={$page.route?.id?.startsWith("/manageFunds")}
            >Manage Funds</a
          > -->
        <!-- <a
            href="/alphapool"
            class="!border-primary tab text-primary font-bold px-1 relative"
            class:tab-active={$page.route?.id?.startsWith("/alphapool")}
            class:tab-bordered={$page.route?.id?.startsWith("/alphapool")}
            >Alpha Pool</a
          > -->
        <!-- <a href="" class="!border-primary tab text-base-100 px-1 relative">Stats</a> -->

        <!-- <a
							href=""
							class="!border-primary-content tab"
							class:tab-active={$page.routeId?.startsWith('alphapool')}
							class:tab-bordered={$page.routeId?.startsWith('alphapool')}>Stats</a
						>
						<a
							href=""
							class="!border-primary-content tab"
							class:tab-active={$page.routeId?.startsWith('alphapool')}
							class:tab-bordered={$page.routeId?.startsWith('alphapool')}>Docs</a
						> -->
      </div>
    </div>
    <!-- {#if !$connected}
					<button
						on:click={connectWallet}
						class="bg-primary rounded-xl py-1 px-6 tracking-wider text-primary-content border-2 border-primary-content"
						>Connect Wallet</button
					>
				{:else} -->
    <div class="w-1/4 flex justify-end items-center space-x-4">
      <!-- <select data-choose-theme class="select select-sm" bind:value={theme}>
					<option value="forest">Ether Classic 🍀</option>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
				</select> -->
      <div class="relative">
        {#if !$connected || !$signerAddress}
          <!-- <button
								on:click={connectWallet}
								class="bg-primary rounded-xl py-1 px-6 tracking-wider text-primary-content border-2 border-primary-content"
								>Connect</button
							> -->
          <div
            class="border border-primary flex cursor-pointer items-center h-8"
          >
            <button
              on:click={connectWallet}
              class="px-4 text-primary tracking-wider flex cursor-pointer"
              >Connect Wallet</button
            >
          </div>
        {:else}
          <!-- <div
								class="absolute w-9 py-1 border-2 border-primary-content bg-base-100 rounded-full -left-3"
							>
								icon
							</div>
							<button
								on:click={defaultEvmStores.disconnect}
								class="bg-primary rounded-xl py-1 px-6 pl-10 tracking-wider text-primary-content border-2 border-primary-content"
							>
								{$signerAddress.slice(0, 5) + '...' + $signerAddress.slice(-4)}
							</button> -->
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

            <button
              class={`dropdown dropdown-bottom dropdown-end border border-primary flex cursor-pointer items-center h-8 ` +
                ($chainId != mainDefaultChainId ? "border-warning" : "")}
            >
              <Icon
                icon="logos:ethereum"
                class={`h-full py-1 w-8 border-r border-base-100 cursor-default ` +
                  ($chainId != mainDefaultChainId
                    ? "bg-warning border-warning"
                    : "bg-neutral")}
              />
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
            </button>
          </div>
        {/if}
      </div>
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
    <!-- {/if} -->
  </div>
  <slot />
</div>
