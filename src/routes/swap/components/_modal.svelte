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

<label for={id} class="lg:modal cursor-pointer z-20 hidden">
  <label class="w-full lg:w-1/2">
    <div class="bg-opaque lg:rounded-xl lg:border block p-8" for="">
      <div class="flex justify-around pb-4">
        <label
          tabindex="0"
          class="text-lg px-4 cursor-pointer border-primary"
          class:font-bold={selectToken == "token0"}
          class:border-b-2={selectToken == "token0"}
          on:click={(_) => {
            selectToken = "token0";
          }}
        >
          Sell {selectedToken0?.info?.symbol || "Token 1"}
        </label>
        <label
          tabindex="0"
          class="text-lg px-4 cursor-pointer border-primary"
          class:font-bold={selectToken == "token1"}
          class:border-b-2={selectToken == "token1"}
          on:click={(_) => {
            selectToken = "token1";
          }}
        >
          Buy {selectedToken1?.info?.symbol || "Token 2"}
        </label>
      </div>
      <div
        class="join shadow-lg rounded-full border border-gray-200 w-full mt-2 bg-base-300"
      >
        <div class="border-b m-4">
          <Icon icon="akar-icons:search" class=" text-lg text-slate-300" />
        </div>
        <input
          type="text"
          class="input input-ghost w-full join-item"
          bind:value={search}
          placeholder="Search"
        />
      </div>
      <div class="flex pt-4 lg:space-x-4">
        <Menu bind:terms />
        <TokenList bind:selectedToken {sortedTokens} />
      </div>
    </div>
    <div class="flex py-4 justify-between lg:w-full">
      <button
        class="btn !bg-opaque w-2/5 border border-base-100"
        on:click={(_) => {
          checkbox.click();
        }}>Close</button
      >
      {#if selectedToken}
        <!-- <button
          transition:scale|local
          class="btn btn-primary no-animation w-2/5">Token 2</button
        > -->
        {#if selectToken == "token0"}
          <div
            transition:scale|local
            class="btn btn-primary no-animation w-2/5"
            id="modal-next"
            on:click={(e) => {
              e.preventDefault();
              selectToken = "token1";
            }}
          >
            Token 2
          </div>
        {:else if selectToken == "token1"}
          {#if !otherTokenSelected}
            <label
              transition:scale|local
              class="btn btn-primary no-animation w-2/5"
              on:click={(e) => {
                e.preventDefault();
                !otherTokenSelected
                  ? (selectToken = "token0")
                  : checkbox.click();
              }}>{!otherTokenSelected ? "Token 1" : "Done"}</label
            >
          {:else}
            <button
              class="btn btn-primary no-animation w-2/5"
              id="done"
              on:click={(e) => {
                e.preventDefault();
                checkbox.click();
                // if ($appState.help) {
                //   driveOTC(
                //     selectedToken0?.info?.symbol,
                //     selectedToken1?.info?.symbol
                //   );
                // }
              }}
            >
              Done
            </button>
          {/if}
        {/if}
      {/if}
      <!-- <buton class="btn btn-primary flex-grow">Token 2</buton> -->
    </div>
  </label>
</label>

<Drawer.Root bind:open>
  <Drawer.Trigger />
  <Drawer.Portal>
    <Drawer.Overlay class="fixed inset-0 bg-black/40 lg:hidden" />
    <Drawer.Content
      class="rounded-t-3xl pb-8 pt-3 bg-opaque fixed bottom-0 left-0 right-0 fine-border lg:hidden z-10"
    >
      <div class="w-1/6 mb-8 h-1 bg-base-content border- m-auto" />
      <TokenList bind:selectedToken {sortedTokens} />
      <Menu bind:terms />
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
