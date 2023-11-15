<script lang="ts">
  import { parseEther } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";
  import { sdk } from "src/stores";
  import { signer } from "svelte-ethers-store";

  let amount: string;
</script>

<div class="px-8 lg:px-0 lg:w-1/2 m-auto mt-20 lg:mt-40">
  <h1 class="text-3xl">Faucet</h1>
</div>
<div class="lg:border-2 rounded-lg p-4 bg-gradient lg:w-1/2 m-auto mt-4">
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text font-semibold mx-2 text-base">Mint NUSD</span>
    </label>
    <label class="input-group w-full">
      <input
        bind:value={amount}
        type="text"
        placeholder="Amount to mint"
        class="input input-bordered w-1/2"
        on:validated={(v) => (amount = v.detail)}
        use:validator={{
          value: amount,
          max: 1000000,
        }}
      />
      <button
        class="btn w-1/3"
        on:click={(_) => $sdk.USDC.connect($signer).mintFor(parseEther(amount))}
        >Mint</button
      >
    </label>
  </div>
</div>
