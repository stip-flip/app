<script lang="ts">
  import { page } from "$app/stores";
  import { formatEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { useOracleInfo } from "src/hooks/sf/oracle";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify, updateVc } from "src/lib";
  import { sdk } from "src/stores";
  import { onMount } from "svelte";
  import { signer, signerAddress } from "svelte-ethers-store";
  // import {  } from "svelte/transition";

  $: oracleInfo = useOracleInfo($signerAddress, $sdk.ORACLE.address);

  onMount(updateVc);
</script>

<div
  class="p-4 lg:pt-0 lg:h-auto overflow-y-scroll overflow-x-hidden container-height"
  id="container"
>
  <div class="m-auto flex flex-wrap justify-around lg:w-1/2 gap-4">
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

  <!-- <div
    class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 mt-4 m-auto overflow-scroll scrollbar-hide"
  >
    Staking on the S&F oracle is officially open 🛎️ <br />
    MANA distribution will start from the <strong>18th of June 2024</strong> with
    each price submission.
    <br />To learn more on how to become a price provider
    <a
      class="text-info font-bold"
      href="https://docs.sf.exchange/docs/developer/provide-data"
      >visit this page</a
    >
  </div> -->
  <div
    class="lg:border-2 lg:border-primary-focus rounded-lg lg:p-4 lg:bg-gradient bg-opacity-80 lg:w-1/2 mt-4 m-auto overflow-scroll scrollbar-hide"
  >
    <div class="pb-4">
      To learn more on how to become a price provider
      <a
        class="text-info font-bold"
        href="https://docs.sf.exchange/docs/developer/provide-data"
        >visit this page</a
      >
    </div>
    <div class="tabs tabs-boxed">
      <a
        class="tab tab-lg w-1/2"
        href="/oracle/{$page.params.address}/deposit"
        class:tab-active={$page.route.id?.includes("/deposit")}>Deposit</a
      >
      <a
        class="tab tab-lg w-1/2"
        href="/oracle/{$page.params.address}/withdraw"
        class:tab-active={$page.route.id?.includes("/withdraw")}>Withdraw</a
      >
    </div>

    <div class="divider" />

    <slot />
  </div>
</div>
