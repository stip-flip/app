<script lang="ts">
  import { page } from "$app/stores";
  import { formatEther } from "ethers/lib/utils";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { useOracleInfo } from "src/hooks/sf/oracle";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify, updateVc } from "src/lib";
  import { navigate } from "src/lib/path";
  import { sdk } from "src/stores";
  import { onMount } from "svelte";
  import { signer, signerAddress } from "svelte-ethers-store";
  // import {  } from "svelte/transition";

  $: oracleAddress = $page.params.address;
  $: oracleContract = $sdk?.ORACLE?.attach(oracleAddress);
  $: oracleInfo = useOracleInfo($signerAddress, oracleAddress);
  $: rewardsClaimable = Boolean($oracleInfo?.rewards && !$oracleInfo.rewards.isZero());

  onMount(updateVc);
</script>

<div class="p-4 lg:pt-0 lg:h-auto overflow-y-scroll overflow-x-hidden container-height" id="container">
  <div class="m-auto grid gap-3 lg:w-1/2 md:grid-cols-3">
    <div class="app-panel rounded-lg border border-white/10 p-4">
      <div class="app-label">Settlement stake</div>
      <div class="mt-2 flex items-center gap-2 text-2xl font-bold">
        <CoinIcon symbol="ETC" />{commify(formatEther($oracleInfo?.stakes || "0"))}
      </div>
      <div class="app-muted mt-1 text-xs">ETC deposited by this wallet</div>
    </div>

    <div class="app-panel rounded-lg border border-white/10 p-4">
      <div class="app-label">MANA</div>
      <div class="mt-2 text-2xl font-bold">{commify(formatEther($oracleInfo?.mana || "0"))}</div>
      <div class="app-muted mt-1 text-xs">Oracle participation weight</div>
    </div>

    <div class="app-panel rounded-lg border border-white/10 p-4">
      <div class="app-label">Rewards</div>
      <div class="mt-2 flex items-center gap-2 text-2xl font-bold">
        <CoinIcon symbol="ETC" />{commify(formatEther($oracleInfo?.rewards || "0"))}
      </div>
      <button
        class="btn btn-outline btn-xs mt-3 rounded-full"
        type="button"
        disabled={!rewardsClaimable || !oracleContract}
        on:click={() => {
          if (!rewardsClaimable) return;
          if (!oracleContract) return;
          broadcastTransaction(
            "Claiming oracle rewards",
            oracleContract.connect($signer).claim($signerAddress)
          );
        }}
      >
        Claim rewards
      </button>
    </div>
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
      href="https://docs.stipflip.xyz/docs/developer/provide-data"
      >visit this page</a
    >
  </div> -->
  <div class="app-panel rounded-lg border border-white/10 p-4 lg:w-1/2 mt-4 m-auto overflow-scroll scrollbar-hide">
    <div class="pb-4">
      Price providers keep settlement state aligned with external markets.
      <a
        class="text-info font-bold"
        href="https://docs.stipflip.xyz/docs/developer/provide-data"
        >Read the provider guide</a
      >
    </div>
    <div class="tabs tabs-boxed bg-base-200/50">
      <a
        class="tab tab-lg w-1/2 rounded-lg"
        href={navigate(`/oracle/${$page.params.address}/deposit`, $page.url)}
        class:tab-active={$page.route.id?.includes("/deposit")}>Deposit</a
      >
      <a
        class="tab tab-lg w-1/2 rounded-lg"
        href={navigate(`/oracle/${$page.params.address}/withdraw`, $page.url)}
        class:tab-active={$page.route.id?.includes("/withdraw")}>Withdraw</a
      >
    </div>

    <div class="divider"></div>

    <slot />
  </div>
</div>
