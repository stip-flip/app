<script lang="ts">
  import Icon from "@iconify/svelte";
  import { useClaims } from "src/hooks/claims";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";
  import Otc from "./_otc.svelte";
  import Token from "./_token.svelte";

  $: poolInfos = useSynthInfos;
  $: claimInfos = useClaims;

  $: trades = $poolInfos.filter((pi) => (pi?.token?.balance || 0) > 0);

  $: claims = $claimInfos;

  $: claimExists = claims?.some((c) => !!c.length);
  // onMount(updateVc);
</script>

<div
  class="px-8 lg:px-0 lg:w-1/2 w-full m-auto lg:pt-0 pt-20 lg:mt-40 flex justify-between items-center lg:relative fixed lg:backdrop-filter-none backdrop-blur-xl"
  id="top"
>
  <h1 class="text-3xl">Wallet</h1>
</div>
<div class="lg:h-auto lg:pt-0 container-height" id="container">
  {#if !claimExists && trades?.length == 0}
    <div
      class="lg:w-1/2 m-auto mt-24 lg:mt-4 lg:border-2 lg:border-primary rounded-lg p-4 lg:bg-gradient"
    >
      <div class="text-center">
        <Icon icon="octicon:inbox-24" class="text-5xl m-auto" />
        <p class="text-lg mt-4">Your wallet is empty at the moment</p>

        <p class="text-lg">
          Go <a href="swap" class="text-accent">swap</a> some tokens!
        </p>
      </div>
    </div>
  {/if}

  {#if trades?.length != 0}
    <div
      class="lg:w-1/2 m-auto mt-4 lg:mt-4 lg:border-2 lg:border-primary lg:rounded-lg lg:p-4 lg:bg-gradient overflow-scroll"
      style="max-height: 60vh"
    >
      <!-- <strong>Your wallet is empty at the moment</strong> -->
      <table class="table w-full lg:bg-gradient lg:rounded-lg rounded-none">
        <thead>
          <tr>
            <th class="text-left">Token</th>
            <th class="text-left">Balance</th>
            <th class="text-right">Funding Rate</th>
            <!-- <th /> -->
          </tr>
        </thead>
        <tbody>
          {#each trades as t, i}
            <Token
              token={t.token?.info}
              balance={t.token?.balance}
              pnl={0}
              tick={t.tick}
            />
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
  {#if claimExists}
    <div
      class="px-8 lg:px-0 lg:w-1/2 mt-4 m-auto flex justify-between items-center"
    >
      <h1 class="lg:text-3xl text-xl">OTC Trades</h1>
    </div>
    <div
      class="lg:w-1/2 m-auto mt-4 lg:mt-4 lg:border-2 lg:border-primary lg:rounded-lg lg:p-4 lg:bg-gradient"
    >
      <!-- <h2 class="text-2xl mb-4">OTC Trades</h2> -->
      {#each claims as claim, i}
        {#if claim.length}
          <table class="table w-full lg:bg-gradient mb-4 rounded-none">
            <thead>
              <tr>
                <th class="text-left lg:w-1/3">Token</th>
                <th class="text-left"
                  ><span class="lg:inline-block hidden">Estimated</span> Amount</th
                >
                <th class="text-left lg:table-cell hidden">Automated</th>
                <th class="text-right lg:px-8">Next Settlement</th>
                <!-- <th /> -->
              </tr>
            </thead>
            <tbody>
              {#each claim as c, j}
                <Otc
                  token={$poolInfos.find((pi) => pi.address == c.pool)?.token
                    ?.info}
                  claim={c}
                />
              {/each}
            </tbody>
          </table>
        {:else}
          <span />
        {/if}
        {#if !!claim.some((c) => c.claimable)}
          <div class="px-8 lg:px-0 flex justify-end mt-4 items-center mb-4">
            <button
              class="btn btn-primary w-1/3"
              on:click={(_) => {
                const poolAddress = claim?.[0].pool;
                if (!poolAddress) return;
                const enters = (claim || [])
                  .filter((c) => !c.exit && c.claimable)
                  .map((c) => c.round);
                const exits = (claim || [])
                  .filter((c) => c.exit && c.claimable)
                  .map((c) => c.round);

                console.log("claim all", poolAddress);
                broadcastTransaction(
                  "Claiming all OTC trades",
                  $sdk.POOL.attach(poolAddress)
                    .connect($signer)
                    [
                      "claimAllSwap(uint64[],uint64[],address)"
                    ](enters, exits, $signerAddress)
                );
              }}
              >{claim.filter((c) => !!c.claimable).length > 1
                ? "claim all"
                : "claim"}</button
            >
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
