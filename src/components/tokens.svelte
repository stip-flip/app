<script lang="ts">
  import { commify } from "src/lib";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";

  export let id: string;
  export let selectedToken: TokenInfoAndBalance;

  export let tokenInfosAndBalances: TokenInfoAndBalance[];

  $: sortedTokens = (tokenInfosAndBalances || []).sort((a, b) =>
    a.balance > b.balance ? -1 : 1
  );

  let checkbox: HTMLInputElement;
</script>

<input type="checkbox" {id} class="modal-toggle" bind:this={checkbox} />
<label for={id} class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold px-4">Tokens</h3>
    <ul class="p-4">
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
  </label>
</label>
