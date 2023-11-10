<script lang="ts">
  import type { BigNumberish } from "ethers";
  import { formatUnits, parseEther } from "ethers/lib/utils";
  import { useInfo } from "src/hooks/erc20";
  import { usePoolInfos } from "src/hooks/pool";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signerAddress } from "svelte-ethers-store";
  import Token from "./_token.svelte";

  $: poolInfos = usePoolInfos();

  $: collateralInfo = useInfo($sdk.USDC.address);

  $: trades = $poolInfos.filter((pi) => (pi?.token?.balance || 0) > 0);
  let tokenInfos: {
    leverage: BigNumberish;
    liquidationPrice: BigNumberish;
    pnl: BigNumberish;
    fr: BigNumberish;
  }[] = [];
  $: {
    Promise.all(
      trades?.map(async (t) => {
        const pool = $sdk.POOL.attach(t.address);
        console.log(t.address);
        const [leverage, liquidationPrice, pnl, slot0] = await Promise.all([
          pool.leverage($signerAddress),
          pool.liquidationPrice($signerAddress).catch((e) => console.log(e)),
          pool.traderPnL($signerAddress),
          pool.slot0(),
        ]);
        console.log(pnl);
        return {
          leverage,
          liquidationPrice,
          pnl,
          fr: slot0?.fr,
        };
      })
    )
      .then((res) => (tokenInfos = res))
      .catch((e) => console.error(e));
  }
</script>

<div class="w-1/2 m-auto mt-40 flex justify-between items-center">
  <h1 class="text-3xl">Wallet</h1>
</div>
<div class="w-1/2 m-auto mt-4 mb-24 border-2 rounded-lg p-4 bg-gradient">
  {#if trades?.length == 0}
    <strong>Your trades will appear here</strong>
  {:else}
    <table class="table w-full">
      <thead>
        <tr>
          <th class="text-left">Token</th>
          <th class="text-left">Balance</th>
          <th class="text-left">Leverage</th>
          <th class="text-left">Liquidation Price</th>
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
            leverage={ti.leverage}
            liquidationPrice={ti.liquidationPrice}
            pnl={ti.pnl}
            fr={ti.fr}
          />
        {/each}
      </tbody>
    </table>
  {/if}
</div>
