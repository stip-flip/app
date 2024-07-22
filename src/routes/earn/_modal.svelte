<script lang="ts">
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { commify } from "src/lib";
  import { slide } from "svelte/transition";
  import Menu from "src/routes/swap/components/_menu.svelte";
  import { Drawer } from "vaul-svelte";
  import TokenList from "src/components/token-list.svelte";

  export let id: string;
  export let selectedToken: TokenInfoAndBalance | undefined;

  export let tokenInfosAndBalances: TokenInfoAndBalance[];

  export let open: boolean = false;

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
    );

  let checkbox: HTMLInputElement;
  $: console.log("terms", terms);
</script>

<input
  type="checkbox"
  {id}
  class="modal-toggle lg:block hidden"
  bind:this={checkbox}
/>

<label for={id} class="lg:modal cursor-pointer hidden">
  <label class="w-full lg:w-2/5">
    <div class="bg-opaque lg:rounded-xl lg:border block lg:p-8">
      <div class="lg:join shadow-lg lg:rounded-full w-full mt-2 hidden">
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
    <div class="lg:flex py-4 justify-end lg:w-full hidden">
      {#if selectedToken}
        <!-- <button
          transition:scale|local
          class="btn btn-primary no-animation w-2/5">Token 2</button
        > -->
        <button
          class="absolute btn btn-primary no-animation w-1/5"
          on:click={(_) => {
            checkbox.click();
            // if ($appState.help) {
            //   driveOTC(
            //     selectedToken0?.info?.symbol,
            //     selectedToken1?.info?.symbol
            //   );
            // }
          }}
        >
          OK
        </button>
      {/if}
    </div>
  </label>
</label>

<Drawer.Root bind:open>
  <!-- <Drawer.Trigger /> -->
  <Drawer.Portal>
    <Drawer.Overlay class="fixed inset-0 bg-black/40" />
    <Drawer.Content
      class="rounded-t-3xl pb-8 pt-3 bg-opaque fixed bottom-0 left-0 right-0 fine-border"
    >
      <div class="w-1/6 mb-8 h-1 bg-base-content rounded-full border- m-auto" />
      <TokenList bind:selectedToken {sortedTokens} />
      <Menu bind:terms />
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
