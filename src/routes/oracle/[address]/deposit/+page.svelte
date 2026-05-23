<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { parseEther } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";

  import { useBalance } from "src/hooks/balance";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signer } from "svelte-ethers-store";

  let deposit = "";

  $: oracleContract = $sdk?.ORACLE?.attach($page.params.address);

  $: depositTooHigh = Number(deposit) > Number($useBalance?.balance);

  $: depositTooLow = Number(deposit) != 0 && Number(deposit) < 1;

  $: depositProblem = depositTooHigh
    ? "Balance too low"
    : depositTooLow
      ? "Stake at least 1 ETC to become a price provider."
      : "";

  function setMaxDeposit() {
    deposit = String($useBalance?.balance || "");
  }

  function submitDeposit() {
    if (!oracleContract || !$signer) return;
    if (!deposit || depositTooHigh || depositTooLow) return;

    broadcastTransaction(
      "Increasing oracle stake",
      oracleContract.connect($signer)["deposit()"]({ value: parseEther(deposit) })
    );
  }
</script>

<section class="space-y-5">
  <div>
    <div class="app-label">Increase stake</div>
    <h2 class="mt-1 text-xl font-bold">Deposit ETC into this oracle</h2>
    <p class="app-muted mt-2 text-sm">
      Staked accounts can participate in settlement price submission once they meet the minimum stake.
    </p>
  </div>

  <div class="rounded-lg border border-white/10 bg-white/[0.03] p-4">
    <div class="mb-3 flex items-center justify-between gap-3">
      <label class="text-sm font-semibold" for="oracle-deposit">Stake amount</label>
      <button class="btn btn-ghost btn-xs rounded-full" type="button" on:click={setMaxDeposit}>
        Balance: {commify($useBalance?.balance)} ETC
      </button>
    </div>

    <label class="input input-bordered flex h-14 items-center gap-3">
      <input
        id="oracle-deposit"
        bind:value={deposit}
        type="text"
        inputmode="decimal"
        placeholder="0"
        class="w-full bg-transparent font-mono text-2xl outline-none"
        class:input-error={depositTooHigh}
        on:validated={(v) => (deposit = v.detail)}
        use:validator={{
          value: deposit,
        }}
      />
      <span class="inline-flex shrink-0 items-center gap-1 font-semibold">
        <Icon class="text-xl text-green-600" icon="mdi:ethereum" />
        ETC
      </span>
    </label>

    {#if depositProblem}
      <div class="mt-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning-content">
        {depositProblem}
      </div>
    {/if}
  </div>

  <button
    class="btn btn-primary w-full rounded-full"
    disabled={!deposit || Boolean(depositProblem)}
    on:click={submitDeposit}
  >
    Deposit stake
  </button>
</section>
