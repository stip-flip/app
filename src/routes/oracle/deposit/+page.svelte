<script lang="ts">
  import Icon from "@iconify/svelte";
  import { parseEther } from "ethers/lib/utils";

  import { useBalance } from "src/hooks/balance";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signer } from "svelte-ethers-store";

  let deposit = "";

  $: depositTooHigh = Number(deposit) > Number($useBalance?.balance);
</script>

<label class="input-group w-full mt-8">
  <input
    bind:value={deposit}
    type="text"
    placeholder="0"
    class="input input-bordered w-2/3 flex items-center"
    class:input-error={Number(deposit) > Number($useBalance?.balance)}
  />
  <span class="w-1/3 text-center flex items-center bg-opaque">
    <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
    ETC</span
  >
</label>
<div class="text-right px-4">
  <span
    class="cursor-pointer"
    on:click={(_) => (deposit = String($useBalance?.balance))}
  >
    <span class="text-xs">Balance: </span>
    <span class="text-xs">{commify($useBalance?.balance)}</span>
  </span>
</div>

<div class="flex mt-4 space-x-8 items-center">
  <button
    class="btn btn-primary w-1/3"
    disabled={deposit == ""}
    on:click={(_) => {
      if (depositTooHigh) return;
      broadcastTransaction(
        "Increasing oracle stakes",
        $sdk.ORACLE.connect($signer).deposit({ value: parseEther(deposit) })
      );
    }}
  >
    {#if depositTooHigh}
      Balance too low
    {:else}
      Deposit
    {/if}
  </button>
</div>
