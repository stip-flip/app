<script lang="ts">
  import { formatUnits } from "ethers/lib/utils";
  import { uniq } from "lodash";
  import { useInfo, useInfosAndBalances } from "src/hooks/erc20";
  import { usePoolInfos } from "src/hooks/pool";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";

  $: poolInfos = usePoolInfos();

  $: collateralInfo = useInfo($sdk.USDC.address);

  $: trades = $poolInfos.filter((pi) => (pi?.token?.balance || 0) > 0);
</script>

<div class="w-1/2 m-auto mt-32 border-2 rounded-lg p-4">
  <h1 class="p-2 pb-6 text-xl font-bold">Trades</h1>
  {#if trades?.length == 0}
    <strong>Your trades will appear here</strong>
  {:else}
    <table class="table w-full">
      <thead>
        <tr>
          <th class="text-left">Token</th>
          <th class="text-left">Balance</th>
          <th class="text-left">Collateral</th>
          <th class="text-left">Liquidation Price</th>
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
                formatUnits(
                  t?.trade.collateral || "0",
                  $collateralInfo.decimals
                ),
                2
              )}
              {$collateralInfo.name || "USDN"}
            </td>
            <td> TODO </td>
            <td>
              {commify(formatUnits(t?.slot0?.fr || "0", 12), 2)} %
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
