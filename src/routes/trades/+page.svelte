<script lang="ts">
  import type { BigNumberish } from "ethers";
  import { formatUnits, parseEther } from "ethers/lib/utils";
  import { useInfo } from "src/hooks/erc20";
  import { usePoolInfos } from "src/hooks/pool";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signerAddress } from "svelte-ethers-store";

  $: poolInfos = usePoolInfos();

  $: collateralInfo = useInfo($sdk.USDC.address);

  $: trades = $poolInfos.filter((pi) => (pi?.token?.balance || 0) > 0);
  let exitPreviews: {
    liquidationPrice: BigNumberish;
    liquidityMoved: BigNumberish;
    feeAmount: BigNumberish;
    frAfter: BigNumberish;
    pnl_: BigNumberish;
  }[] = [];
  $: {
    Promise.all(
      trades?.map(async (t) => {
        const res = await $sdk.POOL.attach(t.address)
          .connect($signerAddress)
          .previewExit(parseEther(String(t?.token?.balance) || "0"));
        const sv = res.liquidityMoved.sub(res.feeAmount);
        // liquidation price is the price at which the shares value is equal to the debt
        //@todo
        // compute the gap between sharesValue and debt
        const gap = sv.sub(t.debt);
        // how much % does the gap represent in shares value
        const gapPercent = gap.mul(100).div(sv);
        console.log(
          t.long,
          t.token?.info.name,
          res.pnl_,
          formatUnits(t.currentPrice, 8)
        );
        // the price needs to move by the gap percent to liquidate
        const liquidationPrice = t.long
          ? t.currentPrice.sub(t.currentPrice.mul(gapPercent).div(100))
          : t.currentPrice.add(t.currentPrice.mul(gapPercent).div(100));
        return {
          ...res,
          liquidationPrice,
        };
      })
    ).then((res) => (exitPreviews = res));
  }
</script>

<div class="w-1/2 m-auto mt-40 flex justify-between items-center">
  <h1 class="text-3xl">Trades</h1>
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
          <th class="text-left">Debt</th>
          <th class="text-left">Liquidation Price</th>
          <th class="text-left">PnL</th>
          <th class="text-left">Funding Rate</th>
        </tr>
      </thead>
      <tbody>
        {#each trades || [] as t, i}
          <tr class="hover cursor-pointer">
            <td>
              <strong>{t.token?.info.name}</strong>
            </td>
            <td>
              {commify(t.token?.balance, 2)}
            </td>
            <td>
              {commify(
                formatUnits(t?.debt || "0", $collateralInfo?.decimals),
                2
              )}
              {$collateralInfo.name || "USDN"}
            </td>
            <td
              >{commify(
                formatUnits(exitPreviews?.[i]?.liquidationPrice || "0", 8)
              )}</td
            >
            <td>
              {commify(
                formatUnits(
                  exitPreviews?.[i]?.pnl_ || "0",
                  $collateralInfo.decimals
                ),
                2
              )}
              {$collateralInfo.name || "USDN"}
            </td>
            <td>
              {commify(formatUnits(t?.slot0?.fr || "0", 18 + 3), 2)} %
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
