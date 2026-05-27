<script lang="ts">
  import { page } from "$app/stores";
  import "driver.js/dist/driver.css";
  import { onMount } from "svelte";
  import "../app.css";

  import Icon from "@iconify/svelte";
  import Help from "src/components/help.svelte";
  import Logo from "src/components/logo.svelte";
  import MeshGrid from "src/components/mesh-grid.svelte";
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

  import { navigate } from "src/lib/path";
  import { networkInfos } from "src/stores";
  import { chainId, connected } from "svelte-ethers-store";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { goto } from "$app/navigation";

  let overlay: HTMLAreaElement;

  let lastResolvedIndex = 0;
  $: transactionWatcher = $transactions;

  type GridRunner = {
    id: number;
    direction: "horizontal" | "vertical";
    line: number;
    duration: number;
    delay: number;
    cycle: number;
  };

  let gridRunners: GridRunner[] = [];

  onMount(() => {
    try {
      // Initial update
      updateVh();
      resetGridRunners();

      // Update on resize
      window.addEventListener("resize", updateVh);
      window.addEventListener("resize", resetGridRunners);
      // connectMetamask();
      // defaultEvmStores.setProvider().catch((e) => console.warn(e));
    } catch (e) {
      console.warn(e);
      if ($page.route.id != "/") {
        document.getElementById("take-a-tour")?.click();
      }
    }

    return () => {
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("resize", resetGridRunners);
    };
  });

  $: homepage = $page.route.id == "/";

  $: url = new URL($page.url);

  $: {
    if (!!$resolvedTransactions[lastResolvedIndex]) {
      setTimeout(() => {
        lastResolvedIndex++;
      }, 5000);
    }
  }

  let docurl = "https://docs.stipflip.xyz/docs";

  $: explorerUrl = networkInfos[$chainId]?.explorer;

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

  function createGridRunner(id: number, delay = 0): GridRunner {
    const direction = Math.random() > 0.45 ? "horizontal" : "vertical";
    const maxLine = direction === "horizontal" ? window.innerHeight : window.innerWidth;
    const line = Math.max(0, Math.floor(Math.random() * Math.ceil(maxLine / 44)) * 44);

    return {
      id,
      direction,
      line,
      duration: 4600 + Math.round(Math.random() * 2200),
      delay,
      cycle: Date.now() + id + Math.random(),
    };
  }

  function resetGridRunners() {
    gridRunners = Array.from({ length: 5 }, (_, id) => createGridRunner(id, id * 900));
  }

  function refreshGridRunner(id: number) {
    gridRunners = gridRunners.map((runner) =>
      runner.id === id ? createGridRunner(id, 350 + Math.round(Math.random() * 1800)) : runner
    );
  }
</script>

{#if !homepage}
  <TakeATour />
{/if}

<ul class="transaction-stack fixed bottom-0 right-0 z-10 m-4">
  {#each $pendingTransactions as pt (pt.hash)}
    <li
      class="mt-3"
      in:receive={{ key: pt.hash }}
      out:send={{ key: pt.hash }}
      animate:flip={{ duration: 200 }}
    >
      <div
        class="transaction-card"
        class:transaction-card--settled={pt.status == 1}
        class:transaction-card--failed={pt.status === 0}
      >
        {#if pt.status == 1 && pt.resolved}
          <Icon
            icon="mdi:check"
            class="transaction-card__status transaction-card__status--settled"
          />
          <div class="transaction-card__body">
            <div class="transaction-card__eyebrow">Settled</div>
            <div class="transaction-card__title">
              {@html $resolvedTransactions[lastResolvedIndex]?.resolved}
            </div>
          </div>
        {:else}
          <Icon
            icon={pt.status === 0 ? "mdi:alert-circle-outline" : "mdi:clock-outline"}
            class={"transaction-card__status" +
              (pt.status === 0 ? " transaction-card__status--failed" : "")}
          />
          <div class="transaction-card__body">
            <div class="transaction-card__meta">
              <span class="transaction-card__eyebrow">
                {pt.status === 0 ? "Transaction failed" : "Transaction pending"}
              </span>
              {#if explorerUrl}
                <a
                  class="transaction-card__link"
                  target="_blank"
                  rel="noreferrer"
                  href={explorerUrl + "tx/" + pt.hash}
                >
                  <Icon icon="mdi:open-in-new" />
                  <span>Explorer</span>
                </a>
              {/if}
            </div>
            <div class="transaction-card__title">{pt.label}</div>
            <div class="transaction-card__hash">{pt.hash.slice(0, 10)}...{pt.hash.slice(-8)}</div>
            <div class="transaction-card__track">
              <div
                class="transaction-card__bar"
                class:transaction-card__bar--complete={pt.status == 1}
                class:transaction-card__bar--failed={pt.status === 0}
              ></div>
            </div>
          </div>
        {/if}
      </div>
    </li>
  {/each}
  {#if $pendingTransactions.length == 0}
    <Help />
  {/if}
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
    {#if !homepage}
      <div class="fixed w-full p-3 lg:p-4 z-10" id="navbar">
        <div class="justify-between navbar">
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
              class="menu menu-md menu-horizontal app-nav rounded-full p-1"
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
              <li id="stake">
                <a
                  href={navigate("/oracles", url)}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/oracle") ||
                    $page.route?.id?.startsWith("/oracles")}
                  class:selected={$page.route?.id?.startsWith("/oracle") ||
                    $page.route?.id?.startsWith("/oracles")}
                  >Oracles</a
                >
              </li>
              <li id="markets">
                <a
                  href={navigate("/markets", url)}
                  class="rounded-full"
                  class:text-primary={$page.route?.id?.startsWith("/markets")}
                  class:selected={$page.route?.id?.startsWith("/markets")}>Markets</a
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
        </div>
      </div>
    {/if}
    <div
      class={homepage
        ? "app-background bg-2 min-h-screen w-full overflow-x-hidden"
        : "app-background bg-2 lg:h-screen w-full overflow-scroll lg:pb-8 lg:overflow-auto mobile-height overflow-x-hidden"}
    >
      <div class="grid-current-layer" aria-hidden="true">
        <MeshGrid />
        {#each gridRunners as runner (runner.cycle)}
          <span
            class={"grid-current-runner grid-current-runner--" + runner.direction}
            style={`--line: ${runner.line}px; --duration: ${runner.duration}ms; --delay: ${runner.delay}ms;`}
            on:animationend={() => refreshGridRunner(runner.id)}
          ></span>
        {/each}
      </div>
      <slot />
    </div>
    <div
      class="btm-nav lg:hidden app-nav h-24 pb-8 rounded-t-3xl"
      class:hidden={!!homepage}
      id="footer"
    >
      <a
        class:text-primary={$page.route?.id?.startsWith("/wallet")}
        href={navigate("/wallet", url)}
        on:click|preventDefault={() => goto(navigate("/wallet", url))}
      >
        <Icon icon="mdi:wallet" class="text-3xl" />
        <span class="btm-nav-label text-xs">Wallet</span>
      </a>
      <a
        class:text-primary={$page.route?.id?.startsWith("/swap")}
        href={navigate("/swap", url)}
        on:click|preventDefault={() => goto(navigate("/swap", url))}
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
        on:click|preventDefault={() => goto(navigate("/earn", url))}
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
    <aside class="bg-opaque min-h-screen w-3/5">
      <div
        class="bg-opaque grid-row-2 sticky top-0 z-10 grid w-full gap-y-2 bg-opacity-90 px-2 py-3"
      />
      <div class="px-8"><Theme /></div>
      <div class="h-4" />
      <ul class="menu px-4 py-0 text-xl app-drawer-menu">
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
              <li>
                <a href="/markets" class="group">
                  <span>Stats</span>
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
                <a href={docurl + "/general-overview/what-is-s&f"}>
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
                  <a href={docurl + "/protocol-rules/fees"} class="group">
                    <span>Swap fees</span>
                  </a>
                </li>
                <li>
                  <a
                    href={docurl + "/protocol-rules/fees#funding-rate"}
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

  .transaction-stack {
    width: min(24rem, calc(100vw - 2rem));
  }

  .transaction-card {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    overflow: hidden;
    border: 1px solid rgb(var(--sf-border) / 0.12);
    border-radius: 0.5rem;
    padding: 0.875rem;
    background:
      linear-gradient(145deg, rgb(43 43 43 / 0.92), rgb(36 36 36 / 0.82)),
      rgb(var(--sf-panel) / 0.86);
    box-shadow:
      0 18px 48px rgb(0 0 0 / 0.18),
      inset 0 1px 0 rgb(var(--sf-border) / 0.07);
    color: rgb(239 239 239);
    backdrop-filter: blur(18px);
  }

  .transaction-card--settled {
    border-color: rgb(var(--sf-green) / 0.28);
  }

  .transaction-card--failed {
    border-color: rgb(248 113 113 / 0.28);
  }

  :global(.transaction-card__status) {
    flex: 0 0 auto;
    width: 1.5rem;
    height: 1.5rem;
    color: rgb(var(--sf-green));
  }

  :global(.transaction-card__status--settled) {
    border-radius: 999px;
    background: rgb(var(--sf-green) / 0.14);
    padding: 0.2rem;
  }

  :global(.transaction-card__status--failed) {
    color: rgb(248 113 113);
  }

  .transaction-card__body {
    min-width: 0;
    flex: 1 1 auto;
  }

  .transaction-card__meta {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
  }

  .transaction-card__eyebrow {
    color: rgb(var(--sf-green));
    font-size: 0.68rem;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .transaction-card__title {
    color: rgb(255 255 255 / 0.9);
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.25;
  }

  .transaction-card__hash {
    margin-top: 0.25rem;
    color: rgb(239 239 239 / 0.58);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 0.72rem;
    line-height: 1.2;
  }

  .transaction-card__link {
    display: inline-flex;
    flex: 0 0 auto;
    gap: 0.25rem;
    align-items: center;
    color: rgb(239 239 239 / 0.72);
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
  }

  .transaction-card__link:hover {
    color: rgb(var(--sf-green));
  }

  .transaction-card__track {
    position: relative;
    overflow: hidden;
    height: 0.2rem;
    margin-top: 0.75rem;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.1);
  }

  .transaction-card__bar {
    position: absolute;
    inset: 0 auto 0 0;
    width: 45%;
    border-radius: inherit;
    background: linear-gradient(90deg, transparent, rgb(var(--sf-green)), transparent);
    animation: transaction-pending 1.2s ease-in-out infinite;
  }

  .transaction-card__bar--complete {
    width: 100%;
    background: rgb(var(--sf-green));
    animation: none;
  }

  .transaction-card__bar--failed {
    width: 100%;
    background: rgb(248 113 113);
    animation: none;
  }

  :global([data-theme="light"]) .transaction-card {
    border-color: rgb(36 36 36 / 0.14);
    background:
      linear-gradient(145deg, rgb(255 255 255 / 0.94), rgb(229 229 229 / 0.88)),
      rgb(255 255 255 / 0.82);
    box-shadow:
      0 18px 48px rgb(36 40 51 / 0.1),
      inset 0 1px 0 rgb(255 255 255 / 0.9);
    color: rgb(var(--sf-ink));
  }

  :global([data-theme="light"]) .transaction-card__title {
    color: rgb(var(--sf-ink));
  }

  :global([data-theme="light"]) .transaction-card__hash,
  :global([data-theme="light"]) .transaction-card__link {
    color: rgb(var(--sf-ink) / 0.62);
  }

  @keyframes transaction-pending {
    0% {
      transform: translateX(-100%);
    }

    100% {
      transform: translateX(230%);
    }
  }
</style>
