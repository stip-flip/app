<script lang="ts">
  import { page } from "$app/stores";
  import "driver.js/dist/driver.css";
  import { onMount } from "svelte";
  import "../app.css";

  import Icon from "@iconify/svelte";
  import Help from "src/components/help.svelte";
  import Logo from "src/components/logo.svelte";
  import Mode from "src/components/mode.svelte";
  import TakeATour from "src/components/take-a-tour.svelte";
  import Theme from "src/components/theme.svelte";
  import WalletDrawer from "src/components/wallet-drawer.svelte";
  import Wallet from "src/components/wallet.svelte";
  import {
    pendingTransactions,
    resolvedTransactions,
    transactions,
  } from "src/hooks/transactions";
  import { connectMetamask } from "src/lib";
  import { navigate } from "src/lib/path";
  import { chainId, connected } from "svelte-ethers-store";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";

  let overlay: HTMLAreaElement;

  let lastResolvedIndex = 0;

  onMount(() => {
    try {
      // Initial update
      updateVh();

      // Update on resize
      window.addEventListener("resize", updateVh);
      // connectMetamask();
      // defaultEvmStores.setProvider().catch((e) => console.warn(e));
    } catch (e) {
      console.warn(e);
      if ($page.route.id != "/") {
        document.getElementById("take-a-tour")?.click();
      }
    }
  });

  // keep this right here
  $: console.log($transactions);
  $: console.log($resolvedTransactions);

  $: homepage = $page.route.id == "/";

  $: url = new URL($page.url);

  $: {
    if (!!$resolvedTransactions[lastResolvedIndex]) {
      setTimeout(() => {
        lastResolvedIndex++;
      }, 5000);
    }
  }

  let docurl = "https://docs.sf.exchange/docs";

  const idToChain: any = {
    61: "etc",
    63: "etc-mordor",
  };

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
				transform: ${transform} scale(${t});
				opacity: ${t}
			`,
      };
    },
  });

  // JavaScript to update the custom property
  function updateVh() {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  }
</script>

<TakeATour />

<ul class="fixed bottom-0 right-0 z-10 m-4">
  {#each $pendingTransactions as pt (pt.hash)}
    <li
      class="mt-4"
      in:receive={{ key: pt.hash }}
      out:send={{ key: pt.hash }}
      animate:flip={{ duration: 200 }}
    >
      <div
        class="alert alert-info block space-x-2 w-62 h-24"
        class:flex={!!pt.resolved && pt.status == 1}
        class:alert-success={pt.status == 1}
      >
        {#if pt.status == 1 && pt.resolved}
          <Icon
            icon="mdi:check"
            class="text-3xl text-white bg-primary rounded-full"
          />
          <div class="inline text-base">
            {@html $resolvedTransactions[lastResolvedIndex]?.resolved}
          </div>
        {:else}
          <div class="text-base-200">{pt.label}</div>
          {#if pt.status == 1}
            <progress
              class="progress progress-success w-56 opa"
              value="100"
              max="100"
            />
          {:else}
            <progress class="progress w-56" />
          {/if}
          <a
            class="block text-xs text-right text-base-200 underline"
            target="_blank"
            rel="noreferrer"
            href={"https://" +
              idToChain[$chainId] +
              ".blockscout.com/tx/" +
              pt.hash}
          >
            View on Explorer
          </a>
        {/if}
      </div>
    </li>
  {/each}
  <Help />
</ul>

<!-- {#if $resolvedTransactions[lastResolvedIndex] && !!$resolvedTransactions[lastResolvedIndex].resolved && $resolvedTransactions[lastResolvedIndex].status == 1}
  <div class="toast z-10">
    <div class="alert alert-success flex space-x-2">
      
    </div>
  </div>
{/if} -->

<WalletDrawer />
<div class="drawer">
  <input id="app-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="fixed w-full lg:p-4 z-10">
      <div class="justify-between navbar">
        {#if homepage}
          <div class="flex items-center w-content lg:mr-8"></div>
          <div
            class="lg:w-2/3 w-full flex justify-between items-center rounded-full shadow-sm shadow-base-content bg-opacity-50 bg-gradient min-h-0 px-4"
          >
            <a href={"/"} class="flex w-1/2 items-center">
              <Logo />
            </a>
            <div class="flex space-x-4">
              <a
                href="https://docs.sf.exchange"
                class="p-1 rounded-md text-base-content hover:text-primary"
                >Documentation</a
              >
              <a
                href="/swap"
                class="p-1 rounded-md flex lg:space-x-1 hover:text-primary"
              >
                <span>App</span></a
              >
            </div>
          </div>
          <div />
          <!-- <Theme /> -->
        {:else}
          <div class="flex items-center w-content h-8 lg:mr-8 lg:w-1/3">
            <div class="flex-none lg:hidden">
              <!-- <label
                for="app-drawer"
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
              </label> -->
            </div>
            <a href={"/"} class="items-center hidden lg:flex mr-12">
              <Logo />
            </a>
            <Mode />
          </div>
          <div class="flex-none hidden lg:block">
            <ul
              class="menu menu-md menu-horizontal bg-gradient rounded-full shadow-sm shadow-base-content bg-opacity-50 lg:bg-gradient p-0"
            >
              <!-- Navbar menu content here -->
              <li id="wallet">
                <a
                  href={navigate("/wallet", url)}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/wallet")}
                  class:selected={$page.route?.id?.startsWith("/wallet")}
                  >Wallet</a
                >
              </li>
              <li id="swap">
                <a
                  href={navigate("/swap", url)}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/swap")}
                  class:selected={$page.route?.id?.startsWith("/swap")}>Swap</a
                >
              </li>
              <li id="earn">
                <a
                  href={navigate("/earn", url)}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/earn")}
                  class:selected={$page.route?.id?.startsWith("/earn")}>Earn</a
                >
              </li>
              <li>
                <a
                  href={navigate("/faucet", url)}
                  class="rounded-full"
                  class:hidden={!$connected || $chainId != 63}
                  class:text-primary={$page.route?.id?.startsWith("/faucet")}
                  class:selected={$page.route?.id?.startsWith("/faucet")}
                  >Faucet</a
                >
              </li>
            </ul>
          </div>
          <div class="lg:space-x-4 lg:w-1/3 flex justify-end">
            <Wallet />
            <span class="lg:block hidden"><Theme /></span>
          </div>
        {/if}
      </div>
    </div>
    <div
      class={!homepage
        ? "bg-2 lg:h-screen lg:root w-full overflow-scroll lg:pb-8 lg:overflow-auto mobile-height overflow-x-hidden"
        : "root h-screen bg"}
    >
      <slot />
    </div>
    <div
      class="btm-nav lg:hidden bg-transparent h-24 backdrop-blur-md"
      class:hidden={!!homepage}
      id="footer"
    >
      <a
        class:text-primary={$page.route?.id?.startsWith("/wallet")}
        href={navigate("/wallet", url)}
      >
        <Icon icon="mdi:wallet" class="text-3xl" />
        <span class="btm-nav-label text-xs">Wallet</span>
      </a>
      <a
        class:text-primary={$page.route?.id?.startsWith("/swap")}
        href={navigate("/swap", url)}
      >
        <Icon
          icon="mdi:swap-horizontal"
          class={"text-3xl border border-inherit rounded-md " +
            ($page.route?.id?.startsWith("/swap")
              ? " bg-primary border-primary !text-primary-content"
              : "")}
        />
        <span class="btm-nav-label text-xs">Swap</span>
      </a>
      <a
        class:text-primary={$page.route?.id?.startsWith("/earn")}
        href={navigate("/earn", url)}
      >
        <Icon icon="mdi:chart-line" class="text-3xl" />
        <span class="btm-nav-label text-xs">Earn</span>
      </a>
    </div>
  </div>
  <div class="drawer-side z-20">
    <label
      for="app-drawer"
      aria-label="close sidebar"
      class="drawer-overlay"
      bind:this={overlay}
    />
    <aside class="bg-opaque min-h-screen w-3/5 bg-opaque">
      <div
        class="bg-opaque grid-row-2 sticky top-0 z-10 grid w-full gap-y-2 bg-opacity-90 px-2 py-3 backdrop-blur"
      />
      <div class="px-8"><Theme /></div>
      <div class="h-4" />
      <ul class="menu px-4 py-0 text-xl">
        <li>
          <details id="disclosure-docs" open="true">
            <summary class="group font-bold"
              ><span><Logo width="1.5rem" height="1.5rem" /></span> App</summary
            >
            <ul on:click={(_) => overlay.click()}>
              <li>
                <a href="/wallet"> Wallet </a>
              </li>
              <li>
                <a href="/swap">
                  <span>Swap</span>
                </a>
              </li>
              <li>
                <a href="/earn" class="group">
                  <span>Earn</span>
                </a>
              </li>
              <li>
                <a href="/faucet" class="group">
                  <span>Faucet</span>
                </a>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <details id="disclosure-docs" open="">
            <summary class="group font-bold"
              ><span
                ><svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  class="text-info h-5 w-5"
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
            <ul on:click={(_) => overlay.click()}>
              <li>
                <a href={docurl + "/general-overview/what-is-stup&flip"}>
                  <span>General Overview</span>
                </a>
              </li>
              <ul>
                <li>
                  <a
                    href={docurl + "/general-overview/what-is-s&f"}
                    class="group"
                  >
                    <span>What is Stip & Flip</span>
                  </a>
                </li>
                <li>
                  <a
                    href={docurl + "/general-overview/key-points"}
                    class="group"
                  >
                    <span>Key Points</span>
                  </a>
                </li>
              </ul>
            </ul>
            <ul>
              <li>
                <a href={docurl + "/protocol-rules/pools"}>
                  <span>Protocol Rules</span>
                </a>
              </li>
              <ul>
                <li>
                  <a href={docurl + "/protocol-rules/pools"} class="group">
                    <span>Pools</span>
                  </a>
                </li>
                <li>
                  <a href={docurl + "/protocol-rules/swap-fees"} class="group">
                    <span>Swap fees</span>
                  </a>
                </li>
                <li>
                  <a
                    href={docurl + "/protocol-rules/funding-rate"}
                    class="group"
                  >
                    <span>Funding Rate</span>
                  </a>
                </li>
                <li>
                  <a href={docurl + "/protocol-rules/positions"} class="group">
                    <span>Positions</span>
                  </a>
                </li>
                <li>
                  <a href={docurl + "/protocol-rules/token"} class="group">
                    <span>S&F tokens</span>
                  </a>
                </li>
              </ul>
            </ul>
          </details>
        </li>
      </ul>
    </aside>
  </div>
</div>

<style>
  .selected {
    background: hsl(var(--bc) / 0.08);
  }
</style>
