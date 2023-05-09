<script lang="ts">
  import { formatUnits } from "ethers/lib/utils";
  import { usdcInfo } from "src/hooks/erc20";
  import { commify, formatAmount } from "src/lib";
  import { sdk } from "src/stores";
  import { signerAddress } from "svelte-ethers-store";

  export let bytes: string[];
  export let poolAddress: string;
  export let positions: Record<string, any>;
</script>

<div class="overflow-x-auto">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th>FR Range</th>
        <th>Liquidity</th>
        <th>Liquidity Active</th>
        <th>Fees accumulated</th>
      </tr>
    </thead>
    <tbody>
      {#each bytes as b}
        <tr class="hover">
          <td
            >{positions[b].tickLower / 1000} to {positions[b].tickUpper /
              1000}%</td
          >
          <td
            >{formatAmount(
              positions[b].liquidity,
              $usdcInfo?.decimals || 18
            )}</td
          >
          <td>{commify((positions[b].liquidityActive * 100).toFixed(2))} %</td>
          <td>
            {#await $sdk.POOL.attach(poolAddress).positionPnL(positions[b].tickLower, positions[b].tickUpper, $signerAddress) then pnl}
              {commify(formatUnits(pnl, $usdcInfo?.decimals || 18))}
            {/await}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
