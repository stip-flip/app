<script lang="ts">
  import Icon from "@iconify/svelte";
  import * as Pancake from "@sveltejs/pancake";
  import * as _ from "lodash";

  export let lowerFR: number = -500;
  export let upperFR: number = 500;
  export let initializedTicks: Record<number, number> = {};

  function list(initializedTicks: Record<number, number>) {
    if (!initializedTicks) return [];
    let list: { index: number; width: number; height: number }[] = [];
    const keys = Object.keys(initializedTicks).sort((a, b) =>
      Number(a) > Number(b) ? 1 : -1
    );
    let liquidityNet = 0;
    for (var i = 0; i < keys.length; i++) {
      list.push({
        index: Number(keys[i]),
        width: keys[i + 1] ? Number(keys[i + 1]) - Number(keys[i]) : 0,
        height: (liquidityNet += Number(initializedTicks[Number(keys[i])])),
      });
    }
    return list;
  }

  let zoom = 1000;

  $: ticks = list(initializedTicks);

  $: maxLiquidity = Math.max(...ticks.map((d) => d.height));

  $: indexes = ticks.map((d) => d.index);
  $: x1 = _.min(indexes) - zoom;
  $: x2 = _.max(indexes) + zoom;

  $: console.log(ticks);

  const handle_pointerdown = (e: any, cursor: "lower" | "upper" | "both") => {
    if (!e.isPrimary) return;

    const start_x = e.clientX;
    let start_lower = lowerFR;
    let start_upper = upperFR;

    const handle_pointermove = (e) => {
      if (!e.isPrimary) return;

      const d = e.clientX - start_x;

      const step = 1.4;

      const n = Math.round(d / step);
      if (cursor == "lower") {
        lowerFR = Math.max(
          x1,
          Math.min(upperFR - 50, start_lower + Math.round(n) * 10)
        );
      } else if (cursor == "upper") {
        upperFR = Math.max(
          lowerFR + 50,
          Math.min(x2, start_upper + Math.round(n) * 10)
        );
      } else {
        lowerFR = Math.max(
          x1,
          Math.min(upperFR - 50, start_lower + Math.round(n) * 10)
        );
        upperFR = Math.max(
          lowerFR + 50,
          Math.min(x2, start_upper + Math.round(n) * 10)
        );
      }
    };

    const handle_pointerup = (e) => {
      if (!e.isPrimary) return;

      window.removeEventListener("pointermove", handle_pointermove);
      window.removeEventListener("pointerup", handle_pointerup);
    };

    window.addEventListener("pointermove", handle_pointermove);
    window.addEventListener("pointerup", handle_pointerup);
  };
</script>

<div class="h-40 w-full relative">
  <div class="background p-8">
    <Pancake.Chart {x1} {x2} y1={0} y2={maxLiquidity} clip>
      <!-- <Pancake.Columns data={$m} width={5}>
        <div class="column m" />
      </Pancake.Columns> -->
      <!-- women -->

      {#each ticks as t, i}
        <!-- <Pancake.Box x1={t.index} x2={t.index + t.width} y1="0" y2={t.height}>
          <div class="column f" />
        </Pancake.Box> -->
        <Pancake.Columns
          data={Array.from({ length: t.width / 10 }, (v, j) => ({
            x: t.index + j * 10,
            y: t.height,
          }))}
          width={6}
        >
          <div class="column f" />
        </Pancake.Columns>
      {/each}
      <!-- <Pancake.Grid vertical ticks={birth_years} let:value>
        <span class="x label"
          >{size === "large" ? value : `'${String(value).slice(2)}`}</span
        >
      </Pancake.Grid> -->
    </Pancake.Chart>
  </div>
  <div class="foreground p-8">
    <Pancake.Chart {x1} {x2} y1={0} y2={maxLiquidity}>
      <Pancake.Grid vertical count={5} let:value>
        <span class="x label">
          <div class="grid-line vertical" />
          <span class="x label">{value / 100} %</span>
        </span>
      </Pancake.Grid>
      <Pancake.Box
        x1={lowerFR - 35}
        x2={lowerFR + 35}
        y1={-(maxLiquidity * 1) / 10}
        y2={(maxLiquidity * 11) / 10}
      >
        <div
          class="column m cursor-col-resize !w-2 z-10"
          on:pointerdown={(e) => handle_pointerdown(e, "lower")}
        />
      </Pancake.Box>
      <Pancake.Box x1={lowerFR + 30} x2={upperFR - 30} y1="0" y2={maxLiquidity}>
        <div
          class="column m !opacity-30 cursor-crosshair z-0"
          on:pointerdown={(e) => handle_pointerdown(e, "both")}
        />
      </Pancake.Box>
      <Pancake.Box
        x1={upperFR - 35}
        x2={upperFR + 35}
        y1={-(maxLiquidity * 1) / 10}
        y2={(maxLiquidity * 11) / 10}
      >
        <div
          class="column m cursor-col-resize !w-2 z-10"
          on:pointerdown={(e) => handle_pointerdown(e, "upper")}
        />
      </Pancake.Box>
    </Pancake.Chart>
    <div class="flex space-x-2 absolute top-0 right-0">
      <div
        on:click={(_) => (zoom -= zoom > 0 ? 100 : 0)}
        class="cursor-pointer"
      >
        <Icon
          icon="material-symbols:add"
          class="border-2 rounded-md text-2xl"
        />
      </div>
      <div
        on:click={(_) => (zoom += zoom < 100000 ? 100 : 0)}
        class="cursor-pointer"
      >
        <Icon
          icon="ic:baseline-minus"
          class="border-2 rounded-md text-2xl cursor-pointer"
        />
      </div>
    </div>
  </div>
</div>

<style>
  .background,
  .foreground {
    position: absolute;
    width: 100%;
    height: 100%;
    /* padding: 3em 3em 2em 0; */
    box-sizing: border-box;
  }

  .grid-line {
    position: relative;
    display: block;
  }

  .grid-line.vertical {
    height: 8rem;
    bottom: 1rem;
    border-left: 1px solid rgba(0, 0, 0, 0.05);
  }

  .label {
    position: absolute;
    font-size: 14px;
    color: #666;
    /* line-height: 1; */
    white-space: nowrap;
    bottom: 0;
  }

  .y.label {
    left: calc(100% + 1em);
    bottom: -0.5em;
    line-height: 1;
  }

  .x.label {
    width: 4em;
    left: -0.5em;
    bottom: 0;
    text-align: center;
  }

  .background .x.label {
    color: white;
    font-size: 10px;
  }

  .foreground .x.label {
    bottom: -22px;
  }

  .column {
    position: absolute;
    /* left: 1px;
		width: calc(100% - 2px); */
    left: 0;
    width: 100%;
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    border-right: 1px solid rgba(255, 255, 255, 0.4);
    box-sizing: border-box;
    height: 100%;
    opacity: 0.6;
    border-radius: 2px 2px 0 0;
  }

  .column.m {
    background-color: #1f77b4;
  }

  .column.f {
    background-color: #e377c2;
  }

  .medium .slider-container span {
    font-size: 3.5em;
  }

  .large .slider-container span {
    font-size: 5em;
  }
</style>
