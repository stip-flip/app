<script lang="ts">
  import Icon from "@iconify/svelte";
  import { parseEther } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";

  import { useBalance } from "src/hooks/balance";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signer } from "svelte-ethers-store";

  let deposit = "";

  $: depositTooHigh = Number(deposit) > Number($useBalance?.balance);

  $: depositTooLow = Number(deposit) != 0 && Number(deposit) < 1;
</script>

<label class="input-group w-full mt-8">
  <input
    bind:value={deposit}
    type="text"
    placeholder="0"
    class="input input-bordered w-2/3 flex items-center"
    class:input-error={Number(deposit) > Number($useBalance?.balance)}
    on:validated={(v) => (deposit = v.detail)}
    use:validator={{
      value: deposit,
    }}
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
    class:w-full={depositTooLow}
    disabled={deposit == ""}
    on:click={(_) => {
      if (depositTooHigh) return;
      if (depositTooLow) return;
      broadcastTransaction(
        "Increasing oracle stakes",
        $sdk.ORACLE.connect($signer).deposit({ value: parseEther(deposit) })
      );
    }}
  >
    {#if depositTooHigh}
      Balance too low
    {:else if depositTooLow}
      You need to stake at least 1 ETC to become a price provider
    {:else}
      Deposit
    {/if}
  </button>
</div>
