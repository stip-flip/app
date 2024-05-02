<script lang="ts">
  import Icon from "@iconify/svelte";
  import CoinIcon from "src/components/coin-icon.svelte";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { commify } from "src/lib";
  import { slide } from "svelte/transition";
  import Menu from "src/routes/swap/components/_menu.svelte";

  export let id: string;
  export let selectedToken: TokenInfoAndBalance | undefined;

  export let tokenInfosAndBalances: TokenInfoAndBalance[];

  let terms: string[] = [];
  let search: string = "";

  $: sortedTokens = (tokenInfosAndBalances || [])
    .sort((a, b) => (a.balance > b.balance ? -1 : 1))
    .filter(
      (t) =>
        !terms.length ||
        terms.every((term) => {
          if (term == "zero-leverage")
            return !t.info.name.toLowerCase().includes("/²|³/");
          if (term == "squared-leverage")
            return t.info.name.toLowerCase().includes("²");
          if (term == "cubed-leverage")
            return t.info.name.toLowerCase().includes("³");
          return t.info.name.toLowerCase().includes(term.toLowerCase());
        })
    )
    .filter((t) =>
      search.length
        ? t.info.name.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((t) => t.info.address != selectedToken?.info.address);

  let checkbox: HTMLInputElement;
</script>

<input type="checkbox" {id} class="modal-toggle" bind:this={checkbox} />
<label for={id} class="modal cursor-pointer">
  <label class="w-full lg:w-2/5">
    <div class="bg-opaque lg:rounded-xl lg:border block p-8" for="">
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
        <ul
          class="p-4 rounded-box shadow-lg border w-full bg-base-300 overflow-scroll"
          style="height: 40vh;"
        >
          {#if selectedToken}
            <li
              class="rounded-t-2xl px-6 pb-2 pt-2 cursor-pointer bg-base-100 -mt-4 -mx-4 border-b"
              transition:slide|local
              on:click={(_) => {
                selectedToken = undefined;
              }}
            >
              <div class="flex space-x-2">
                <CoinIcon symbol={selectedToken.info.symbol} />
                <strong class="capitalize">
                  <a>{selectedToken.info.symbol}</a> :
                </strong>
                <p>
                  {selectedToken?.info?.description ||
                    "Ether Coin, The Ether's native currency."}
                </p>
              </div>
            </li>
          {/if}
          {#each sortedTokens || [] as token}
            <li
              class="flex p-2 px-6 -mx-4 cursor-pointer hover:bg-base-200 space-x-2"
              transition:slide|local
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
          {/each}
        </ul>
      </div>
    </div>
    <div class="flex py-4 justify-end lg:w-full">
      {#if selectedToken}
        <!-- <button
          transition:scale|local
          class="btn btn-primary no-animation w-2/5">Token 2</button
        > -->
        <button
          class="btn btn-primary no-animation w-2/5"
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
