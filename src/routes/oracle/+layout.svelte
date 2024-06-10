<script lang="ts">
  import { page } from "$app/stores";
  import { formatEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { useOracleInfo } from "src/hooks/sf/oracle";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";
  // import {  } from "svelte/transition";

  $: oracleInfo = useOracleInfo($signerAddress, $sdk.ORACLE.address);
</script>

<div
  class="px-8 lg:px-0 lg:w-1/2 m-auto mt-32 mb-4 flex justify-between items-center"
>
  <h1 class="text-3xl">Oracle</h1>
</div>

<div class="m-auto flex flex-wrap justify-around lg:w-1/2 space-x-4">
  <div class="join flex-grow">
    <div
      class="btn btn-outline no-animation hover:text-inherit join-item bg-gradient flex-grow"
    >
      Stakes
    </div>
    <div
      class="btn btn-outline no-animation cursor-default hover:text-inherit join-item bg-gradient"
    >
      <CoinIcon symbol="ETC" />{commify(
        formatEther($oracleInfo?.stakes || "0")
      )}
    </div>
  </div>
  <div class="join flex-grow">
    <div
      class="btn btn-outline no-animation cursor-default hover:text-inherit join-item bg-gradient flex-grow"
    >
      MANA
    </div>
    <div
      class="btn btn-outline no-animation cursor-default hover:text-inherit join-item bg-gradient"
    >
      {commify(formatEther($oracleInfo?.mana || "0"))}
    </div>
  </div>
  <div
    class="join flex-grow"
    on:click={(_) => {
      if ($oracleInfo?.rewards.isZero()) return;
      broadcastTransaction(
        "Claiming oracle rewards",
        $sdk.ORACLE.connect($signer).claim($signerAddress)
      );
    }}
  >
    <div
      class="btn btn-outline no-animation hover:text-inherit join-item bg-gradient flex-grow"
    >
      Rewards
    </div>
    <div
      class="btn btn-outline no-animation hover:text-inherit join-item bg-gradient"
    >
      <CoinIcon symbol="ETC" />{commify(
        formatEther($oracleInfo?.rewards || "0")
      )}
    </div>
  </div>
  <!-- <a class="btn btn-primary flex-grow" href={navigate("/earn/add", url)}
    >+ New Position</a
  > -->
</div>

<div
  class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 mt-4 m-auto overflow-scroll scrollbar-hide"
  style="max-height: 60vh"
>
  <div class="tabs tabs-boxed">
    <a
      class="tab tab-lg w-1/2"
      href="/oracle/deposit"
      class:tab-active={$page.route.id?.includes("/deposit")}>Deposit</a
    >
    <a
      class="tab tab-lg w-1/2"
      href="/oracle/withdraw"
      class:tab-active={$page.route.id?.includes("/withdraw")}>Withdraw</a
    >
  </div>

  <div class="divider" />

  <slot />
</div>
