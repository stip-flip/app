<script lang="ts">
  import { compact, formatDate } from "src/lib/stats";

  export type TimeSeriesPoint = {
    timestamp: number;
    [key: string]: number;
  };

  export type TimeSeriesMetric = {
    key: string;
    label: string;
    unit?: string;
    decimals?: number;
    color?: string;
  };

  export let points: TimeSeriesPoint[] = [];
  export let metrics: TimeSeriesMetric[] = [];
  export let selected = "";
  export let title = "History";
  export let height = 320;

  let hoverIndex: number | null = null;

  const padding = {
    top: 8,
    right: 3,
    bottom: 8,
    left: 3,
  };

  const chartWidth = 100 - padding.left - padding.right;
  const chartHeight = 100 - padding.top - padding.bottom;

  const pickMetric = (key: string) => {
    selected = key;
    hoverIndex = null;
  };

  const valueLabel = (value: number, metric?: TimeSeriesMetric) => {
    const formatted = compact(value, metric?.decimals ?? 2);
    return metric?.unit ? `${formatted} ${metric.unit}` : formatted;
  };

  const nearestPoint = (event: MouseEvent) => {
    if (series.length < 1) return;

    const rect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const x = padding.left + ratio * 100;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;

    series.forEach((point, index) => {
      const nextDistance = Math.abs(point.x - x);
      if (nextDistance < distance) {
        nearest = index;
        distance = nextDistance;
      }
    });

    hoverIndex = nearest;
  };

  $: activeMetric = metrics.find((metric) => metric.key === selected) || metrics[0];
  $: safePoints = points
    .map((point) => ({
      ...point,
      timestamp: Number(point.timestamp),
      value: Number(point[activeMetric?.key || ""]),
    }))
    .filter((point) => Number.isFinite(point.timestamp) && Number.isFinite(point.value))
    .sort((a, b) => a.timestamp - b.timestamp);
  $: minX = safePoints[0]?.timestamp || 0;
  $: maxX = safePoints[safePoints.length - 1]?.timestamp || minX + 1;
  $: values = safePoints.map((point) => point.value);
  $: minY = Math.min(0, ...values);
  $: maxY = Math.max(1, ...values);
  $: yRange = maxY - minY || 1;
  $: series = safePoints.map((point) => {
    const xRatio = maxX === minX ? 0 : (point.timestamp - minX) / (maxX - minX);
    const yRatio = (point.value - minY) / yRange;

    return {
      ...point,
      x: padding.left + xRatio * chartWidth,
      y: padding.top + (1 - yRatio) * chartHeight,
    };
  });
  $: linePoints = series.map((point) => `${point.x},${point.y}`).join(" ");
  $: areaPoints = linePoints
    ? `${padding.left},${padding.top + chartHeight} ${linePoints} ${padding.left + chartWidth},${padding.top + chartHeight}`
    : "";
  $: hovered = hoverIndex === null ? series[series.length - 1] : series[hoverIndex];
  $: currentColor = activeMetric?.color || "rgb(var(--sf-green))";
</script>

<section class="app-panel overflow-hidden rounded-lg">
  <div class="border-b border-white/10 p-4">
    <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
      <div>
        <div class="app-label">{title}</div>
        <div class="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 class="text-2xl font-bold">{activeMetric?.label || "Metric"}</h2>
          {#if hovered}
            <span class="font-mono text-lg" style:color={currentColor}>
              {valueLabel(hovered.value, activeMetric)}
            </span>
            <span class="app-muted text-sm">{formatDate(hovered.timestamp)}</span>
          {/if}
        </div>
      </div>

      <div class="flex flex-wrap gap-2" aria-label="Chart metric">
        {#each metrics as metric (metric.key)}
          <button
            type="button"
            class={`rounded-full border px-3 py-2 text-sm transition ${
              activeMetric?.key === metric.key
                ? "border-white/20 bg-white/15 text-white"
                : "border-white/10 bg-white/[0.03] app-muted hover:bg-white/[0.08]"
            }`}
            on:click={() => pickMetric(metric.key)}
          >
            {metric.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="p-4">
    {#if series.length > 1}
      <div class="relative">
        <svg
          class="w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${activeMetric?.label || "Metric"} over time`}
          style:height={`${height}px`}
          on:mousemove={nearestPoint}
          on:mouseleave={() => (hoverIndex = null)}
        >
          {#each [0, 1, 2, 3] as gridLine (gridLine)}
            <line
              x1={padding.left}
              x2={padding.left + chartWidth}
              y1={padding.top + (chartHeight / 3) * gridLine}
              y2={padding.top + (chartHeight / 3) * gridLine}
              stroke="currentColor"
              stroke-opacity="0.1"
              vector-effect="non-scaling-stroke"
            />
          {/each}

          <polygon points={areaPoints} fill={currentColor} opacity="0.12" />
          <polyline
            points={linePoints}
            fill="none"
            stroke={currentColor}
            stroke-width="2.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />

          {#if hovered}
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={padding.top}
              y2={padding.top + chartHeight}
              stroke="currentColor"
              stroke-opacity="0.22"
              vector-effect="non-scaling-stroke"
            />
          {/if}
        </svg>

        {#if hovered}
          <span
            class="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-base-100"
            style:left={`${hovered.x}%`}
            style:top={`${hovered.y}%`}
            style:background-color={currentColor}
          ></span>
        {/if}
      </div>

      <div class="mt-3 flex justify-between app-muted text-xs">
        <span>{formatDate(minX)}</span>
        <span>{valueLabel(maxY, activeMetric)} max</span>
        <span>{formatDate(maxX)}</span>
      </div>
    {:else}
      <div class="grid place-items-center app-muted text-sm" style:height={`${height}px`}>
        Waiting for indexed history
      </div>
    {/if}
  </div>
</section>
