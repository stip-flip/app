<script lang="ts">
  import { getHoursMinutesSeconds, getTimeDifference } from "src/lib";
  import { timestamp } from "src/stores";

  export let settlement = 1718755200;
  $: time = getHoursMinutesSeconds(1718755200, $timestamp);
</script>

<div
  class="grid grid-flow-col gap-5 text-center auto-cols-max"
  class:hidden={$timestamp > settlement}
>
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
