<script lang="ts">
  import { maxOf } from "src/lib/stats";

  export let values: number[] = [];
  export let height = 180;
  export let label = "";

  $: safeValues = values.filter((value) => Number.isFinite(value));
  $: max = maxOf(safeValues);
  $: points = safeValues
    .map((value, index) => {
      const x =
        safeValues.length <= 1 ? 0 : (index / (safeValues.length - 1)) * 100;
      const y = 100 - (value / max) * 86 - 7;
      return `${x},${y}`;
    })
    .join(" ");
</script>

<div class="h-full min-h-[180px]">
  {#if safeValues.length > 1}
    <svg
      class="h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      style:height={`${height}px`}
    >
      <polyline
        points={points}
        fill="none"
        stroke="rgb(var(--sf-green))"
        stroke-width="2.5"
        vector-effect="non-scaling-stroke"
      />
      <line
        x1="0"
        x2="100"
        y1="94"
        y2="94"
        stroke="currentColor"
        stroke-opacity="0.16"
        vector-effect="non-scaling-stroke"
      />
    </svg>
  {:else}
    <div class="grid h-[180px] place-items-center app-muted text-sm">
      Waiting for indexed history
    </div>
  {/if}
</div>
