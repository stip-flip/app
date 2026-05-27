<script lang="ts">
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { commify } from "src/lib";
  import CoinIcon from "./coin-icon.svelte";

  export let selectedToken: TokenInfoAndBalance | undefined;
  export let sortedTokens: TokenInfoAndBalance[];
</script>

<ul class="token-list w-full overflow-y-auto px-4 py-3 lg:px-0" style="height: 40vh;">
  {#each sortedTokens || [] as token (token.info.address)}
    <!-- {#if token.info.address == selectedToken?.info.address} -->
    <li>
      <button
        type="button"
        class="token-row w-full cursor-pointer"
        class:token-row-selected={token.info.address == selectedToken?.info.address}
        id="list-token"
        on:click={(_) => {
          selectedToken = token;
        }}
      >
      <div class="flex min-w-0 items-start gap-3">
        <CoinIcon symbol={token.info.symbol} />
        <div class="min-w-0 flex-1">
          <div class="flex items-baseline justify-between gap-3">
            <strong class="truncate text-base">
              {token.info.symbol}
            </strong>
            <span class="shrink-0 text-sm text-base-content/60">
              {commify(token?.balance, 4)}
            </span>
          </div>
          <p class="mt-1 truncate text-sm text-base-content/68">
            {token.info.name}
          </p>
          {#if token.info.address == selectedToken?.info.address}
            <p class="mt-2 text-sm leading-relaxed text-base-content/72">
              {token?.info?.description ||
                "Native settlement asset for protocol collateral and settlement."}
            </p>
          {/if}
        </div>
      </div>
      </button>
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

<style>
  .token-list {
    scrollbar-width: thin;
  }

  .token-row {
    border: 1px solid transparent;
    border-radius: 0.5rem;
    padding: 0.8rem;
    text-align: left;
    transition:
      background-color 160ms ease,
      border-color 160ms ease;
  }

  .token-row:hover {
    background: rgb(255 255 255 / 0.06);
    border-color: rgb(var(--sf-border) / 0.1);
  }

  .token-row-selected {
    background: rgb(var(--sf-green) / 0.12);
    border-color: rgb(var(--sf-green) / 0.24);
  }
</style>
