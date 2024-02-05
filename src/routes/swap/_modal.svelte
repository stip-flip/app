<script lang="ts">
  import { commify } from "src/lib";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import Icon from "@iconify/svelte";
  import Menu from "./_menu.svelte";
  import { slide, scale } from "svelte/transition";

  export let id: string;
  export let otherTokenSelected: TokenInfoAndBalance;
  export let selectedToken: TokenInfoAndBalance;

  export let tokenInfosAndBalances: TokenInfoAndBalance[];

  let terms: string[] = [];
  let search: string = "";

  $: sortedTokens = (tokenInfosAndBalances || [])
    .sort((a, b) => (a.balance > b.balance ? -1 : 1))
    .filter(
      (t) =>
        !terms.length ||
        terms.some((term) =>
          t.info.name.toLowerCase().includes(term.toLowerCase())
        )
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
  <div class="lg:w-1/3">
    <label class="lg:bg-opaque lg:rounded-xl lg:shadow-lg block p-4" for="">
      <div class="flex justify-around">
        <label
          for="selectedToken0"
          tabindex="0"
          class="text-lg px-4 cursor-pointer border-primary"
          class:font-bold={id == "selectedToken0"}
          class:border-b-2={id == "selectedToken0"}
          on:click={(_) => {
            checkbox.click();
          }}
        >
          Token 1
        </label>
        <label
          for="selectedToken1"
          tabindex="0"
          class="text-lg px-4 cursor-pointer border-primary"
          class:font-bold={id == "selectedToken1"}
          class:border-b-2={id == "selectedToken1"}
          on:click={(_) => {
            checkbox.click();
          }}
        >
          Token 2
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
      <div class="flex pt-4 space-x-4">
        <Menu bind:terms />
        <ul class="p-4 rounded-box shadow-lg border w-full bg-base-300">
          {#if selectedToken}
            <li
              class="rounded-t-2xl px-6 pb-6 pt-2 cursor-pointer bg-base-100 -mt-4 -mx-4 border-b"
              transition:slide|local
              on:click={(_) => {
                selectedToken = undefined;
                // checkbox.click();
              }}
            >
              <strong class="capitalize">
                <a>{selectedToken.info.name}</a> :
              </strong>
              this token is the long side of US treasuries 10 year future
            </li>
          {/if}
          {#each sortedTokens || [] as token}
            <li
              class="flex p-2 px-6 -mx-4 cursor-pointer hover:bg-base-200"
              transition:slide|local
              on:click={(_) => {
                selectedToken = token;
                console.log(checkbox);
                // checkbox.click();
              }}
            >
              <strong class="capitalize">
                <a>{token?.info?.name || "NUSD"}</a>
              </strong>
              <span class="mx-2">
                ({commify(token?.balance, 4)})
              </span>
            </li>
          {/each}
        </ul>
      </div>
    </label>
    <div class="flex py-4 justify-between lg:w-full">
      <button
        class="btn !bg-opaque w-2/5 border border-base-100"
        on:click={(_) => {
          console.log("cliiick");
          checkbox.click();
        }}>Close</button
      >
      {#if selectedToken}
        <!-- <button
          transition:scale|local
          class="btn btn-primary no-animation w-2/5">Token 2</button
        > -->
        {#if id == "selectedToken0"}
          <label
            for="selectedToken1"
            tabindex="0"
            transition:scale|local
            class="btn btn-primary no-animation w-2/5"
            on:click={(_) => checkbox.click()}>Token 2</label
          >
        {:else if id == "selectedToken1"}
          {#if !otherTokenSelected}
            <label
              for="selectedToken0"
              tabindex="0"
              transition:scale|local
              class="btn btn-primary no-animation w-2/5"
              on:click={(_) => {
                checkbox.click();
              }}>{!otherTokenSelected ? "Token 1" : "Done"}</label
            >
          {:else}
            <button
              class="btn btn-primary no-animation w-2/5"
              on:click={(_) => checkbox.click()}
            >
              Done
            </button>
          {/if}
        {/if}
      {/if}
      <!-- <buton class="btn btn-primary flex-grow">Token 2</buton> -->
    </div>
  </div>
</label>
