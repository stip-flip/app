<script lang="ts">
  import Icon from "@iconify/svelte";
  import { ethers } from "ethers";
  import { formatEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { useOracleInfo, useOraclesInfo } from "src/hooks/sf/oracle";
  import { commify, updateVc } from "src/lib";
  import { onMount } from "svelte";
  import { signerAddress } from "svelte-ethers-store";

  const ORACLES = [
    "0x4AC635E92801e657F44BDEfcc7660Ea1431DF846",
    ethers.constants.AddressZero,
    ethers.constants.AddressZero,
  ];

  const ORACLES_NAMES = ["Crypto", "Stocks", "Commodities"];

  const ORACLES_ICONS = [
    ["S-BTC", "S-ETH", "S-SOL", "S-XMR", "S-DOGE", "S-USD"],
    [],
    [],
    // ["S-AMZN", "S-TSLA", "S-GME", "S-APPL", "S-MSFT", "S-NFLX"],
    // ["S-GOLD", "S-SILVER", "S-OIL", "S-CORN", "S-WHEAT", "S-COFFEE"],
  ];

  const OPERATORS = [4, 0, 0];

  $: oracleInfo = useOraclesInfo(
    $signerAddress || ethers.constants.AddressZero,
    ORACLES
  );

  onMount(updateVc);
</script>

<div
  class="p-4 lg:pt-0 lg:h-auto overflow-y-scroll overflow-x-hidden container-height"
  id="container"
>
  <div class="m-auto lg:flex lg:gap-4 lg:w-1/2 w-full lg:px-0 px-4">
    {#each ORACLES as o, i}
      <div
        class="border border-primary rounded-xl p-4 lg:w-1/3 w-full bg-gradient lg:mb-0 mb-4"
      >
        <h1 class="text-xl font-bold pb-4 flex justify-between">
          {ORACLES_NAMES[i]}
          <div class="flex">
            {#each ORACLES_ICONS[i] as icon}
              <CoinIcon symbol={icon} className="-mr-2" />
            {/each}
          </div>
        </h1>

        <div class="flex justify-between py-2">
          <p>Stakes:</p>
          <p class="flex">
            <Icon icon="mdi:ethereum" class="text-green-600 text-2xl" />
            {commify(formatEther($oracleInfo[i]?.totalStakes || "0"), 2)}
          </p>
        </div>
        <div class="flex justify-between">
          <p>MANA Minted:</p>
          <p class="flex">
            {commify(formatEther($oracleInfo[i]?.totalMana || "0"), 2)}
            <!-- <Icon icon="mdi:ethereum" class="text-green-600 text-2xl" /> -->
          </p>
        </div>
        <div class="flex justify-between py-2">
          <p>Oracle Operators:</p>
          <p class="flex">
            {OPERATORS[i]}
            <!-- <Icon icon="mdi:ethereum" class="text-green-600 text-2xl" /> -->
          </p>
        </div>
        <div class="flex justify-end pt-4">
          {#if ORACLES[i] == ethers.constants.AddressZero}
            <a
              class="btn btn-outline w-1/2"
              href="/oracle/{ORACLES[i]}/deposit"
              disabled>Coming Soon</a
            >
          {:else}
            <a class="btn btn-outline w-1/2" href="/oracle/{ORACLES[i]}/deposit"
              >Stake</a
            >
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
