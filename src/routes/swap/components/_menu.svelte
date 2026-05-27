<script lang="ts">
  let zeroLeverage = true;
  let squaredLeverage = false;
  let cubedLeverage = false;
  let stip = true;
  let flip = false;

  export let terms = [];
  $: terms = [
    zeroLeverage && "zero-leverage",
    squaredLeverage && "squared-leverage",
    cubedLeverage && "cubed-leverage",
    stip && "stip",
    flip && "flip",
  ].filter(Boolean);

  // reset all leverage field
  function resetLeverage() {
    zeroLeverage = false;
    squaredLeverage = false;
    cubedLeverage = false;
  }

  function resetStance() {
    stip = false;
    flip = false;
  }
</script>

<ul class="token-filter hidden lg:block" id="menu">
  <li>
    <button
      type="button"
      class:filter-active={stip}
      on:click={(_) => {
        resetStance();
        stip = !stip;
      }}>Long exposure</button
    >
  </li>
  <li>
    <button
      type="button"
      class:filter-active={flip}
      on:click={(_) => {
        resetStance();
        flip = !flip;
      }}>Inverse exposure</button
    >
  </li>
  <!-- <li> -->
  <!-- <a class="!bg-transparent !cursor-default">Finance</a>
    <ul>
      <li>
        <a
          class:text-primary={!!selected["dgs"]}
          class:border-l={!!selected["dgs"]}
          class="rounded-none border-primary"
          on:click={(_) => (selected["dgs"] = !selected["dgs"])}>Treasuries</a
        >
      </li>
      <li>
        <a
          class:text-primary={!!selected["sec"]}
          class:border-l={!!selected["sec"]}
          class="rounded-none border-primary"
          on:click={(_) => (selected["sec"] = !selected["sec"])}>Securities</a
        >
      </li>
    </ul>
  </li> -->
  <!-- </li> -->
  <li>
    <p>Power</p>
    <ul class="mt-2 space-y-1">
      <li>
        <button
          type="button"
          class:filter-active={zeroLeverage}
          on:click={(_) => {
            resetLeverage();
            zeroLeverage = !zeroLeverage;
          }}>Linear</button
        >
      </li>
      <li>
        <button
          type="button"
          class:filter-active={squaredLeverage}
          on:click={(_) => {
            resetLeverage();
            squaredLeverage = !squaredLeverage;
          }}>Squared</button
        >
      </li>
      <li>
        <button
          type="button"
          class:filter-active={cubedLeverage}
          on:click={(_) => {
            resetLeverage();
            cubedLeverage = !cubedLeverage;
          }}>Cubed</button
        >
      </li>
    </ul>
  </li>
</ul>

<div class="join w-full lg:hidden px-4">
  <button
    class="btn btn-primary btn-outline join-item w-1/3"
    class:btn-active={squaredLeverage}
    on:click={(_) => {
      cubedLeverage = false;
      squaredLeverage = !squaredLeverage;
      zeroLeverage = !squaredLeverage;
    }}>Squared</button
  >
  <button
    class="btn btn-primary btn-outline join-item w-1/3"
    class:btn-active={cubedLeverage}
    on:click={(_) => {
      squaredLeverage = false;
      cubedLeverage = !cubedLeverage;
      zeroLeverage = !cubedLeverage;
    }}>Cubed</button
  >
  <button
    class="btn btn-primary btn-outline join-item w-1/3"
    class:btn-active={flip}
    on:click={(_) => {
      flip = !flip;
      stip = !flip;
    }}>Inverse</button
  >
</div>

<style>
  .token-filter {
    border-right: 1px solid rgb(var(--sf-border) / 0.1);
    padding-right: 1rem;
  }

  .token-filter > li + li {
    margin-top: 0.35rem;
  }

  .token-filter p {
    margin-top: 1rem;
    padding: 0.55rem 0.75rem 0.25rem;
    color: rgb(var(--sf-green));
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .token-filter button {
    width: 100%;
    border-left: 2px solid transparent;
    border-radius: 0.5rem;
    padding: 0.6rem 0.75rem;
    text-align: left;
    color: hsl(var(--bc) / 0.72);
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      color 160ms ease;
  }

  .token-filter button:hover,
  .token-filter .filter-active {
    border-color: rgb(var(--sf-green));
    background: rgb(var(--sf-green) / 0.1);
    color: hsl(var(--bc));
  }
</style>
