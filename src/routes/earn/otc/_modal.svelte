<script lang="ts">
  import Icon from "@iconify/svelte";
  import { BigNumber } from "ethers";
  import { formatEther, parseEther } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";
  import { closeOnEscape, portal } from "src/actions/modal";
  import { useBalance } from "src/hooks/balance";
  import { broadcastTransaction } from "src/hooks/transactions";
  import type { Position } from "src/hooks/sf/position";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { onMount } from "svelte";
  import { signer, signerAddress } from "svelte-ethers-store";
  import { Drawer } from "vaul-svelte";

  export let poolAddress: string;
  export let poolName: string;
  export let selectedPosition: Position;
  export let open: boolean;

  let mode: "withdraw" | "deposit" = "withdraw";
  let amount: string = "0";
  let automate: boolean = true;
  let isDesktop = false;

  onMount(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => (isDesktop = query.matches);
    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  });
  // $: liquidityAndPnL = BigNumber.from(selectedPosition?.liquidity || 0).add(
  //   pnl
  // );

  $: maxAmount =
    mode == "withdraw"
      ? formatEther(selectedPosition?.liquidity || "0")
      : $useBalance?.balance || 0;

  function switchMode() {
    amount = "0";
    mode = mode == "withdraw" ? "deposit" : "withdraw";
  }

  function action() {
    console.log(
      parseEther(amount)
        .mul(selectedPosition.shares)
        .div(selectedPosition.liquidity),
      selectedPosition.shares,
      selectedPosition.liquidity
    );
    mode == "withdraw"
      ? broadcastTransaction(
          `Collecting liquidities from ${poolName}`,
          $sdk.POOL.attach(poolAddress)
            .connect($signer)
            .burn(
              selectedPosition?.tick,
              parseEther(amount)
                .mul(selectedPosition.shares)
                .div(selectedPosition.liquidity),
              automate ? $sdk.TRADER_PERIPHERY.address : $signerAddress
            )
        )
      : broadcastTransaction(
          `Depositing liquidities to ${poolName}`,
          $sdk.POOL.attach(poolAddress)
            .connect($signer)
            .mint(
              selectedPosition?.tick,
              automate ? $sdk.TRADER_PERIPHERY.address : $signerAddress,
              {
                value: parseEther(amount),
              }
            )
        );
  }

</script>

<input type="checkbox" id={poolAddress} class="modal-toggle lg:block hidden" bind:checked={open} />
<!-- Desktop Modal -->
{#if open && isDesktop}
<div use:portal use:closeOnEscape={() => (open = false)} class="fixed inset-0 z-50 hidden items-center justify-center overflow-y-auto bg-black/40 p-6 lg:flex" role="dialog" aria-modal="true" on:click={() => (open = false)}>
  <div class="modal-box relative max-h-[calc(100vh-3rem)] overflow-y-auto" on:click|stopPropagation>
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
        inputmode="decimal"
        placeholder="Liquidity to withdraw"
        class="input input-bordered w-full"
        on:validated={(v) => (amount = v.detail)}
        use:validator={{
          value: String(amount),
          max: String(maxAmount),
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
    <div id="automate" class="flex justify-between my-4 text-lg mx-4">
      <strong>Automate Claim</strong>
      <input
        type="checkbox"
        class="toggle toggle-primary"
        bind:checked={automate}
      />
    </div>
    <div class="text-right pt-4">
      <button class="btn btn-primary w-full" on:click={(_) => action()}>
        {#if mode == "withdraw"}
          Collect
        {:else}
          Mint
        {/if}
      </button>
    </div>
  </div>
</div>
{/if}

<!-- Mobile Modal -->
{#if !isDesktop}
  <Drawer.Root bind:open closeOnOutsideClick={false} dismissible={false}>
    <!-- <Drawer.Trigger /> -->
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 bg-black/40 lg:hidden" />
      <Drawer.Content
        class="rounded-t-3xl pb-8 pt-3 bg-opaque fixed bottom-0 left-0 right-0 fine-border lg:hidden"
      >
      <div class="w-1/6 mb-8 h-1 bg-base-content rounded-full border- m-auto" />
      <div class="p-2">
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
        <div class="input-group w-full p-4 mt-8">
          <input
            value={amount}
            type="text"
            inputmode="decimal"
            placeholder="Liquidity to withdraw"
            class="input input-bordered w-full"
            on:validated={(v) => (amount = v.detail)}
            use:validator={{
              value: String(amount),
              max: String(maxAmount),
            }}
          />
          <span class="w-24 text-center flex items-center">
            <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
            ETC</span
          >
        </div>
        <div
          class="cursor-pointer ml-6 -mt-4"
          on:click={(_) => (amount = String(maxAmount))}
        >
          Max: {commify(maxAmount)}
        </div>
        <div id="automate" class="flex justify-between my-4 text-lg mx-4">
          <strong>Automate Claim</strong>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            bind:checked={automate}
            autofocus
          />
        </div>
        <div class="text-right pt-4">
          <button class="btn btn-primary w-full" on:click={(_) => action()}>
            {#if mode == "withdraw"}
              Collect
            {:else}
              Mint
            {/if}
          </button>
        </div>
      </div>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}
