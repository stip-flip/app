<script lang="ts">
  import type { BigNumberish } from "ethers";
  import { usePoolInfos } from "src/hooks/pool";
  import { sdk } from "src/stores";
  import { signerAddress } from "svelte-ethers-store";
  import Token from "./_token.svelte";

  $: poolInfos = usePoolInfos;

  $: trades = $poolInfos.filter((pi) => (pi?.token?.balance || 0) > 0);
  let tokenInfos: {
    pnl: BigNumberish;
    tick: BigNumberish;
  }[] = [];
  $: {
    Promise.all(
      trades?.map(async (t) => {
        const pool = $sdk.POOL.attach(t.address);
        const [pnl, slot1] = await Promise.all([
          pool.traderPnL($signerAddress),
          pool.slot1(),
        ]);
        return {
          pnl,
          tick: slot1?.tick,
        };
      })
    )
      .then((res) => (tokenInfos = res))
      .catch((e) => console.error(e));
  }
</script>

<div
  class="px-8 lg:px-0 lg:w-1/2 m-auto mt-20 lg:mt-40 flex justify-between items-center"
>
  <h1 class="text-3xl">Wallet</h1>
</div>
<div
  class="lg:w-1/2 m-auto mt-20 lg:mt-4 mb-24 lg:border-2 rounded-lg p-4 bg-gradient"
>
  {#if trades?.length == 0}
    <strong>Your trades will appear here</strong>
  {:else}
    <table class="table w-full bg-gradient">
      <thead>
        <tr>
          <th class="text-left">Token</th>
          <th class="text-left">Balance</th>
          <th class="text-left">Funding Rate</th>
          <!-- <th class="text-left">Liquidation Price</th> -->
          <th />
          <!-- <th class="text-left">PnL</th> -->
          <!-- <th class="text-left">Funding Rate</th> -->
        </tr>
      </thead>
      <tbody>
        {#each tokenInfos as ti, i}
          <Token
            token={trades[i].token?.info}
            balance={trades[i].token?.balance}
            pnl={ti.pnl}
            tick={ti.tick}
          />
        {/each}
      </tbody>
    </table>
  {/if}
</div>
