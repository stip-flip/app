<script>
  import Icon from "@iconify/svelte";
  import { formatEther, parseEther } from "ethers/lib/utils";
  import { useOracleInfo } from "src/hooks/sf/oracle";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";

  let withdraw = "";

  $: oracleInfo = useOracleInfo($signerAddress, $sdk.ORACLE.address);

  $: isUnderWater =
    Number(formatEther($oracleInfo?.stakes || "0")) - Number(withdraw) <
    Number(formatEther($oracleInfo?.minStake || "0"));

  $: manaAfterWithdraw = !isUnderWater
    ? Number(formatEther($oracleInfo?.mana || "0")) -
      (Number(formatEther($oracleInfo?.mana || "0")) * Number(withdraw)) /
        Number(formatEther($oracleInfo?.stakes || "0"))
    : 0;
</script>

<label class="input-group w-full mt-2">
  <input
    bind:value={withdraw}
    type="text"
    placeholder="0"
    class="input input-bordered w-2/3 flex items-center"
    class:input-error={Number(withdraw) >
      Number(formatEther($oracleInfo?.stakes || "0"))}
  />

  <span class="w-1/3 text-center flex items-center bg-opaque">
    <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
    ETC</span
  >
</label>

<div class="text-right px-4">
  <span
    class="cursor-pointer"
    on:click={(_) => (withdraw = formatEther($oracleInfo?.stakes || "0"))}
  >
    <span class="text-xs">Balance: </span>
    <span class="text-xs"
      >{commify(formatEther($oracleInfo?.stakes || "0"))}</span
    >
  </span>
</div>

<div class="p-4">
  <span class="text-xs">MANA After withdraw: </span>
  <span class="text-xs">{commify(manaAfterWithdraw)}</span>
</div>

<div class="flex mt-4 space-x-8 items-center">
  <button
    class="btn btn-primary w-1/3"
    disabled={withdraw == ""}
    on:click={(_) => {
      if (Number(withdraw) > Number(formatEther($oracleInfo?.stakes || "0")))
        return;
      broadcastTransaction(
        "Decreasing oracle stakes",
        $sdk.ORACLE.connect($signer).withdraw(
          parseEther(withdraw),
          $signerAddress
        )
      );
    }}
  >
    {#if Number(withdraw) > Number(formatEther($oracleInfo?.stakes || "0"))}
      Balance too low
    {:else}
      Withdraw
    {/if}
  </button>
  {#if isUnderWater}
    <div
      class="text-xs mt-2 border border-info text-info-content bg-info rounded-2xl flex justify-center items-center p-3"
    >
      You will not be able to provide price feeds if your stake is below the
      minimum stake.
    </div>
  {/if}
</div>
