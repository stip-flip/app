<script lang="ts">
  import Icon from "@iconify/svelte";

  import { Parallax, ParallaxLayer, StickyLayer } from "svelte-parallax";
</script>

<!-- <div class="root"> -->
<div
  class="text-center lg:text-start lg:mt-0 lg:bottom-48 lg:left-28 h-full flex justify-between flex-col"
>
  <div class="" />
  <div class="text-center h-1/3">
    <h1 class="text-7xl font-bold">Stip & Flip</h1>
    <h2 class="mt-8 text-4xl text-base-content">
      Decentralised & Permissionless <strong class="text-primary"
        >Real World Assets</strong
      >
    </h2>
  </div>
  <div class="w-full flex p-4 justify-between space-x-2 mt-8 lg:-ml-8">
    <div class="flex-grow w-1/4" />
    <Icon
      class="text-4xl flex-grow w-1/4 animate-bounce"
      icon="mingcute:down-fill"
    />
    <div class="flex justify-end space-x-4 flex-grow w-1/4">
      <Icon class="text-4xl" icon="mdi:github" />
      <Icon class="text-4xl" icon="mdi:twitter" />
    </div>
  </div>
</div>

<div class="bg-2 px-8">
  <Parallax sections={2}>
    <ParallaxLayer
      rate={1.5}
      offset={0}
      let:progress
      style="display:flex; justify-content:space-around; align-items:center;"
    >
      <div
        class="lg:w-1/3 lg:h-1/3 shadow-sm shadow-base-content rounded-3xl p-8 bg-opaque"
        style="opacity: {2.5 - 3 * progress}; transform: translateX({-2 *
          progress *
          50}px)"
      >
        <h3 class="text-primary text-3xl">No Single Point Of Failure</h3>
        <p class="mt-12 text-xl">
          Everything in S&F is incentivised. <br /> Price feeds are submitted by
          the community. <br /> Funding rates adjust lazily with demand.
        </p>
      </div>
      <div
        class="lg:w-1/3 lg:h-1/3 shadow-sm shadow-base-content rounded-3xl p-8 bg-opaque"
        style="opacity: {2.5 - 3 * progress}; transform: translateX({progress *
          100}px)"
      >
        <h3 class="text-primary text-3xl">Anyone Can Participate</h3>
        <p class="mt-12 text-xl">
          Everything in S&F is permissionless. <br /> You can trade assets
          <br />
          Create a new pool <br /> Lend liquidity to traders <br /> Become a price
          provider
        </p>
      </div>
    </ParallaxLayer>
    <ParallaxLayer
      rate={1}
      offset={0.9}
      style="display:flex; justify-content:space-around; align-items:center;"
      let:progress
    >
      <div
        class="lg:w-1/3 lg:h-1/3 shadow-sm shadow-base-content rounded-3xl p-8 bg-opaque"
        style="opacity: {2 * progress}"
      >
        <h3 class="text-primary text-3xl">Trade Anything</h3>
        <p class="mt-12 text-xl">
          S&F has no limit on what could be traded. <br /> You can trade
          commodities
          <br /> Stocks <br /> Real estate <br /> Presidential polls <br />
          You name it
        </p>
      </div>
      <div
        class="lg:w-1/3 lg:h-1/3 shadow-sm shadow-base-content rounded-3xl p-8 bg-opaque"
        style="opacity: {2 * progress}"
      >
        <h3 class="text-primary text-3xl">Get the Best Price</h3>
        <p class="mt-12 text-xl">
          You can either swap on the spot <br /> Or trade Over The Counter and avoid
          slippage
        </p>
      </div>
    </ParallaxLayer>
    <ParallaxLayer
      rate={1}
      offset={1}
      style="display:flex; justify-content:space-around; align-items:center;"
      let:progress
    >
      <a
        href="swap"
        class="lg:w-1/3 shadow-sm shadow-base-content rounded-3xl p-8 bg-accent"
        style="opacity: {2 * progress}">Get Started</a
      >
      <a
        href="https://sf-doc.vercel.app"
        class="lg:w-1/3 shadow-sm shadow-base-content rounded-3xl p-8 bg-info"
        style="opacity: {2 * progress}">Learn More</a
      >
    </ParallaxLayer>
  </Parallax>

  <!-- <div>Get the best price</div>
  <div>Bear or Bull</div> -->
</div>

<!-- </div> -->

<style>
  .round {
    border-top-left-radius: 30rem;
    border-top-right-radius: 8rem;
    border-bottom-right-radius: 30rem;
    border-bottom-left-radius: 8rem;
  }
  /* animate the down button every 1 seconds */
</style>
