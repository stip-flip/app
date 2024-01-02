<script lang="ts">
  import Icon from "@iconify/svelte";
  import { BigNumber } from "ethers";
  import { formatEther, parseEther, parseUnits } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";
  import { useBalance } from "src/hooks/balance";
  import { broadcastTransaction } from "src/hooks/blocknumber";
  import { usdcInfo } from "src/hooks/erc20";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";

  export let poolAddress: string;
  export let selectedPosition: any;

  let mode: "withdraw" | "deposit" = "withdraw";
  let amount: string = "0";
  $: liquidityAndPnL = BigNumber.from(selectedPosition?.liquidity || 0).add(
    pnl
  );

  $: maxAmount =
    mode == "withdraw"
      ? formatEther(liquidityAndPnL || "0")
      : $useBalance?.balance || 0;

  let pnl = BigNumber.from("0");

  $: $sdk.POOL.attach(poolAddress)
    .positionPnL(
      selectedPosition?.tickLower,
      selectedPosition?.tickUpper,
      $signerAddress
    )
    .then((res) => (pnl = res));

  function switchMode() {
    amount = "0";
    mode = mode == "withdraw" ? "deposit" : "withdraw";
  }

  $: console.log(pnl);

  function action() {
    mode == "withdraw"
      ? broadcastTransaction(
          "Collecting liquidities",
          $sdk.POOL.attach(poolAddress)
            .connect($signer)
            .burn(
              selectedPosition?.tickLower,
              selectedPosition?.tickUpper,
              BigNumber.from(selectedPosition?.liquidity || "0")
                .mul(parseEther(amount))
                .div(liquidityAndPnL),
              $signerAddress
            )
        )
      : broadcastTransaction(
          "Minting liquidities",
          $sdk.POOL.attach(poolAddress)
            .connect($signer)
            .mint(
              $signerAddress,
              selectedPosition?.tickLower,
              selectedPosition?.tickUpper,
              {
                value: parseEther(amount),
              }
            )
        );
  }
</script>

<input type="checkbox" id={poolAddress} class="modal-toggle" />
<label for={poolAddress} class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <div class="tabs tabs-boxed">
      <a
        class="tab tab-lg w-1/2"
        on:click={switchMode}
        class:tab-active={mode == "withdraw"}>Withdraw</a
      >
      <a
        class="tab tab-lg w-1/2"
        on:click={switchMode}
        class:tab-active={mode == "deposit"}>Deposit</a
      >
    </div>
    <!-- <div class="border-b my-4 mt-8" /> -->
    <label class="input-group w-full p-4 mt-8">
      <input
        bind:value={amount}
        type="text"
        placeholder="Liquidity to withdraw"
        class="input input-bordered w-full"
        on:validated={(v) => (amount = v.detail)}
        use:validator={{
          value: amount,
          max: maxAmount,
        }}
      />
      <span class="w-24 text-center flex items-center">
        <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
        ETC</span
      >
    </label>
    <div
      class="cursor-pointer ml-6 -mt-4"
      on:click={(_) => (amount = String(maxAmount))}
    >
      Max: {commify(maxAmount)}
    </div>
    <!-- <div class="m-4 mx-12 p-2 font-light bg-blend-lighten rounded-lg">
      Fees accumulated:
      {#await $sdk.POOL.attach(poolAddress).positionPnL(selectedPosition?.tickLower, selectedPosition?.tickUpper, $signerAddress) then pnl}
        {commify(formatUnits(pnl, $usdcInfo?.decimals || 18))}
        <br />
        Liquidities after: {commify(
          formatAmount(selectedPosition?.liquidity, $usdcInfo?.decimals || 18) +
            (mode == "deposit" ? Number(amount) : -Number(amount)) +
            Number(formatUnits(pnl, $usdcInfo?.decimals || 18))
        )}
      {:catch err}
        0
      {/await}
    </div> -->
    <!-- <div class="border-b" /> -->
    <div class="text-right pt-8">
      <button class="btn btn-primary w-full" on:click={(_) => action()}>
        {#if mode == "withdraw"}
          Collect
        {:else}
          Mint
        {/if}
      </button>
    </div>
  </label>
</label>
