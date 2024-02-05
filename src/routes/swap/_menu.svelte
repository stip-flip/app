<script lang="ts">
  $: selected = {};

  export let terms = [];
  $: terms = Object.keys(selected).filter((term) => selected[term]);
</script>

<ul class="menu w-50 rounded-box border bg-base-300">
  <li>
    <a
      class:text-accent-focus={!!selected["stip"]}
      on:click={(_) => (selected["stip"] = !selected["stip"])}>Bullish</a
    >
  </li>
  <li>
    <a
      class:text-accent-focus={!!selected["flip"]}
      on:click={(_) => (selected["flip"] = !selected["flip"])}>Bearish</a
    >
  </li>
  <li>
    <a class="!bg-transparent !cursor-default">Finance</a>
    <ul>
      <li>
        <a
          class:text-accent-focus={!!selected["dgs"]}
          on:click={(_) => (selected["dgs"] = !selected["dgs"])}>Treasuries</a
        >
      </li>
      <li>
        <a
          class:text-accent-focus={!!selected["sec"]}
          on:click={(_) => (selected["sec"] = !selected["sec"])}>Securities</a
        >
      </li>
    </ul>
  </li>
  <li>
    <a>Price Update</a>
    <ul>
      <li><a>Daily</a></li>
      <li><a>Weekly</a></li>
      <li><a>Monthly</a></li>
    </ul>
  </li>
</ul>
