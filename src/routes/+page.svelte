<script lang="ts">
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
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
      class="text-center lg:text-start lg:mt-0 lg:bottom-48 lg:left-28 h-full flex justify-between flex-col"
    >
      <img
        src="/icon.svg"
        class="absolute w-1/4 lg:m-0"
        style="transform: translate(150%, 15%);"
      />
      <div class="h-1/2 w-full flex justify-center"></div>
      <div class="w-1/2 m-auto">
        <div class="">
          <h1 class="text-7xl font-bold">Stip&Flip</h1>
          <h2 class="mt-8 text-4xl text-base-content">
            Decentralised & Permissionless <strong class="text-primary"
              >Real World Assets</strong
            >
          </h2>
          <div class="flex justify-between space-x-2 mt-8 lg:h-4">
            <div class="flex space-x-4 flex-grow w-1/4">
              <a href="https://github.com/stip-flip"
                ><Icon class="text-4xl" icon="mdi:github" /></a
              >
              <a href="https://twitter.com/stipflip"></a>
                <Icon class="text-4xl" icon="mdi:twitter" /></a
              >
            </div>
            <div class="flex-grow w-1/4" />
          </div>
        </div>
      </div>
      <div class="h-1/4" />
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
          <div class="min-w-32 min-h-32">
            <img src="/golden-gate-bridge.svg" />
          </div>
        {/each}
      </div>
    </div>
  </ParallaxLayer>

  <StickyLayer rate={2} offset={{ top: 1, bottom: 7 }}>
    <div class="bg-2 h-full"></div>
  </StickyLayer>

  <StickyLayer rate={1} offset={{ top: 1, bottom: 2 }} let:progress>
    <div class="flex p-8 px-32 z-10" style="opacity: {2 - 2 * progress};">
      <div>
        <h3 class="text-primary text-5xl mt-24">Trade any synthetic asset</h3>
        <div class="py-4 text-2xl">
          <p class="py-4">DeFi now has access to any real world asset</p>
          <p class="py-4">If you have the data - we can mint it</p>
        </div>
      </div>
    </div>
  </StickyLayer>

  {#each icons as icon, i}
    <StickyLayer
      rate={1 + Math.random()}
      offset={{ top: 1, bottom: 2 }}
      let:progress
    >
      <div
        class="rounded-full shadow-xl border shadow-white bg-white bg-opacity-10 h-32 w-32 p-4"
        style="margin-top: 80vh; margin-left: {25 +
          i * 10}%; transform: translateY(-{progress *
          (10 - iconsTranslate[i]) *
          100 +
          iconsTranslate[i] * 50}%) scale({1 - progress * 0.5}); opacity: {3 -
          3 * progress};"
      >
        <img src={icon} />
      </div>
    </StickyLayer>
  {/each}

  <StickyLayer rate={2} offset={{ top: 2, bottom: 4 }} let:progress>
    <div
      class="h-1/3 flex justify-end p-8 px-32 z-10"
      style="margin-top: {30 - (progress < 0.2 ? 0 : (progress - 0.2) * 40)}vh;"
    >
      <div>
        <h3 class="text-primary text-5xl mt-24 text-right">Anti-Fragile</h3>
        <div class="py-4 text-2xl text-right">
          <p
            class="py-4"
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
      class="flex space-x-32 ml-24 mt-8"
      style="transform: translateX({50 - progress * 100}%); opacity: {progress <
      0.5
        ? 0
        : 1}; transition: opacity 1s ease;"
    >
      {#each leveraged as icon, i}
        <div
          class="rounded-full shadow-xl border shadow-white bg-white bg-opacity-10 h-32 w-32 p-4"
          style="min-width: 8rem;"
        >
          <img src={icon} />
        </div>
      {/each}
    </div>
    <div
      class="flex space-x-8 items-center justify-around ml-24 mt-20 z-10"
      style="opacity: {progress < 0.5 ? 0 : 1}; transition: all 1s ease;"
    >
      <p class="text-2xl text-right">
        Trade your synthetic squared or cubed <br /><br />
        long or short <br /><br />
        stip or flip <br /><br />
      </p>
      <a class="btn btn-outline w-1/3" href="https://docs.sf.exchange"
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
      <div class="flex space-x-4 ml-24 mb-8 -mt-24">
        <div class="btn btn-primary btn-outline btn-wide btn-lg">
          <CoinIcon symbol="F-BTC" />Flip-Bitcoin
        </div>
        <div class="join">
          <div class="btn btn-outline btn-wide btn-lg join-item">
            Pool Funding Rate
          </div>
          <div class="btn btn-outline btn-lg join-item">0.3%</div>
        </div>
      </div>
      <div
        class="ml-24 p-4 border border-primary rounded-2xl bg-gradient h-1/4 lg:w-1/2 margin-auto shadow-md shadow-primary"
      >
        <LiquidityChart initializedTicks={ticks} FR={$FR} />
      </div>
      <div class="join ml-24 mt-8">
        <div class="btn btn-primary btn-wide btn-lg join-item">
          Deposit Liquidity at
        </div>
        <div class="btn btn-primary btn-outline btn-lg join-item">
          {($FR / 100).toFixed(2)}%
        </div>
      </div>
    </div>
  </StickyLayer>
  <StickyLayer rate={1} offset={{ top: 5, bottom: 6 }}>
    <div class="h-1/2 flex justify-around" style="margin-top: -30vh;">
      <div>
        <h3 class="text-primary text-5xl mt-64">Secure</h3>
        <div class="py-4 text-2xl">
          <p class="py-4">Built on the most secure smart contract blockchain</p>
          <p class="py-4">100% Decentralized - no single point of failure</p>
        </div>
      </div>
    </div>
  </StickyLayer>
  <StickyLayer rate={1} offset={{ top: 5, bottom: 6 }}>
    <div
      class="flex justify-around items-center h-1/2"
      style="margin-top: 15vh;"
    >
      <a class="btn-primary text-white btn btn-lg w-1/3" href="swap"
        >Start Trading</a
      >
      <a
        class="btn-info text-white btn btn-lg w-1/3"
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
