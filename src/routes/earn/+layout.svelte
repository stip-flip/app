<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { formatEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { usePositionsStats } from "src/hooks/sf/position";
  import { commify } from "src/lib";
  import { navigate } from "src/lib/path";

  $: url = new URL($page.url);

  $: mode = url.searchParams.get("mode") || "otc";

  $: add = url.pathname.includes("add");
</script>

<div
  class="px-2 lg:px-0 lg:w-1/2 w-full m-auto lg:pt-0 pt-14 lg:mb-4 lg:mt-40 lg:relative fixed lg:backdrop-filter-none backdrop-blur-xl"
  id="top"
>
  <h1
    class="text-3xl p-4 lg:px-6 pl-6 mt-2 flex justify-between items-center w-full"
    class:hidden={$page.url.pathname.includes("add")}
  >
    Earn
    <a
      class="btn btn-primary lg:btn-md btn-sm"
      id="new-position"
      href={navigate("/earn/add", url)}>+ New Position</a
    >
  </h1>
  {#if !add}
    {#if mode == "otc"}
      <div
        class="flex flex-wrap justify-between w-full m-auto lg:space-x-4 lg:px-0 px-2 relative"
      >
        <div class="join lg:flex-grow lg:text-base" id="deposits">
          <div
            class="btn btn-outline lg:lg:btn-sm btn-xs btn-xs no-animation cursor-default hover:text-inherit join-item bg-gradient lg:flex-grow"
          >
            <span class="hidden lg:inline-block">Total </span>Deposit
          </div>
          <div
            class="btn btn-outline lg:btn-sm btn-xs no-animation cursor-default hover:text-inherit join-item bg-gradient"
          >
            <CoinIcon symbol="ETC" className="lg:text-2xl text-base" />{commify(
              formatEther($usePositionsStats?.totalDeposited || "0")
            )}
          </div>
        </div>
        <div class="join lg:flex-grow" id="apy">
          <div
            class="btn btn-outline lg:btn-sm btn-xs no-animation cursor-default hover:text-inherit join-item bg-gradient lg:flex-grow"
          >
            APY
          </div>
          <div
            class="btn btn-outline lg:btn-sm btn-xs no-animation cursor-default hover:text-inherit join-item bg-gradient"
          >
            {$usePositionsStats?.APY / 100}%
          </div>
        </div>
        <div class="join lg:flex-grow" id="pnl">
          <div
            class="btn btn-outline lg:btn-sm btn-xs no-animation cursor-default hover:text-inherit join-item bg-gradient flex-grow"
          >
            PnL
          </div>
          <div
            class="btn btn-outline lg:btn-sm btn-xs no-animation cursor-default hover:text-inherit join-item bg-gradient"
          >
            <CoinIcon className="lg:text-2xl text-base" symbol="ETC" />{commify(
              formatEther($usePositionsStats?.pnl || "0")
            )}
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <div
      class="flex justify-between items-center lg:pt-0 pt-4 px-4 w-full lg:relative"
    >
      <a class="lg:w-1/3" href={navigate("/earn", url)}>
        <Icon icon="ph-arrow-left-bold" class="text-2xl" />
      </a>
      <h1 class="lg:text-xl text-lg lg:w-1/3 text-center lg:font-semibold">
        New Position
      </h1>
      <div class="lg:w-1/3" />
    </div>
  {/if}
</div>

<slot />
