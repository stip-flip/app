<script lang="ts">
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { commify } from "src/lib";
  import CoinIcon from "./coin-icon.svelte";

  export let selectedToken: TokenInfoAndBalance | undefined;
  export let sortedTokens: TokenInfoAndBalance[];
</script>

<ul
  class="p-4 lg:rounded-box lg:shadow-lg w-full overflow-scroll"
  style="height: 40vh;"
>
  {#each sortedTokens || [] as token}
    <!-- {#if token.info.address == selectedToken?.info.address} -->
    <li
      class="px-2 pb-2 pt-2 cursor-pointer hover:bg-base-200 transition-all"
      class:border-b={token.info.address == selectedToken?.info.address}
      class:bg-base-100={token.info.address == selectedToken?.info.address}
      class:px-6={token.info.address == selectedToken?.info.address}
      id="list-token"
      on:click={(_) => {
        selectedToken = token;
      }}
    >
      <div class="flex space-x-2">
        <CoinIcon symbol={token.info.symbol} />
        <strong class="capitalize">
          <a>{token.info.symbol}</a> :
        </strong>
        <span>
          ({commify(token?.balance, 4)})
        </span>
        <p class:hidden={token.info.address != selectedToken?.info.address}>
          {token?.info?.description ||
            "Ether Coin, The Ether's native currency."}
        </p>
      </div>
    </li>
    <!-- {:else}
      <li
        class="flex p-2 px-6 -mx-4 cursor-pointer hover:bg-base-200 space-x-2"
        id="select-token"
        on:click={(_) => {
          selectedToken = token;
          // checkbox.click();
        }}
      >
        <CoinIcon symbol={token?.info?.symbol} />
        <strong class="capitalize">
          <a>{token?.info?.symbol}</a>
        </strong>
        <span>
          ({commify(token?.balance, 4)})
        </span>
      </li>
    {/if} -->
  {/each}
</ul>
