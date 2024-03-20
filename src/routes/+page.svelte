<script lang="ts">
  import Icon from "@iconify/svelte";
  import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";
  import { Parallax, ParallaxLayer, StickyLayer } from "svelte-parallax";
  import Parrallax0 from "./parrallax0.svelte";

  $: console.log("SSR", import.meta.env.SSR);

  const icons = ["/s-usd.svg", "/s-btc.svg", "s-sol.svg", "s-eth.svg"];
</script>

<Parallax sections={5}>
  <ParallaxLayer rate={1} offset={0}>
    <div
      class="text-center lg:text-start lg:mt-0 lg:bottom-48 lg:left-28 h-full flex justify-between flex-col"
    >
      <div class="h-1/3" />
      <div class="text-center h-1/3">
        <h1 class="text-7xl font-bold">Stip & Flip</h1>
        <h2 class="mt-8 text-4xl text-base-content">
          Decentralised & Permissionless <strong class="text-primary"
            >Real World Assets</strong
          >
        </h2>
      </div>
      {#if !import.meta.env.SSR}
        <LottiePlayer
          class="absolute"
          src="https://assets-global.website-files.com/649053a6e993a59c07215fb1/64a1a28e8d584d2e53d44d93_header-lottie-loop.json"
          autoplay={true}
          loop={true}
          renderer="svg"
          background="transparent"
        />
      {/if}
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
  </ParallaxLayer>
  <!-- <ParallaxLayer rate={1} offset={0} span={4}>
    <div class="bg-2 h-full"></div></ParallaxLayer
  > -->

  <StickyLayer rate={2} offset={{ top: 1, bottom: 4 }}>
    <div class="bg-2 h-full"></div>
  </StickyLayer>

  <StickyLayer rate={1} offset={{ top: 1, bottom: 1.5 }}>
    <div class="flex p-8 px-32">
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
    <ParallaxLayer rate={1 + Math.random()} offset={1.9}>
      <div
        class="rounded-full shadow-xl border shadow-white bg-white bg-opacity-10 h-32 w-32 p-4"
        style="margin-left: {18 + i * 20}%;"
      >
        <img src={icon} />
      </div>
    </ParallaxLayer>
  {/each}

  <StickyLayer rate={2} offset={{ top: 2, bottom: 2.5 }}>
    <div class="h-full flex justify-end p-8 px-32">
      <div>
        <h3 class="text-primary text-5xl mt-24 text-right">AntiFragile</h3>
        <div class="py-4 text-2xl text-right">
          <p class="py-4">
            Put your hard money to work on your <strong>own terms</strong>
          </p>
          <p class="py-4">
            No liquidation thanks to our <strong>embedded leverage</strong>
          </p>
        </div>
      </div>
      <!-- <h3 class="text-primary text-5xl mt-64 w-1/2 border-b border-white">
        Limitless
      </h3>
      <h3 class="text-primary text-5xl mt-64 w-1/2 border-b border-white">
        Antifragile
      </h3> -->
    </div>
  </StickyLayer>
  <StickyLayer rate={2} offset={{ top: 3, bottom: 3.5 }}>
    <div class="h-full flex justify-around">
      <div>
        <h3 class="text-primary text-5xl mt-64">Secure</h3>
        <div class="py-4 text-2xl">
          <p class="py-4">Built on the most secure smart contract blockchain</p>
          <p class="py-4">100% community driven - no single point of failure</p>
        </div>
      </div>
      <!-- <h3 class="text-primary text-5xl mt-64 w-1/2 border-b border-white">
        Limitless
      </h3>
      <h3 class="text-primary text-5xl mt-64 w-1/2 border-b border-white">
        Antifragile
      </h3> -->
    </div>
  </StickyLayer>
  <StickyLayer rate={1} offset={{ top: 4, bottom: 5 }}>
    <div class="flex justify-around items-center h-1/2">
      <a class="btn-primary text-white btn btn-lg w-1/3" href="swap"
        >Start Trading</a
      >
      <a
        class="btn-info text-white btn btn-lg w-1/3"
        href="https://doc.sf.exchange/">Learn more</a
      >
    </div>
    <div class="absolute h-1/2 w-full bottom-0 left-0">
      {#each Array.from({ length: 9 }) as _, i}
        <div class="bg-slate-{900 - i * 100} h-10 mt-8" />
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
