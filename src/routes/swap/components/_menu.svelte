<script lang="ts">
  $: selected = { ["zero-leverage"]: true, ["stip"]: true };

  export let terms = [];
  $: terms = Object.keys(selected).filter((term) => selected[term]);

  // reset all leverage field
  function resetLeverage() {
    selected["zero-leverage"] = false;
    selected["squared-leverage"] = false;
    selected["cubed-leverage"] = false;
  }

  function resetStance() {
    selected["stip"] = false;
    selected["flip"] = false;
  }
</script>

<ul class="menu w-50 hidden lg:block" id="menu">
  <li>
    <a
      class:text-primary={!!selected["stip"]}
      class:border-l={!!selected["stip"]}
      class="rounded-none border-primary"
      on:click={(_) => {
        resetStance();
        selected["stip"] = !selected["stip"];
      }}>Bullish</a
    >
  </li>
  <li>
    <a
      class:text-primary={!!selected["flip"]}
      class:border-l={!!selected["flip"]}
      class="rounded-none border-primary"
      on:click={(_) => {
        resetStance();
        selected["flip"] = !selected["flip"];
      }}>Bearish</a
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
    <a class="!bg-transparent !cursor-default">Leverage</a>
    <ul>
      <li>
        <a
          class:text-primary={!!selected["zero-leverage"]}
          class:border-l={!!selected["zero-leverage"]}
          class="rounded-none border-primary"
          on:click={(_) => {
            resetLeverage();
            selected["zero-leverage"] = !selected["zero-leverage"];
          }}>Zero</a
        >
      </li>
      <li>
        <a
          class:text-primary={!!selected["squared-leverage"]}
          class:border-l={!!selected["squared-leverage"]}
          class="rounded-none border-primary"
          on:click={(_) => {
            resetLeverage();
            selected["squared-leverage"] = !selected["squared-leverage"];
          }}>Squared</a
        >
      </li>
      <li>
        <a
          class:text-primary={!!selected["cubed-leverage"]}
          class:border-l={!!selected["cubed-leverage"]}
          class="rounded-none border-primary"
          on:click={(_) => {
            resetLeverage();
            selected["cubed-leverage"] = !selected["cubed-leverage"];
          }}>Cubed</a
        >
      </li>
    </ul>
  </li>
</ul>

<div class="join w-full lg:hidden px-4" id="menu">
  <button
    class="btn btn-primary btn-outline join-item w-1/3"
    class:btn-active={selected["squared-leverage"]}
    on:click={(_) => {
      selected["cubed-leverage"] = false;
      selected["squared-leverage"] = !selected["squared-leverage"];
      selected["zero-leverage"] = !selected["squared-leverage"];
    }}>Squared</button
  >
  <button
    class="btn btn-primary btn-outline join-item w-1/3"
    class:btn-active={selected["cubed-leverage"]}
    on:click={(_) => {
      selected["squared-leverage"] = false;
      selected["cubed-leverage"] = !selected["cubed-leverage"];
      selected["zero-leverage"] = !selected["cubed-leverage"];
    }}>Cubed</button
  >
  <button
    class="btn btn-primary btn-outline join-item w-1/3"
    class:btn-active={selected["flip"]}
    on:click={(_) => {
      selected["flip"] = !selected["flip"];
      selected["stip"] = !selected["flip"];
    }}>Flip</button
  >
</div>
