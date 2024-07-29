<script lang="ts">
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { commify } from "src/lib";
  import { scale, slide } from "svelte/transition";
  import Menu from "./_menu.svelte";
  import { chainId } from "svelte-ethers-store";
  import { EtherWhitelist } from "src/stores/whitelist";

  import TokenList from "src/components/token-list.svelte";
  import { Drawer } from "vaul-svelte";

  export let id: string;
  export let otherTokenSelected: TokenInfoAndBalance;
  export let selectToken: "token0" | "token1";
  export let selectedToken0: TokenInfoAndBalance;
  export let selectedToken1: TokenInfoAndBalance;
  export let selectedToken: TokenInfoAndBalance;

  export let tokenInfosAndBalances: TokenInfoAndBalance[];
  export let checkbox: HTMLInputElement;
  export let open: boolean = false;

  const ZERO_ADDRESS = "0x0";

  let terms: string[] = [];
  let search: string = "";

  $: sortedTokens = (tokenInfosAndBalances || [])
    .sort((a, b) => (a.balance > b.balance ? -1 : 1))
    .filter(
      (t) =>
        !terms.length ||
        terms.every((term) => {
          if (term == "zero-leverage")
            return (
              !t.info.name.toLowerCase().includes("²") &&
              !t.info.name.toLowerCase().includes("³")
            );
          if (term == "squared-leverage")
            return t.info.name.toLowerCase().includes("²");
          if (term == "cubed-leverage")
            return t.info.name.toLowerCase().includes("³");
          if (term == "stip" && t.info.symbol == "ETC") return true;
          return t.info.name.toLowerCase().includes(term.toLowerCase());
        })
    )
    .filter((t) =>
      search.length
        ? t.info.name.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((t) =>
      $chainId == 61
        ? t.info.symbol == "ETC"
          ? true
          : EtherWhitelist[t.info.symbol]
        : true
    );

  $: {
    if (!sortedTokens.length && selectedToken0?.info.address != ZERO_ADDRESS) {
      sortedTokens = tokenInfosAndBalances.filter(
        (t) => t.info.address == ZERO_ADDRESS
      );
    }
  }

  $: console.log(terms);
</script>

<input
  type="checkbox"
  {id}
  class="modal-toggle lg:block hidden"
  bind:this={checkbox}
/>

<Drawer.Root bind:open>
  <!-- <Drawer.Trigger /> -->
  <Drawer.Portal>
    <Drawer.Overlay
      class="fixed inset-0 bg-black/40 lg:hidden z-10"
      id="overlay"
    />
    <Drawer.Content
      class="rounded-t-3xl pb-8 pt-3 bg-opaque fixed bottom-0 left-0 right-0 fine-border lg:hidden z-10"
      id="drawer-content"
    >
      <div class="w-1/6 mb-8 h-1 bg-base-content border- m-auto" />
      <TokenList bind:selectedToken {sortedTokens} />
      <Menu bind:terms />
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
