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
</script>

<Parallax sections={20}>
  <ParallaxLayer rate={1} offset={0} let:progress>
    <div
      class="text-center lg:text-start lg:mt-0 lg:left-28 h-full flex justify-between flex-col"
    >
      <img
        src="/icon.svg"
        class="absolute w-1/4 lg:m-0 mt-24"
        style="transform: translate(150%, 10%);"
      />
      <div class="lg:w-full h-1/2 m-auto flex items-end">
        <div class="mx-auto mb-8">
          <h1 class="lg:text-8xl text-3xl text-center w-full padauk font-bold">
            Stip&Flip
          </h1>
          <h2
            class="lg:mt-8 mt-2 lg:text-4xl text-xl lg:px-0 px-4 text-base-content text-center padauk"
          >
            Trade <strong class="text-primary">everything</strong>
          </h2>
          <div
            class="flex lg:justify-center space-x-2 lg:mt-8 lg:h-4 lg:px-0 px-8"
          >
            <div class="flex space-x-4 w-1/4 lg">
              <a href="https://github.com/stip-flip" target="_blank"
                ><Icon class="lg:text-4xl text-2xl" icon="mdi:github" /></a
              >
              <a href="https://twitter.com/stipflip" target="_blank">
                <Icon class="lg:text-4xl text-2xl" icon="mdi:twitter" /></a
              >
            </div>
            <!-- <div class="flex-grow w-1/4" /> -->
          </div>
        </div>
      </div>
      <div class="lg:h-1/3 w-full flex justify-center items-end">
        <Countdown />
      </div>
      <div class="lg:h-1/4 h-1/6" />
      <!-- {#if !import.meta.env.SSR}
        <LottiePlayer
          class="absolute"
          src="https://assets-global.website-files.com/649053a6e993a59c07215fb1/64a1a28e8d584d2e53d44d93_header-lottie-loop.json"
          autoplay={true}
          loop={true}
          renderer="svg"
          background="transparent"
        />
      {/if} -->
      <div class="flex w-full absolute bottom-4">
        {#each Array.from({ length: 10 }) as _, i}
          <div class="lg:min-w-32 lg:min-h-32">
            <img src="/golden-gate-bridge.svg" />
          </div>
        {/each}
      </div>
    </div>
  </ParallaxLayer>

  <StickyLayer rate={2} offset={{ top: 1, bottom: 20 }}>
    <div class="bg-2 h-full"></div>
  </StickyLayer>

  <StickyLayer rate={1} offset={{ top: 1, bottom: 9 }} let:progress>
    <div class="lg:flex items-center justify-between p-8 lg:px-32 z-10">
      <div class="w-1/3 h-32">
        {#if progress < 0.3}
          <div class="absolute w-1/3">
            <h3 class="text-primary lg:text-5xl text-2xl mt-24">
              Trade everything
            </h3>
            <div class="py-4">
              <p>With our groundbreaking proof of stake oracle contract</p>
              <p>Now you can trade any indices</p>
              <p>And earn by becoming an Oracle Operator</p>
            </div>
          </div>
        {:else if progress < 0.6}
          <div class="absolute w-1/3">
            {#if progress < 0.45}
              <h3 class="text-primary lg:text-5xl text-2xl mt-24">
                Trade on the <strong class="text-primary">Market</strong>
              </h3>
            {:else}
              <h3 class="text-primary lg:text-5xl text-2xl mt-24">
                <strong class="text-primary">Over The Counter</strong>
              </h3>
              <p class="py-4">at the next Oracle price with no slippage</p>
            {/if}
          </div>
        {:else if progress < 0.8}
          <div class="absolute w-1/3">
            <h3 class="text-primary lg:text-5xl text-2xl mt-24">
              on <strong>Leverage</strong>
            </h3>
            <div class="py-4">
              <p>Discover squared and cubed trading</p>
              <p>Increase your position volatility with no liquidation risk</p>
            </div>
          </div>
        {:else}
          <div class="absolute w-1/3">
            <h3 class="text-primary lg:text-5xl text-2xl mt-24">
              on <strong>Reverse</strong>
            </h3>
            <div class="py-4">
              <p>
                A flip is an instrument that inversely tracks the price of an
                asset
              </p>
            </div>
          </div>
        {/if}
      </div>

      <div
        class="lg:block hidden mockup-phone lg:mt-36 overflow-visible lg:h-auto"
        style="transform: skewX({-30 *
          Math.max(0, 1 - 8 * progress)}deg) skewY({30 *
          Math.max(0, 1 - 8 * progress)}deg) rotateX({-30 *
          Math.max(0, 1 - 8 * progress)}deg) rotateY({30 *
          Math.max(0, 1 - 8 * progress)}deg)"
      >
        <div class="camera" />
        <div class="display !overflow-visible">
          <div
            class="artboard artboard-demo phone-1 items-start justify-start px-2 overflow-visible rounded-3xl relative"
          >
            <ul
              class="relative menu menu-md menu-horizontal bg-gradient rounded-full bg-opacity-50 p-0 shadow-sm shadow-base-content mt-8"
              id="modes"
              style="transform: translate({100 *
                Math.min(0, 8 * progress - 1) *
                3}px, 0);"
            >
              <div
                class="absolute w-1/2 h-full rounded-full transition-all left-1/2 selected"
                class:!left-0={progress > 0.3 && progress < 0.45}
              ></div>
              <li id="market-mode">
                <a
                  class="rounded-full w-20 text-center block"
                  class:text-primary={progress > 0.3 && progress < 0.45}
                >
                  Market
                </a>
              </li>
              <li id="otc-mode">
                <a
                  class="rounded-full w-20 text-center block"
                  class:text-primary={progress > 0.45}
                >
                  OTC
                </a>
              </li>
            </ul>
            <div class="w-full mt-8">
              {#if progress < 0.6}
                {#each icons as icon, i}
                  <div
                    class="flex items-center space-x-4 px-4 w-full mt-2 rounded-lg fine-border bg-black bg-opacity-20"
                    style="transform: translate({100 *
                      Math.min(0, 8 * progress - 1) *
                      (i + 1)}px, 0);"
                  >
                    <img src={icon} class="h-8" />
                    <p class="text-xl">{iconName[i]}</p>
                  </div>
                {/each}
              {:else if progress < 0.7}
                {#each iconSquared as icon, i}
                  <div
                    class="flex items-center space-x-4 px-4 w-full mt-2 rounded-lg fine-border bg-black bg-opacity-20"
                  >
                    <img src={icon} class="h-8" />
                    <p class="text-xl">{iconNameSquared[i]}</p>
                  </div>
                {/each}
              {:else if progress < 0.8}
                {#each iconCubed as icon, i}
                  <div
                    class="flex items-center space-x-4 px-4 w-full mt-2 rounded-lg fine-border bg-black bg-opacity-20"
                  >
                    <img src={icon} class="h-8" />
                    <p class="text-xl">{iconNameCubed[i]}</p>
                  </div>
                {/each}
              {:else}{#each iconFlip as icon, i}
                  <div
                    class="flex items-center space-x-4 px-4 w-full mt-2 rounded-lg fine-border bg-black bg-opacity-20"
                  >
                    <img src={icon} class="h-8" />
                    <p class="text-xl">{iconNameFlip[i]}</p>
                  </div>
                {/each}{/if}
            </div>
            <div
              class="fixed bottom-8 join m-auto"
              style="width: calc(100% - 2rem); transform: translate({100 *
                Math.min(0, 8 * progress - 1) *
                3}px, 0);"
            >
              <button
                class="btn btn-outline join-item w-1/3"
                class:btn-active={progress > 0.6 && progress < 0.7}
                >Squared</button
              >
              <button
                class="btn btn-outline join-item w-1/3"
                class:btn-active={progress > 0.7 && progress < 0.8}
                >Cubed</button
              >
              <button
                class="btn btn-outline join-item w-1/3"
                class:btn-active={progress > 0.8}>Flip</button
              >
            </div>
          </div>
        </div>
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
    <div class="flex justify-between items-center h-full">
      <div
        class="mockup-window bg-base-300 border h-1/2 w-1/2 relative ml-20 overflow-visible p-8"
        style="transform: skewX({15 *
          Math.max(0, 1 - 8 * progress)}deg) skewY({-15 *
          Math.max(0, 1 - 8 * progress)}deg) rotateX({-30 *
          Math.max(0, 1 - 8 * progress)}deg) rotateY({30 *
          Math.max(0, 1 - 8 * progress)}deg)"
      >
        <div class="mt-4">
          <div
            class="flex lg:space-x-4 space-x-2 py-8"
            style="transform: translate({-100 *
              Math.min(0, 8 * progress - 1) *
              5}px, 0);"
          >
            <div
              class="btn btn-outline lg:btn-wide"
              class:btn-primary={progress > 0.3 && progress < 0.45}
              class:btn-active={progress > 0.3 && progress < 0.45}
            >
              <CoinIcon symbol="F-BTC" />Flip-Bitcoin
            </div>
            <div class="join">
              <div
                class="btn btn-outline join-item"
                class:btn-primary={progress > 0.45 && progress < 0.6}
                class:btn-active={progress > 0.45 && progress < 0.6}
              >
                APY
              </div>
              <div
                class="btn btn-outline join-item"
                class:btn-primary={progress > 0.45 && progress < 0.6}
              >
                0.3%
              </div>
            </div>
            <div class="join">
              <div
                class="btn btn-outline join-item"
                class:btn-primary={progress > 0.6 && progress < 0.8}
                class:btn-active={progress > 0.6 && progress < 0.8}
              >
                PNL
              </div>
              <div
                class="btn btn-outline join-item"
                class:btn-primary={progress > 0.6 && progress < 0.8}
              >
                3.0 <Icon icon="mdi:ethereum" class="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
          <div
            class="rounded-2xl bg-gradient h-52 lg:margin-auto pb-4"
            style="transform: translate({-100 *
              Math.min(0, 8 * progress - 1) *
              2}px, 0);"
          >
            <LiquidityChart initializedTicks={ticks} FR={$FR} />
          </div>
          <div
            class="join mt-8"
            style="transform: translate({-100 *
              Math.min(0, 8 * progress - 1) *
              6}px, 0);"
          >
            <div
              class="btn btn-outline lg:btn-wide join-item"
              class:btn-primary={progress > 0.8}
              class:btn-active={progress > 0.8}
            >
              Activation Rate
            </div>
            <div
              class="btn btn-outline join-item"
              class:btn-primary={progress > 0.8}
            >
              {($FR / 100).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      <div class="w-1/3 h-1/2">
        {#if progress < 0.3}
          <div class="absolute w-1/3">
            <h3 class="text-primary lg:text-5xl text-2xl mt-24">
              <strong>Earn</strong>
            </h3>
            <div class="py-4">
              <p>Take the trader counterparty</p>
              <p>Earn yields on your liquidity</p>
              <p>Catch the traders swap fees</p>
            </div>
          </div>
        {:else if progress < 0.6}
          <div class="absolute w-1/3">
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
          <div class="absolute w-1/3">
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
          <div class="absolute w-1/3">
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
    <div class="flex justify-around items-end lg:h-1/3 h-5/6">
      <a class="btn-primary text-white btn btn-lg lg:w-1/3" href="swap"
        >Start Trading</a
      >
      <a
        class="btn-info text-white btn btn-lg lg:w-1/3"
        href="https://docs.sf.exchange/">Learn more</a
      >
    </div>
    <div class="absolute h-1/2 w-full bottom-0 left-0">
      {#each Array.from({ length: 19 }) as _, i}
        <div
          class="bg-primary h-4 mt-2"
          style="opacity: {i * 0.03}; height: {i * 2}px;"
        />
      {/each}
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
