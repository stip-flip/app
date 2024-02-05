<script lang="ts">
  import { commify } from "src/lib";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import Icon from "@iconify/svelte";

  export let id: string;
  export let title: string;
  export let selectedToken: TokenInfoAndBalance;

  export let tokenInfosAndBalances: TokenInfoAndBalance[];

  $: sortedTokens = (tokenInfosAndBalances || []).sort((a, b) =>
    a.balance > b.balance ? -1 : 1
  );

  let checkbox: HTMLInputElement;
</script>

<input type="checkbox" {id} class="modal-toggle" bind:this={checkbox} />
<label for={id} class="modal modal-open cursor-pointer">
  <label class="modal-box relative" for="">
    <div class="flex justify-around">
      <h3 class="text-lg font-bold px-4 cursor-pointer">Token 1</h3>
      <h3 class="text-lg px-4 font-light text-gray-300 cursor-pointer">
        Token 2
      </h3>
    </div>
    <div class="join shadow-lg rounded-full border border-gray-200 w-full mt-2">
      <div class="border-b m-4">
        <Icon icon="akar-icons:search" class=" text-lg text-slate-300" />
      </div>
      <input
        type="text"
        class="input input-ghost w-full join-item"
        placeholder="Search"
      />
    </div>
    <div class="flex pt-4 space-x-4">
      <ul class="p-4 rounded-box shadow-lg border w-full">
        {#each sortedTokens || [] as token}
          <li
            class="flex p-2 cursor-pointer hover:bg-slate-300 hover:text-primary-content"
            on:click={(_) => {
              selectedToken = token;
              console.log(checkbox);
              checkbox.click();
            }}
          >
            <strong>
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
</label>
