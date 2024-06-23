<script lang="ts">
  import { getHoursMinutesSeconds } from "src/lib";
  import { timestamp } from "src/stores";

  export let settlement = 1718755200;
  $: time = getHoursMinutesSeconds(1718755200, $timestamp);
</script>

{#if $timestamp > settlement}
  <div class="w-screen z-10">
    <div class="w-1/2 m-auto">
      <div class="py-2 flex space-x-4">
        <a
          class="text-center font-thin py-12 text-xl fine-border rounded-tl-full w-1/2 hover:bg-white hover:bg-opacity-20 hover:text-primary hover:font-normal"
          href="/swap"
        >
          Trade
        </a>
        <a
          class="text-center font-thin py-12 text-xl fine-border rounded-tr-full w-1/2 hover:bg-white hover:bg-opacity-20 hover:text-primary hover:font-normal"
          href="/earn"
        >
          Deposit
        </a>
      </div>
      <div class="py-2 flex space-x-4">
        <a
          class="text-center font-thin py-12 text-xl fine-border rounded-bl-full w-1/2 hover:bg-white hover:bg-opacity-20 hover:text-primary hover:font-normal"
          href="/oracle/deposit"
        >
          Stake
        </a>
        <a
          class="text-center font-thin py-12 text-xl fine-border rounded-br-full w-1/2 hover:bg-white hover:bg-opacity-20 hover:text-primary hover:font-normal"
          href="https://docs.sf.exchange"
        >
          Learn
        </a>
      </div>
    </div>
  </div>
{:else}
  <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
    <div
      class="flex flex-col p-2 bg-neutral bg-opacity-50 rounded-box text-neutral-content"
    >
      <span class="countdown font-mono text-5xl">
        <span style={`--value:${time.days};`}></span>
      </span>
      days
    </div>
    <div
      class="flex flex-col p-2 bg-neutral bg-opacity-50 rounded-box text-neutral-content"
    >
      <span class="countdown font-mono text-5xl">
        <span style={`--value:${time.hours};`}></span>
      </span>
      hours
    </div>
    <div
      class="flex flex-col p-2 bg-neutral bg-opacity-50 rounded-box text-neutral-content"
    >
      <span class="countdown font-mono text-5xl">
        <span style={`--value:${time.minutes};`}></span>
      </span>
      min
    </div>
    <div
      class="flex flex-col p-2 bg-neutral bg-opacity-50 rounded-box text-neutral-content"
    >
      <span class="countdown font-mono text-5xl">
        <span style={`--value:${time.seconds};`}></span>
      </span>
      sec
    </div>
  </div>
{/if}
