<script lang="ts">
  import { appTour } from "src/lib/driver";

  let checkbox: HTMLInputElement;
</script>

<!-- Put this part before </body> tag -->
<input
  type="checkbox"
  id="take-a-tour"
  bind:this={checkbox}
  class="modal-toggle"
/>
<div class="modal" role="dialog">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Welcome to Stip&Flip</h3>
    <p class="py-4">
      Stip&Flip provide decentralised and permissionless synthetic trading.
      <br />
      Trade anything, long and short, with or without leverage, and zero liquidation
      risk.
    </p>
    <div class="text-right space-x-4">
      <button class="btn btn-sm" on:click={(_) => checkbox.click()}
        >Maybe later</button
      >
      <button
        class="btn btn-sm btn-primary"
        on:click={(_) => {
          checkbox.click();
          appTour.drive();
        }}>App Tour</button
      >
    </div>
  </div>
</div>
