<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import autoAnimate from "@formkit/auto-animate";
  import { onMount } from "svelte";
  import "../app.css";

  import Icon from "@iconify/svelte";
  import Logo from "src/components/logo.svelte";
  import Wallet from "src/components/wallet.svelte";
  import Theme from "src/components/theme.svelte";
  import { pendingTransactions, transactions } from "src/hooks/blocknumber";
  import { chainId, defaultEvmStores, connected } from "svelte-ethers-store";
  let theme = "dark";
  let toggled = false;

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

  $: homepage = $page.route.id == "/";
</script>

<!-- This is an example component -->
<!-- <div class="w-full fixed">
  <nav class="px-2">
    <div class="container mx-auto flex flex-wrap items-center justify-between">
      <a href={"/"} class="flex items-center">
        <Logo />
      </a>
      <div class="flex md:order-2">
        <button
          data-collapse-toggle="mobile-menu-3"
          type="button"
          class="md:hidden focus:outline-none focus:ring-2 rounded-lg inline-flex items-center justify-center"
          aria-controls="mobile-menu-3"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <Icon class="text-2xl" icon="mingcute:menu-fill" />
        </button>
      </div>
      <div
        class="hidden md:flex justify-between items-center w-full md:w-auto md:order-1"
        id="mobile-menu-3"
      >
        <ul
          class="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium"
        >
          <li>
            <a
              href="/wallet"
              class="!border-primary tab text-primary font-bold px-1 relative"
              class:tab-active={$page.route?.id?.startsWith("/wallet")}
              class:tab-bordered={$page.route?.id?.startsWith("/wallet")}
              >Wallet</a
            >
          </li>
          <li>
            <a
              href={`/swap/`}
              class="!border-primary tab text-primary font-bold px-1 relative"
              class:tab-active={$page.route?.id?.startsWith("/swap")}
              class:tab-bordered={$page.route?.id?.startsWith("/swap")}>Swap</a
            >
          </li>
          <li>
            <a
              href={`/earn/`}
              class="!border-primary tab text-primary font-bold px-1 relative"
              class:tab-active={$page.route?.id?.startsWith("/earn")}
              class:tab-bordered={$page.route?.id?.startsWith("/earn")}>Earn</a
            >
          </li>
          <li>
            <a
              href={`/faucet/`}
              class="!border-primary tab text-primary font-bold px-1 relative"
              class:tab-active={$page.route?.id?.startsWith("/faucet")}
              class:tab-bordered={$page.route?.id?.startsWith("/faucet")}
              >Faucet</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div> -->

<div class="drawer">
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="w-full justify-between navbar bg-transparent fixed">
      {#if homepage}
        <div class="flex items-center w-content h-8 mr-8">
          <a href={"/"} class="flex items-center">
            <Logo />
          </a>
        </div>
        <div class="w-1/4 flex justify-end items-center space-x-4">
          <a
            href="https://sf-doc.vercel.app"
            class="btn-info font-bold p-1 px-2 rounded-md">Documentation</a
          >
          <a
            href="/swap"
            class="btn-primary font-bold p-1 px-2 rounded-md flex lg:space-x-1"
            ><span class="hidden lg:inline-block">Launch</span>
            <span>App</span></a
          >
          <Theme />
        </div>
      {:else}
        <div class="flex items-center w-content h-8 mr-8">
          <div class="flex-none lg:hidden">
            <label
              for="my-drawer-3"
              aria-label="open sidebar"
              class="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-6 h-6 stroke-primary"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                /></svg
              >
            </label>
          </div>
          <a href={"/"} class="flex items-center">
            <Logo />
          </a>
        </div>
        <div class="flex-none hidden lg:block">
          <ul class="menu menu-horizontal">
            <!-- Navbar menu content here -->
            <li>
              <a
                href="/wallet"
                class=""
                class:tab-active={$page.route?.id?.startsWith("/wallet")}
                class:tab-bordered={$page.route?.id?.startsWith("/wallet")}
                >Wallet</a
              >
            </li>
            <li>
              <a
                href={`/swap/`}
                class=""
                class:tab-active={$page.route?.id?.startsWith("/swap")}
                class:tab-bordered={$page.route?.id?.startsWith("/swap")}
                >Swap</a
              >
            </li>
            <li>
              <a
                href={`/earn/`}
                class=""
                class:tab-active={$page.route?.id?.startsWith("/earn")}
                class:tab-bordered={$page.route?.id?.startsWith("/earn")}
                >Earn</a
              >
            </li>
            <li>
              <a
                href={`/faucet/`}
                class=""
                class:tab-active={$page.route?.id?.startsWith("/faucet")}
                class:tab-bordered={$page.route?.id?.startsWith("/faucet")}
                >Faucet</a
              >
            </li>
          </ul>
        </div>
        <div class="space-x-4">
          <Wallet />
          <Theme />
        </div>
      {/if}
    </div>
    <slot />
  </div>
  <div class="drawer-side">
    <label
      for="my-drawer-3"
      aria-label="close sidebar"
      class="drawer-overlay"
    />
    <aside class="bg-base-100 min-h-screen w-80">
      <div
        class="bg-base-100 grid-row-2 sticky top-0 z-10 grid w-full gap-y-2 bg-opacity-90 px-2 py-3 backdrop-blur"
      />
      <div class="h-4" />
      <ul class="menu px-4 py-0">
        <li>
          <details id="disclosure-docs" open="">
            <summary class="group"
              ><span
                ><svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  class="text-orange-400 h-5 w-5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    d="M5 7H16C20.4183 7 24 10.5817 24 15V42C24 38.6863 21.3137 36 18 36H5V7Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linejoin="bevel"
                  /><path
                    d="M43 7H32C27.5817 7 24 10.5817 24 15V42C24 38.6863 26.6863 36 30 36H43V7Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linejoin="bevel"
                  /></svg
                ></span
              > Docs</summary
            >
            <ul>
              <li>
                <a href="/docs/install/" class="group active">
                  <span>Install</span>
                </a>
              </li>
              <li>
                <a href="/docs/use/" class="group">
                  <span>Use</span>
                </a>
              </li>
              <li>
                <a href="/docs/customize/" class="group">
                  <span>Customize components</span>
                </a>
              </li>
              <li>
                <a href="/docs/config/" class="group">
                  <span>Config</span>
                  <span class="badge badge-sm font-mono lowercase">updated</span
                  >
                </a>
              </li>
              <li>
                <a href="/docs/colors/" class="group">
                  <span>Colors</span>
                  <span class="badge badge-sm font-mono lowercase">updated</span
                  >
                </a>
              </li>
              <li>
                <a href="/docs/themes/" class="group">
                  <span>Themes</span>
                  <span class="badge badge-sm font-mono lowercase">updated</span
                  >
                </a>
              </li>
              <li>
                <a href="/docs/utilities/" class="group">
                  <span>Utilities</span>
                  <span class="badge badge-sm font-mono lowercase">new</span>
                </a>
              </li>
              <li>
                <a href="/docs/layout-and-typography/" class="group">
                  <span>Layout &amp; Typography</span>
                </a>
              </li>
            </ul>
          </details>
        </li>
      </ul>
      <div
        class="bg-base-100 pointer-events-none sticky bottom-0 flex h-40 [mask-image:linear-gradient(transparent,#000000)]"
      />
    </aside>
  </div>
</div>

<!-- {#if $page.route.id == "/"}
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
{/if} -->
