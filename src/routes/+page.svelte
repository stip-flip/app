<script lang="ts">
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import Countdown from "src/components/countdown.svelte";
  import LiquidityChart from "src/components/liquidity-chart.svelte";
  import { onMount } from "svelte";
  import { Parallax, ParallaxLayer, StickyLayer } from "svelte-parallax";

  onMount(() => {
    document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
  });

  let mode = "market";

  const icons = [
    "/S-USD.svg",
    "/S-BTC.svg",
    "/S-BTC³.svg",
    "/S-ETH².svg",
    "/F-ETH³.svg",
    "/S-SOL.svg",
    "/F-BTC².svg",
    // "/S-ETH.svg",
    // "/F-DOGE.svg",
    // "/S-DOGE.svg",
    // "/F-XMR.svg",
    // "/S-SOL².svg",
  ];

  const iconName = [
    "Stip-USD",
    "Stip-BTC",
    "Stip-BTC³",
    "Stip-ETH²",
    "Flip-ETH³",
    "Stip-SOL",
    "Flip-BTC²",
    // "Stip-ETH",
    // "Flip-DOGE",
    // "Stip-DOGE",
    // "Flip-XMR",
    // "Stip-SOL²",
  ];

  const iconSquared = ["/S-ETH².svg", "/F-BTC².svg", "/S-SOL².svg"];

  const iconNameSquared = ["Stip-ETH²", "Flip-BTC²", "Stip-SOL²"];

  const iconCubed = ["/S-BTC³.svg", "/F-ETH³.svg"];
  const iconNameCubed = ["Stip-BTC³", "Flip-ETH³"];

  const iconFlip = ["/F-DOGE.svg", "/F-XMR.svg", "/F-BTC.svg", "/F-ETH.svg"];

  const iconNameFlip = ["Flip-DOGE", "Flip-XMR", "Flip-BTC", "Flip-ETH"];

  const iconsTranslate = [2, 4, 3, 9, 1, 7];

  import { spring } from "svelte/motion";
  import { fade } from "svelte/transition";

  $: FR = spring(500, { stiffness: 0.1, damping: 0.8 });

  let ticks = {
    0: 1000,
    50: 1000,
    100: 200,
    240: 600,
    350: 800,
    500: 100,
    600: 200,
  };

  let leveraged = [
    "/S-ETH².svg",
    "/F-BTC².svg",
    "/S-SOL².svg",
    "/F-ETH.svg",
    "/S-DOGE².svg",
    "/F-SOL.svg",
    "/F-XMR².svg",
    "/S-BTC.svg",
  ];

  const onChartProgress = (progress: number) => {
    FR.set(progress * 1000);
  };

  let parallax: Parallax;
</script>

<Parallax sections={20} bind:this={parallax}>
  <ParallaxLayer rate={1} offset={0}>
    <div class="absolute w-full flex justify-center z-0">
      <img src="/icon.svg" class="w-1/4 lg:m-0 mt-24" />
    </div>
  </ParallaxLayer>
  <ParallaxLayer rate={1} offset={0} let:progress>
    <div
      class="text-center lg:text-start lg:mt-0 lg:left-28 h-full flex justify-between flex-col"
    >
      <div class="lg:w-full h-1/2 m-auto flex items-end">
        <div class="mx-auto mb-8">
          <!-- <h1 class="lg:text-6xl text-3xl text-center w-full padauk font-bold">
            S&F
          </h1> -->
          <h2
            class="lg:mt-8 mt-2 lg:text-8xl text-3xl lg:px-0 px-4 text-base-content text-center"
          >
            Trade <strong class="text-primary">everything</strong>
          </h2>
          <p class="text-center mt-8">
            Stip&Flip is the leading DeFi protocol for decentralized and
            permissionless asset tokenisation.
          </p>
          <p class="text-center">
            Trade any synthetic indices or earn by providing liquidity.
          </p>

          <div
            class="flex lg:justify-center space-x-2 lg:mt-8 lg:px-0 px-8 z-20"
          >
            <div class="flex space-x-4 w-1/4">
              <a href="https://github.com/stip-flip" target="_blank"
                ><Icon class="lg:text-4xl text-2xl" icon="mdi:github" /></a
              >
              <a href="https://twitter.com/stipflip" target="_blank">
                <Icon class="lg:text-4xl text-2xl" icon="mdi:twitter" /></a
              >
              <!-- <a href="https://twitter.com/stipflip" target="_blank">
                <Icon class="lg:text-2xl text-xl mt-2" icon="bi:substack" /></a
              > -->
            </div>
            <!-- <div class="flex-grow w-1/4" /> -->
          </div>
        </div>
      </div>
      <div class="lg:h-1/3 w-full flex justify-center items-end">
        <Countdown />
      </div>

      <div class="lg:h-1/4 h-1/6">
        <!-- call to scroll -->
        <div
          class="animate-bounce h-8 mx-auto absolute w-full justify-center flex bottom-4"
        >
          <Icon
            icon="fluent:triangle-down-32-regular"
            class="text-4xl text-primary"
          />
        </div>
        <div>
          <div class="flex w-full absolute bottom-4">
            {#each Array.from({ length: 10 }) as _, i}
              <div class="lg:min-w-32 lg:min-h-32">
                <img src="/golden-gate-bridge.svg" />
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div></ParallaxLayer
  >

  <StickyLayer rate={2} offset={{ top: 1, bottom: 20 }} let:progress>
    <div class="bg-2 h-full"></div>
  </StickyLayer>

  <StickyLayer rate={1} offset={{ top: 1, bottom: 9 }} let:progress>
    <div
      class="lg:flex lg:items-center lg:justify-center lg:p-8 lg:w-2/3 m-auto"
    >
      <div
        class="lg:w-1/2 lg:h-32 h-32 lg:mt-24 mt-16 relative lg:px-0 px-4 text-center lg:text-right"
      >
        {#if progress < 0.1}
          <span />
        {:else if progress < 0.3}
          <div class="" in:fade>
            <h3 class="text-primary lg:text-5xl text-2xl">
              Innovative Oracle system
            </h3>
            <div class="lg:py-4 lg:text-base text-sm">
              <p>With our groundbreaking proof of stake oracle contract</p>
              <p>Now you can trade any indices</p>
              <p>And earn by becoming an Oracle Operator</p>
            </div>
            <a
              class="lg:btn lg:btn-outline hidden"
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.sf.exchange/docs/protocol-rules/data-provider"
              >Learn More</a
            >
          </div>
        {:else if progress < 0.6}
          <div class="">
            {#if progress < 0.45}
              <h3 id="market" class="text-primary lg:text-5xl text-2xl">
                Trade on the <strong class="text-primary">Market</strong>
              </h3>
              <p class="lg:py-4">As you would on any other DEX</p>
              <a
                class="lg:btn lg:btn-outline hidden"
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.sf.exchange/docs/protocol-rules/trader"
                >Learn More</a
              >
            {:else}
              <h3 id="otc" class="text-primary lg:text-5xl text-2xl">
                <strong class="text-primary">Over The Counter</strong>
              </h3>
              <p class="lg:py-4">
                Your trade will be active at the next Oracle price with no
                slippage
              </p>
              <a
                class="lg:btn lg:btn-outline hidden"
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.sf.exchange/docs/protocol-rules/trader"
                >Learn More</a
              >
            {/if}
          </div>
        {:else if progress < 0.8}
          <div class="">
            <h3 id="leverage" class="text-primary lg:text-5xl text-2xl">
              on <strong>Leverage</strong>
            </h3>
            <div class="lg:py-4">
              <p>Discover squared and cubed trading</p>
              <p>Increase your position volatility with no liquidation risk</p>
            </div>
            <a
              class="lg:btn lg:btn-outline hidden"
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.sf.exchange/docs/protocol-rules/leverage"
              >Learn More</a
            >
          </div>
        {:else}
          <div class="">
            <h3 id="flip" class="text-primary lg:text-5xl text-2xl">
              on <strong>Reverse</strong>
            </h3>
            <div class="lg:py-4">
              <p>
                A flip is an instrument that inversely tracks the price of an
                asset
              </p>
            </div>
          </div>
        {/if}
      </div>

      <div
        class="border-4 border-black bg-base-300 py-4 px-2 lg:mt-36 overflow-visible lg:h-auto lg:w-auto w-64 m-auto"
        style="border-radius: 2.5rem; transform: skewX({-30 *
          Math.max(0, 1 - 8 * progress)}deg) skewY({30 *
          Math.max(0, 1 - 8 * progress)}deg) rotateX({-30 *
          Math.max(0, 1 - 8 * progress)}deg) rotateY({30 *
          Math.max(0, 1 - 8 * progress)}deg) translateX(-{100 *
          Math.max(0, 1 - 8 * progress)}px)"
      >
        <div class="bg-black rounded-full h-5 w-2/5 mx-auto" />

        <ul
          class="relative menu menu-sm menu-horizontal rounded-full bg-opacity-50 p-0 fine-border mt-4"
          id="modes"
          style="transform: translate({100 *
            Math.min(0, 8 * progress - 1) *
            3}px, 0);"
        >
          <div
            class="absolute w-1/2 h-full rounded-full transition-all left-1/2 selected"
            class:!left-0={progress > 0.3 && progress < 0.45}
            class:border={progress > 0.3 && progress < 0.6}
            class:border-primary={progress > 0.3 && progress < 0.6}
          ></div>
          <li id="market-mode">
            <a
              class="rounded-full w-20 text-center block"
              class:text-primary={progress > 0.3 && progress < 0.45}
              on:click={() =>
                parallax.scrollTo(5, {
                  duration: 500,
                })}
            >
              Market
            </a>
          </li>
          <li id="otc-mode">
            <a
              class="rounded-full w-20 text-center block"
              class:text-primary={progress > 0.45}
              on:click={() =>
                parallax.scrollTo(6, {
                  duration: 500,
                })}
            >
              OTC
            </a>
          </li>
        </ul>
        <div class="w-full mt-4 h-72">
          {#if progress < 0.6}
            {#each icons as icon, i}
              <div
                class="flex items-center space-x-4 px-4 w-full mt-2 rounded-lg bg-black bg-opacity-20"
                style="transform: translate({100 *
                  Math.min(0, 8 * progress - 1) *
                  (i + 1)}px, 0);"
              >
                <img src={icon} class="h-7" />
                <p class="text-xl">{iconName[i]}</p>
              </div>
            {/each}
          {:else if progress < 0.7}
            {#each iconSquared as icon, i}
              <div
                class="flex items-center space-x-4 px-4 w-full mt-2 rounded-lg bg-black bg-opacity-20"
              >
                <img src={icon} class="h-7" />
                <p class="text-xl">{iconNameSquared[i]}</p>
              </div>
            {/each}
          {:else if progress < 0.8}
            {#each iconCubed as icon, i}
              <div
                class="flex items-center space-x-4 px-4 w-full mt-2 rounded-lg bg-black bg-opacity-20"
              >
                <img src={icon} class="h-7" />
                <p class="text-xl">{iconNameCubed[i]}</p>
              </div>
            {/each}
          {:else}{#each iconFlip as icon, i}
              <div
                class="flex items-center space-x-4 px-4 w-full mt-2 rounded-lg bg-black bg-opacity-20"
              >
                <img src={icon} class="h-7" />
                <p class="text-xl">{iconNameFlip[i]}</p>
              </div>
            {/each}{/if}
        </div>
        <div
          class="join m-auto w-full mt-4"
          style="transform: translate({100 *
            Math.min(0, 8 * progress - 1) *
            3}px, 0);"
        >
          <button
            class="btn btn-sm btn-outline fine-border join-item w-1/3 text-xs"
            class:btn-active={progress > 0.6 && progress < 0.7}
            on:click={() =>
              parallax.scrollTo(7, {
                duration: 500,
              })}>Squared</button
          >
          <button
            class="btn btn-sm btn-outline fine-border join-item w-1/3 text-xs"
            class:btn-active={progress > 0.7 && progress < 0.8}
            on:click={() =>
              parallax.scrollTo(8, {
                duration: 500,
              })}>Cubed</button
          >
          <button
            class="btn btn-sm btn-outline fine-border join-item w-1/3 text-xs"
            class:btn-active={progress > 0.8}
            on:click={() =>
              parallax.scrollTo(9, {
                duration: 500,
              })}>Flip</button
          >
        </div>
        <div class="h-1 rounded-full bg-white w-1/4 m-auto mt-4" />
      </div>
    </div></StickyLayer
  >

  <!-- Investor Chart -->
  <StickyLayer
    rate={3}
    offset={{ top: 10, bottom: 18 }}
    onProgress={onChartProgress}
    let:progress
  >
    <div
      class="lg:flex lg:justify-between lg:items-center lg:h-full lg:w-4/5 m-auto lg:px-0 px-1"
    >
      <div
        class="mockup-window bg-base-300 border lg:h-1/2 lg:w-1/2 relative lg:ml-20 mt-24 overflow-visible lg:p-8 p-4"
        style="transform: skewX({15 *
          Math.max(0, 1 - 8 * progress)}deg) skewY({-15 *
          Math.max(0, 1 - 8 * progress)}deg) rotateX({-30 *
          Math.max(0, 1 - 8 * progress)}deg) rotateY({30 *
          Math.max(0, 1 - 8 * progress)}deg) translateX({200 *
          Math.max(0, 1 - 8 * progress)}px)"
      >
        <div class="lg:mt-4">
          <div
            class="flex lg:space-x-4 space-x-2 lg:py-8"
            style="transform: translate({-100 *
              Math.min(0, 8 * progress - 1) *
              5}px, 0);"
          >
            <div
              class="btn btn-outline lg:btn-md btn-sm lg:btn-wide"
              class:btn-primary={progress > 0.3 && progress < 0.45}
              class:btn-active={progress > 0.3 && progress < 0.45}
              on:click={() =>
                parallax.scrollTo(14, {
                  duration: 500,
                })}
            >
              <CoinIcon symbol="F-BTC" />Flip-Bitcoin
            </div>
            <div class="join">
              <div
                class="btn btn-outline lg:btn-md btn-sm join-item"
                class:btn-primary={progress > 0.45 && progress < 0.6}
                class:btn-active={progress > 0.45 && progress < 0.6}
                on:click={() =>
                  parallax.scrollTo(15, {
                    duration: 500,
                  })}
              >
                APY
              </div>
              <div
                class="btn btn-outline lg:btn-md btn-sm join-item"
                class:btn-primary={progress > 0.45 && progress < 0.6}
              >
                0.3%
              </div>
            </div>
            <div class="join">
              <div
                class="btn btn-outline lg:btn-md btn-sm join-item"
                class:btn-primary={progress > 0.6 && progress < 0.8}
                class:btn-active={progress > 0.6 && progress < 0.8}
                on:click={() =>
                  parallax.scrollTo(16, {
                    duration: 500,
                  })}
              >
                PNL
              </div>
              <div
                class="btn btn-outline lg:btn-md btn-sm join-item"
                class:btn-primary={progress > 0.6 && progress < 0.8}
              >
                3.0 <Icon icon="mdi:ethereum" class="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
          <div
            class="rounded-2xl bg-gradient lg:h-52 h-32 lg:margin-auto pb-4"
            style="transform: translate({-100 *
              Math.min(0, 8 * progress - 1) *
              2}px, 0);"
          >
            <LiquidityChart initializedTicks={ticks} FR={$FR} />
          </div>
          <div
            class="join lg:mt-8 mt-4"
            style="transform: translate({-100 *
              Math.min(0, 8 * progress - 1) *
              6}px, 0);"
          >
            <div
              class="btn btn-outline lg:btn-wide lg:btn-md btn-sm join-item"
              class:btn-primary={progress > 0.8}
              class:btn-active={progress > 0.8}
              on:click={() =>
                parallax.scrollTo(18, {
                  duration: 500,
                })}
            >
              Activation Rate
            </div>
            <div
              class="btn btn-outline lg:btn-md btn-sm join-item"
              class:btn-primary={progress > 0.8}
            >
              {($FR / 100).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      <div class="lg:w-2/5 lg:h-1/2 relative lg:text-left text-center">
        {#if progress < 0.1}
          <span />
        {:else if progress < 0.3}
          <div class="lg:absolute" in:fade>
            <h3 class="text-primary lg:text-5xl text-2xl mt-24">
              <strong>Earn</strong> on your liquidity
            </h3>
            <div class="py-4">
              <p>Take the trader counterparty</p>
              <p>Earn yields on your liquidity</p>
              <p>Catch the traders swap fees</p>
            </div>
            <a
              class="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.sf.exchange/docs/protocol-rules/liquidity-provider"
              >Learn More</a
            >
          </div>
        {:else if progress < 0.6}
          <div class="lg:absolute">
            {#if progress < 0.45}
              <h3 class="text-primary lg:text-5xl text-2xl mt-24">
                Choose your <strong class="text-primary">Exposition</strong>
              </h3>
              <p class="py-4">Your liquidities are used by one pool only</p>
            {:else}
              <h3 class="text-primary lg:text-5xl text-2xl mt-24">
                Earn the pool <strong class="text-primary">APY</strong>
              </h3>
              <div class="py-4">
                <p>
                  Traders will pay you a yearly rate for holding your liquidity
                </p>
              </div>
            {/if}
          </div>
        {:else if progress < 0.8}
          <div class="lg:absolute">
            <h3 class="text-primary lg:text-5xl text-2xl mt-24">
              Collect <strong>Swap Fees</strong>
            </h3>
            <div class="py-4">
              <p>The PnL will include the pool swap fees</p>
              <p>The traders' PnL</p>
              <p>and the accumulated APY</p>
            </div>
          </div>
        {:else}
          <div class="lg:absolute">
            <h3 class="text-primary lg:text-5xl text-2xl mt-24">
              Hedge your <strong>Risk</strong>
            </h3>
            <div class="py-4">
              <p>
                Your liquidity will not be used when the pool APY is below this
                rate
              </p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </StickyLayer>

  <StickyLayer rate={1} offset={{ top: 19, bottom: 20 }}>
    <div class="w-screen z-10 mt-32">
      <div class="lg:w-1/2 lg:px-0 px-4 lg:m-auto">
        <div class="lg:py-2 flex lg:space-x-4 space-x-2">
          <a
            class="text-center lg:py-12 py-4 text-xl fine-border rounded-tl-full w-1/2 lg:h-auto h-16 hover:bg-white hover:bg-opacity-20 hover:border-primary hover:font-normal bg-gradient"
            href="/swap"
          >
            Trade
          </a>
          <a
            class="text-center lg:py-12 py-4 text-xl fine-border rounded-tr-full w-1/2 lg:h-auto h-16 hover:bg-white hover:bg-opacity-20 hover:border-primary hover:font-normal bg-gradient"
            href="/earn"
          >
            Deposit
          </a>
        </div>
        <div class="py-2 flex lg:space-x-4 space-x-2">
          <a
            class="text-center lg:py-12 py-4 text-xl fine-border rounded-bl-full w-1/2 lg:h-auto h-16 hover:bg-white hover:bg-opacity-20 hover:border-primary hover:font-normal bg-gradient"
            href="/oracle"
          >
            Stake
          </a>
          <a
            class="text-center lg:py-12 py-4 text-xl fine-border rounded-br-full w-1/2 lg:h-auto h-16 hover:bg-white hover:bg-opacity-20 hover:border-primary hover:font-normal bg-gradient"
            href="https://docs.sf.exchange"
          >
            Learn
          </a>
        </div>
      </div>
    </div>
    <div class="absolute h-1/2 w-full bottom-0 left-0">
      {#each Array.from({ length: 19 }) as _, i}
        <div
          class="bg-white h-4 mt-2"
          style="opacity: {i * 0.03}; height: {i * 2}px;"
        />
      {/each}
    </div>
  </StickyLayer>

  <StickyLayer
    rate={2}
    offset={{ top: 1, bottom: 18 }}
    let:progress
    style="height: 0px !important;"
    class="lg:block hidden"
  >
    <div class="pt-32 pl-20">
      <ul class="border-l-2 border-primary pl-8 z-20">
        <li
          class="cursor-pointer"
          class:font-bold={progress < 0.5}
          class:text-primary={progress < 0.5}
          class:text-xl={progress < 0.5}
          on:click={() =>
            parallax.scrollTo(3, {
              duration: 500,
            })}
        >
          Trader
        </li>
        <li
          class="cursor-pointer"
          class:font-bold={progress > 0.5}
          class:text-primary={progress > 0.5}
          class:text-xl={progress > 0.5}
          on:click={() =>
            parallax.scrollTo(12, {
              duration: 500,
            })}
        >
          Liquidity Provider
        </li>
      </ul>
    </div>
  </StickyLayer>
</Parallax>

<style>
  .round {
    border-top-left-radius: 30rem;
    border-top-right-radius: 8rem;
    border-bottom-right-radius: 30rem;
    border-bottom-left-radius: 8rem;
  }
  /* animate the down button every 1 seconds */

  .selected {
    background: hsl(var(--bc) / 0.08);
  }
</style>
