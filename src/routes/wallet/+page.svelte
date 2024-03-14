<script lang="ts">
  import Icon from "@iconify/svelte";
  import { useClaims, usePoolInfos } from "src/hooks/pool";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";
  import Otc from "./_otc.svelte";
  import Token from "./_token.svelte";

  $: poolInfos = usePoolInfos;
  $: claimInfos = useClaims;

  $: trades = $poolInfos.filter((pi) => (pi?.token?.balance || 0) > 0);

  $: claims = $claimInfos;

  $: claimExists = claims?.some((c) => !!c.length);

  $: console.log("claims", claims);
</script>

{#if claimExists}
  <div
    class="px-8 lg:px-0 lg:w-1/2 m-auto mt-20 lg:mt-40 flex justify-between items-center"
  >
    <h1 class="text-3xl">OTC Trades</h1>
  </div>
  <div
    class="lg:w-1/2 m-auto mt-4 lg:mt-4 lg:border-2 lg:border-primary rounded-lg p-4 lg:bg-gradient"
  >
    <!-- <h2 class="text-2xl mb-4">OTC Trades</h2> -->
    {#each claims as claim, i}
      {#if claim.length}
        <table class="table w-full bg-gradient">
          <thead>
            <tr>
              <th class="text-left w-1/3">Token</th>
              <th class="text-left">Estimated Amount</th>
              <th class="text-left">Automated</th>
              <th class="text-right px-8">Next Settlement</th>
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
        <div class="px-8 lg:px-0 flex justify-end mt-4 items-center">
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
              // broadcastTransaction(
              //   "Claiming all OTC trades",
              $sdk.POOL.attach(poolAddress)
                .connect($signer)
                [
                  "claimAll(uint64[],uint64[],address)"
                ](enters, exits, $signerAddress, { gasLimit: 1000000 });
              // );
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
{#if trades?.length != 0}
  <div
    class:mt-20={!claimExists}
    class:lg:mt-40={!claimExists}
    class="px-8 lg:px-0 lg:w-1/2 lg:mt-4 m-auto flex justify-between items-center"
  >
    <h1 class="text-3xl">Wallet</h1>
  </div>
  <div
    class="lg:w-1/2 m-auto mt-4 lg:mt-4 lg:border-2 lg:border-primary rounded-lg p-4 bg-gradient"
  >
    <!-- <strong>Your wallet is empty at the moment</strong> -->
    <table class="table w-full bg-gradient">
      <thead>
        <tr>
          <th class="text-left">Token</th>
          <th class="text-left">Balance</th>
          <th class="text-left">Funding Rate</th>
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
{#if !claimExists && trades?.length == 0}
  <div
    class="px-8 lg:px-0 lg:w-1/2 m-auto mt-20 lg:mt-40 flex justify-between items-center"
  >
    <h1 class="text-3xl">Wallet</h1>
  </div>
  <div
    class="lg:w-1/2 m-auto mt-4 lg:mt-4 lg:border-2 lg:border-primary rounded-lg p-4 bg-gradient"
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
