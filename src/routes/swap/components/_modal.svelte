<script lang="ts">
  import Icon from "@iconify/svelte";
  import { closeOnEscape, portal } from "src/actions/modal";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import Menu from "./_menu.svelte";
  import { chainId } from "svelte-ethers-store";
  import { EtherWhitelist } from "src/stores/whitelist";

  import TokenList from "src/components/token-list.svelte";
  import { Drawer } from "vaul-svelte";

  export let id: string;
  export let otherTokenSelected: TokenInfoAndBalance;
  export let selectToken: "token0" | "token1";
  export let selectedToken0: TokenInfoAndBalance;
  export let selectedToken1: TokenInfoAndBalance;
  export let selectedToken: TokenInfoAndBalance;

  export let tokenInfosAndBalances: TokenInfoAndBalance[];
  export let checkbox: HTMLInputElement;
  export let open: boolean = false;
  export let mode: "market" | "otc" = "market";

  const ZERO_ADDRESS = "0x0";

  let terms: string[] = [];
  let search: string = "";
  let isDesktop = false;

  onMount(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => (isDesktop = query.matches);
    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  });

  $: modalCopy =
    mode == "otc"
      ? {
          label: "Issuance / redemption",
          title: "Select settlement leg",
          description: "Choose the collateral and exposure token used for protocol issuance or redemption.",
          token0: "Collateral out",
          token1: "Exposure in",
          token0Fallback: "Collateral",
          token1Fallback: "Exposure token",
          next: "Choose exposure",
          previous: "Choose collateral",
        }
      : {
          label: "Secondary market",
          title: "Select position token",
          description: "Choose the tokenized exposure legs for secondary trading.",
          token0: "From",
          token1: "To",
          token0Fallback: "Source token",
          token1Fallback: "Destination token",
          next: "Choose destination",
          previous: "Choose source",
        };

  $: filteredTokens = [...(tokenInfosAndBalances || [])]
    .sort((a, b) => (a.balance > b.balance ? -1 : 1))
    .filter(
      (t) =>
        !terms.length ||
        terms.every((term) => {
          if (term == "zero-leverage")
            return (
              !t.info.name.toLowerCase().includes("²") &&
              !t.info.name.toLowerCase().includes("³")
            );
          if (term == "squared-leverage")
            return t.info.name.toLowerCase().includes("²");
          if (term == "cubed-leverage")
            return t.info.name.toLowerCase().includes("³");
          if (term == "stip" && t.info.symbol == "ETC") return true;
          return t.info.name.toLowerCase().includes(term.toLowerCase());
        })
    )
    .filter((t) =>
      search.length
        ? t.info.name.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((t) =>
      $chainId == 61
        ? t.info.symbol == "ETC"
          ? true
          : EtherWhitelist[t.info.symbol]
        : true
    );

  $: sortedTokens =
    !filteredTokens.length && selectedToken0?.info.address != ZERO_ADDRESS
      ? (tokenInfosAndBalances || []).filter((t) => t.info.address == ZERO_ADDRESS)
      : filteredTokens;

  function clearSearch() {
    search = "";
  }
</script>

<input
  type="checkbox"
  {id}
  class="modal-toggle lg:block hidden"
  bind:checked={open}
  bind:this={checkbox}
/>

{#if open && isDesktop}
<div use:portal use:closeOnEscape={() => (open = false)} class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 p-6 lg:flex" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} tabindex="-1" on:click={() => (open = false)} on:keydown={(e) => e.key == "Escape" && (open = false)}>
  <div class="w-full max-w-3xl" role="presentation" on:click|stopPropagation on:keydown|stopPropagation>
    <div class="token-modal bg-opaque block rounded-xl border p-6">
      <div class="mb-5 flex items-start justify-between gap-6">
        <div>
          <p class="protocol-label">{modalCopy.label}</p>
          <h2 id={`${id}-title`} class="mt-1 text-2xl font-semibold leading-tight">
            {modalCopy.title}
          </h2>
          <p class="mt-2 max-w-xl text-sm text-base-content/70">
            {modalCopy.description}
          </p>
        </div>
        <button
          class="btn btn-ghost btn-sm rounded-full"
          aria-label="Close token selector"
          on:click={() => (open = false)}
        >
          <Icon icon="akar-icons:cross" class="text-base" />
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          class="token-tab"
          class:token-tab-active={selectToken == "token0"}
          on:click={() => {
            selectToken = "token0";
          }}
        >
          <span>{modalCopy.token0}</span>
          <strong>{selectedToken0?.info?.symbol || modalCopy.token0Fallback}</strong>
        </button>
        <button
          type="button"
          class="token-tab"
          class:token-tab-active={selectToken == "token1"}
          on:click={() => {
            selectToken = "token1";
          }}
        >
          <span>{modalCopy.token1}</span>
          <strong>{selectedToken1?.info?.symbol || modalCopy.token1Fallback}</strong>
        </button>
      </div>

      <div class="token-search mt-5">
        <Icon icon="akar-icons:search" class="text-lg text-primary" />
        <input
          type="text"
          class="input input-ghost min-w-0 flex-1"
          bind:value={search}
          placeholder="Search by exposure or symbol"
        />
        {#if search}
          <button type="button" class="btn btn-ghost btn-xs rounded-full" on:click={clearSearch}>
            Clear
          </button>
        {/if}
      </div>

      <div class="grid gap-4 pt-5 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <Menu bind:terms />
        <TokenList bind:selectedToken {sortedTokens} />
      </div>
    </div>
    <div class="flex py-4 justify-between lg:w-full">
      <button
        class="btn !bg-opaque w-2/5 border border-white/10"
        on:click={(_) => {
          open = false;
        }}>Close</button
      >
      {#if selectedToken}
        <!-- <button
          transition:scale|local
          class="btn btn-primary no-animation w-2/5">Token 2</button
        > -->
        {#if selectToken == "token0"}
          <button
            type="button"
            transition:scale|local
            class="btn btn-primary no-animation w-2/5"
            id="modal-next"
            on:click={(e) => {
              e.preventDefault();
              selectToken = "token1";
            }}
          >
            {modalCopy.next}
          </button>
        {:else if selectToken == "token1"}
          {#if !otherTokenSelected}
            <button
              type="button"
              transition:scale|local
              class="btn btn-primary no-animation w-2/5"
              on:click={(e) => {
                e.preventDefault();
                !otherTokenSelected
                  ? (selectToken = "token0")
                  : (open = false);
              }}>{!otherTokenSelected ? modalCopy.previous : "Done"}</button
            >
          {:else}
            <button
              class="btn btn-primary no-animation w-2/5"
              id="done"
              on:click={(e) => {
                e.preventDefault();
                open = false;
                // if ($appState.help) {
                //   driveOTC(
                //     selectedToken0?.info?.symbol,
                //     selectedToken1?.info?.symbol
                //   );
                // }
              }}
            >
              Done
            </button>
          {/if}
        {/if}
      {/if}
      <!-- <buton class="btn btn-primary flex-grow">Token 2</buton> -->
    </div>
  </div>
</div>
{/if}

{#if !isDesktop}
  <Drawer.Root bind:open>
    <!-- <Drawer.Trigger /> -->
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 bg-black/40 lg:hidden z-10" />
      <Drawer.Content
        class="token-modal rounded-t-2xl pb-8 pt-3 bg-opaque fixed bottom-0 left-0 right-0 fine-border lg:hidden z-10"
      >
        <div class="mb-6 h-1 w-12 rounded-full bg-base-content/40 m-auto"></div>
        <div class="px-4">
          <p class="protocol-label">{modalCopy.label}</p>
          <h2 class="mt-1 text-xl font-semibold">{modalCopy.title}</h2>
          <div class="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              class="token-tab"
              class:token-tab-active={selectToken == "token0"}
              on:click={() => (selectToken = "token0")}
            >
              <span>{modalCopy.token0}</span>
              <strong>{selectedToken0?.info?.symbol || modalCopy.token0Fallback}</strong>
            </button>
            <button
              type="button"
              class="token-tab"
              class:token-tab-active={selectToken == "token1"}
              on:click={() => (selectToken = "token1")}
            >
              <span>{modalCopy.token1}</span>
              <strong>{selectedToken1?.info?.symbol || modalCopy.token1Fallback}</strong>
            </button>
          </div>
          <div class="token-search mt-4">
            <Icon icon="akar-icons:search" class="text-lg text-primary" />
            <input
              type="text"
              class="input input-ghost min-w-0 flex-1"
              bind:value={search}
              placeholder="Search by exposure or symbol"
            />
          </div>
        </div>
        <TokenList bind:selectedToken {sortedTokens} />
        <Menu bind:terms />
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}

<style>
  .token-modal {
    border-color: rgb(var(--sf-green) / 0.18);
    box-shadow:
      0 28px 80px rgb(0 0 0 / 0.28),
      inset 0 1px 0 rgb(var(--sf-border) / 0.08);
  }

  .protocol-label {
    color: rgb(var(--sf-green));
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .token-tab {
    min-width: 0;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    text-align: left;
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      color 160ms ease;
  }

  .token-tab span {
    display: block;
    color: hsl(var(--bc) / 0.66);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .token-tab strong {
    display: block;
    margin-top: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.96rem;
  }

  .token-tab-active {
    background: rgb(var(--sf-green) / 0.14);
    color: hsl(var(--bc));
    box-shadow: inset 0 0 0 1px rgb(var(--sf-green) / 0.26);
  }

  .token-search {
    display: flex;
    min-height: 3.25rem;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid rgb(var(--sf-green) / 0.18);
    border-radius: 0.5rem;
    background: rgb(255 255 255 / 0.06);
    padding: 0 0.75rem;
  }

  .token-search :global(input) {
    padding-left: 0;
  }
</style>
