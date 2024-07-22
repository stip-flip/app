<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatEther } from "ethers/lib/utils";
  import { commify } from "src/lib";
  import Modal from "./_modal.svelte";
  import type { PositionClaim } from "src/hooks/sf/positionClaims";
  import { sdk, timestamp } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";
  import { broadcastTransaction } from "src/hooks/transactions";

  // export let bytes: string[];
  export let poolName: string;
  // export let poolAddress: string;
  export let claims: PositionClaim[];

  let selectedPosition: any;

  function getTimeDifference(settlement: number, givenTime: number) {
    let differenceInSeconds = Math.abs(settlement - givenTime);
    // console.log(now, givenTime, differenceInSeconds);
    const hours = Math.floor(differenceInSeconds / 3600);
    differenceInSeconds %= 3600;
    const minutes = Math.floor(differenceInSeconds / 60);
    const seconds = Math.floor(differenceInSeconds % 60);

    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }
  // $: timeleft = getTimeDifference(claim?.settlementTimestamp || 0, $timestamp);
</script>

<div class="overflow-x-auto lg:bg-gradient">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="w-1/3 lg:w-auto">Kind</th>
        <th class="w-1/3 lg:w-auto">Estimated Amount</th>
        <th class="w-1/3 lg:w-auto lg:table-cell hidden">Automated</th>
        <th class="w-1/3 lg:w-auto text-right px-8">Settlement</th>
      </tr>
    </thead>
    <tbody>
      {#each claims as claim}
        <tr class="hover">
          <td>
            <strong>{claim?.burn ? "Withdraw" : "Deposit"}</strong>
          </td>
          <td class="text-left lg:flex items-center">
            <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
            {commify(formatEther(claim?.amount || 0), 4)}
          </td>
          <td class="text-left lg:table-cell hidden">
            {claim?.automated ? "Yes" : "No"}
          </td>
          <td class="text-right px-8">
            {#if claim?.canceled}
              <span class="text-warning">Canceled</span>
            {:else if claim?.claimable}
              <span class="text-green-600">Settled</span>
            {:else if (claim?.settlementTimestamp || 0) < $timestamp}
              <span class="text-info-600">Awaiting Next Price</span>
            {:else}
              <span
                >{getTimeDifference(
                  claim?.settlementTimestamp || 0,
                  $timestamp
                )}</span
              >
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
{#if !!claims.some((c) => !!c?.claimable)}
  <div class="px-8 lg:px-0 flex justify-end mt-4 items-center">
    <button
      class="btn btn-primary w-1/3"
      on:click={(_) => {
        const poolAddress = claims?.[0].pool;
        if (!poolAddress) return;
        const mints = (claims || []).filter((c) => !c.burn && c.claimable);

        const burns = (claims || []).filter((c) => c.burn && c.claimable);

        console.log("claim all", poolAddress, mints, burns);
        broadcastTransaction(
          `Claiming all ${poolName} positions`,
          $sdk.POOL.attach(poolAddress)
            .connect($signer)
            ["claimAllPosition(uint64[],int24[],uint64[],int24[],address)"](
              mints.map((m) => m.round),
              mints.map((m) => m.tick),
              burns.map((b) => b.round),
              burns.map((b) => b.tick),
              $signerAddress
            )
        );
      }}
      >{claims.filter((c) => !!c.claimable).length > 1
        ? "claim all"
        : "claim"}</button
    >
  </div>
{/if}
