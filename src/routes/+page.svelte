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

  const icons = [
    "/S-USD.svg",
    "/S-BTC.svg",
    "/S-SOL.svg",
    "/S-ETH.svg",
    "/F-DOGE.svg",
    "/F-XMR.svg",
  ];

  const iconName = [
    "Stip-USD",
    "Stip-BTC",
    "Stip-SOL",
    "Stip-ETH",
    "Stip-DOGE",
    "Flip-XMR",
  ];

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

<Parallax sections={7}>
  <ParallaxLayer rate={1} offset={0}>
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

  <StickyLayer rate={2} offset={{ top: 1, bottom: 7 }}>
    <div class="bg-2 h-full"></div>
  </StickyLayer>

  <StickyLayer rate={1} offset={{ top: 0.8, bottom: 2 }} let:progress>
    <div
      class="lg:flex items-center p-8 lg:px-32 z-10"
      style="opacity: {2 - 2 * progress};"
    >
      <div>
        <h3 class="text-primary lg:text-5xl text-2xl mt-24">Trade any asset</h3>
        <div class="py-4 lg:text-2xl">
          <p class="py-4">Thanks to our innovative oracle system</p>
          <p class="py-4">You can trade any indices</p>
        </div>
      </div>
      <div
        class="lg:block hidden mockup-phone lg:mt-36 overflow-visible lg:h-auto"
        style="transform: skewX({-30 *
          Math.max(0, 1 - 2 * progress)}deg) skewY({30 *
          Math.max(0, 1 - 2 * progress)}deg) rotateX({-30 *
          Math.max(0, 1 - 2 * progress)}deg) rotateY({30 *
          Math.max(0, 1 - 2 * progress)}deg)"
      >
        <div class="camera" />
        <div class="display !overflow-visible">
          <div
            class="artboard artboard-demo phone-1 items-start justify-start pt-12 px-2 overflow-visible rounded-3xl"
          >
            {#each icons as icon, i}
              <div
                class="flex items-center space-x-4 px-4 py-2 rounded-full w-full border mt-2 bg-white bg-opacity-20"
                style="transform: translate({100 *
                  Math.min(0, 2 * progress - 1) *
                  (i + 1)}px, 0);"
              >
                <img src={icon} class="h-8" />
                <p class="text-xl">{iconName[i]}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </StickyLayer>

  <StickyLayer rate={2} offset={{ top: 2, bottom: 4 }} let:progress>
    <div
      class="lg:h-1/3 h-2/3 flex justify-end lg:items-start items-end lg:p-8 lg:px-32 z-10"
      style="margin-top: {30 - (progress < 0.2 ? 0 : (progress - 0.2) * 40)}vh;"
    >
      <div>
        <h3
          class="text-primary lg:text-5xl text-3xl lg:mt-24 lg:px-0 px-4 text-right"
        >
          Anti-Fragile
        </h3>
        <div class="lg:py-4 lg:text-2xl text-xl text-right">
          <p
            class="lg:py-4 lg:px-0 px-4"
            style="opacity: {progress > 0.5 ? 0 : 1}; transition: all 1s ease;"
          >
            Put your hard money to work on your <strong class="text-primary"
              >own terms</strong
            >
          </p>
          <p
            class="py-4"
            style="opacity: {progress < 0.5 ? 0 : 1}; transition: all 1s ease;"
          >
            <strong class="text-primary">Zero liquidation</strong> risk embedded
            leverage
          </p>
        </div>
      </div>
    </div>
    <div
      class="flex lg:space-x-32 lg:ml-24 mt-8"
      style="transform: translateX({50 - progress * 100}%); opacity: {progress <
      0.5
        ? 0
        : 1}; transition: opacity 1s ease;"
    >
      {#each leveraged as icon, i}
        <div
          class="rounded-full shadow-xl border shadow-white bg-white bg-opacity-10 p-4"
        >
          <img src={icon} class="lg:min-h-32 lg:min-w-32 min-w-16" />
        </div>
      {/each}
    </div>
    <div
      class="flex lg:space-x-8 items-center justify-around lg:ml-24 mt-20 z-10 lg:px-0 px-4"
      style="opacity: {progress < 0.5 ? 0 : 1}; transition: all 1s ease;"
    >
      <p class="lg:text-2xl lg:text-right text-xl">
        Trade your synthetic squared or cubed <br /><br />
        long or short <br /><br />
        stip or flip <br /><br />
      </p>
      <a class="btn btn-outline lg:w-1/3" href="https://docs.sf.exchange"
        >Learn More</a
      >
    </div>
  </StickyLayer>
  <StickyLayer
    rate={3}
    offset={{ top: 2, bottom: 3 }}
    onProgress={onChartProgress}
    let:progress
  >
    <div
      style="margin-top: 30vh; height: 100vh; transform: scale({0.8 +
        0.2 * progress});"
    >
      <div class="flex lg:space-x-4 space-x-2 lg:ml-24 mb-8 -mt-24">
        <div class="btn btn-primary btn-outline lg:btn-wide lg:btn-lg">
          <CoinIcon symbol="F-BTC" />Flip-Bitcoin
        </div>
        <div class="join">
          <div class="btn btn-outline lg:btn-wide lg:btn-lg join-item">
            Pool Funding Rate
          </div>
          <div class="btn btn-outline lg:btn-lg join-item">0.3%</div>
        </div>
      </div>
      <div
        class="lg:ml-24 lg:p-4 border border-primary rounded-2xl bg-gradient h-1/4 lg:w-1/2 w-full lg:margin-auto shadow-md shadow-primary"
      >
        <LiquidityChart initializedTicks={ticks} FR={$FR} />
      </div>
      <div class="join lg:ml-24 mt-8">
        <div class="btn btn-primary lg:btn-wide lg:btn-lg join-item">
          Deposit Liquidity at
        </div>
        <div class="btn btn-primary btn-outline lg:btn-lg join-item">
          {($FR / 100).toFixed(2)}%
        </div>
      </div>
    </div>
  </StickyLayer>
  <StickyLayer rate={1} offset={{ top: 5, bottom: 6 }}>
    <div
      class="lg:h-2/3 flex justify-around lg:items-start items-end lg:px-0 px-4"
    >
      <div>
        <h3 class="text-primary lg:text-5xl text-2xl mt-64">Secure</h3>
        <div class="py-4 lg:text-2xl">
          <p class="py-4">Built on the most secure smart contract blockchain</p>
          <p class="py-4">100% Decentralized - no single point of failure</p>
        </div>
      </div>
    </div>
  </StickyLayer>
  <StickyLayer rate={1} offset={{ top: 5, bottom: 6 }}>
    <div class="flex justify-around items-end lg:h-2/3 h-5/6">
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
</style>
