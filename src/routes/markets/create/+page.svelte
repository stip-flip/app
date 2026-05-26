<script lang="ts">
  import { page } from "$app/stores";
  import { formatUnits, keccak256, solidityPack } from "ethers/lib/utils";
  import { SimplePool } from "nostr-tools/pool";
  import { onDestroy, onMount } from "svelte";
  import { broadcastTransaction } from "src/hooks/transactions";
  import type { OracleSummaryFragmentFragment, SynthFragmentFragment } from "src/hooks/subgraph";
  import { switchNetwork, updateVc } from "src/lib";
  import { navigate } from "src/lib/path";
  import { modal } from "src/lib/web3";
  import { compact, compactEther, etherValue, formatDate, shortAddress } from "src/lib/stats";
  import { gqlsdk, sdk } from "src/stores";
  import { chainId, defaultEvmStores, signer, signerAddress } from "svelte-ethers-store";

  type Leverage = "NONE" | "SQUARED" | "CUBED";

  type OracleSummary = OracleSummaryFragmentFragment & {
    description?: string;
    frequency?: number | null;
    currentRound?: string;
    liveLastRound?: string;
    slots?: OracleSlot[];
    loadingContract?: boolean;
    contractError?: string;
  };

  type OracleSlot = {
    index: number;
    label: string;
    formula?: string;
    price: string;
    decimals: number;
  };

  type OracleSlotDefinition = {
    index: number;
    label: string;
    formula?: string;
    decimals?: number;
  };

  type NostrMethodologyEvent = {
    id: string;
    pubkey: string;
    kind: number;
    tags: string[][];
    content: string;
  };

  type ExistingMarket = SynthFragmentFragment & {
    latestSnapshots?: { timestamp?: number | null }[];
  };

  type MarketProposal = {
    slotIndex: number;
    long: boolean;
    leverage: Leverage;
    name: string;
    description: string;
  };

  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const specEventKind = 30312;
  const nostrRelays = [
    "wss://relay.nuts.cash",
    "wss://relay.damus.io",
    "wss://nos.lol",
    "wss://relay.nostr.band",
  ];
  const leverageOptions: Leverage[] = ["NONE", "SQUARED", "CUBED"];
  const sideOptions = [
    { long: true, label: "Stip" },
    { long: false, label: "Flip" },
  ];

  let oracles: OracleSummary[] = [];
  let selectedOracleId = "";
  let selectedSlotIndex = 0;
  let selectedLong = true;
  let selectedLeverage: Leverage = "NONE";
  let tokenSymbol = "";
  let tokenDescription = "";
  let existingMarkets: ExistingMarket[] = [];
  let loading = true;
  let error = "";
  let sdkReady: any = null;
  let walletProviderAvailable = false;
  let marketDeploying = false;
  let marketDeployError = "";
  let marketStatus = "";
  let deployedAddress = "";
  let deployTxHash = "";
  let contractLoadRequest = 0;
  let loadedOracleContractKey = "";
  let loadingOracleContractKey = "";
  let existingMarketAddress = "";
  let existingMarketLoading = false;
  let existingMarketError = "";
  let existingMarketRequest = 0;
  let checkedMarketKey = "";

  $: selectedOracle = oracles.find((oracle) => oracle.id === selectedOracleId);
  $: selectedSlot = selectedOracle?.slots?.find((slot) => slot.index === Number(selectedSlotIndex));
  $: selectedMarketsForOracle = selectedOracleId
    ? existingMarkets.filter((market) => String(market.oracle || "").toLowerCase() === selectedOracleId.toLowerCase())
    : [];
  $: marketProposal = createMarketProposal(selectedOracle, selectedSlot, selectedLong, selectedLeverage, tokenSymbol, tokenDescription);
  $: selectedMarketKey =
    marketProposal && selectedOracle
      ? marketDeploymentKey(selectedOracle.id, marketProposal.slotIndex, marketProposal.long, marketProposal.leverage)
      : "";
  $: deployProblem = marketDeploymentProblem(selectedOracle, selectedSlot, marketProposal);
  $: if (selectedMarketKey && selectedMarketKey !== checkedMarketKey) {
    refreshExistingMarket(selectedMarketKey);
  } else if (!selectedMarketKey && checkedMarketKey) {
    clearExistingMarketState();
  }

  onMount(() => {
    updateVc();
    hydrateWalletFromModal();
    const unsubscribeModal = modal.subscribeProvider((state) => {
      walletProviderAvailable = Boolean(state?.provider || modal.getWalletProvider());
      hydrateWalletFromModal();
    });

    return () => unsubscribeModal?.();
  });

  const unsubscribeGql = gqlsdk.subscribe(($gqlsdk) => {
    if (!$gqlsdk) return;

    loading = true;
    error = "";
    Promise.all([$gqlsdk.getOracleSummaries({ first: 1000 }), $gqlsdk.getSynths({})])
      .then(([oracleRes, synthRes]) => {
        oracles = mergeOracleSummaries(oracleRes.oracles || []);
        existingMarkets = synthRes.synths || [];
        if (!selectedOracleId && oracles[0]) selectedOracleId = oracles[0].id;
        loadOracleContracts();
      })
      .catch((err) => {
        console.warn("Unable to load market creation data", err);
        error = "Unable to load oracles and markets.";
      })
      .finally(() => {
        loading = false;
      });
  });

  const unsubscribeSdk = sdk.subscribe(($sdk) => {
    sdkReady = $sdk;
    if (sdkReady && oracles.length) loadOracleContracts();
  });

  onDestroy(() => {
    unsubscribeGql();
    unsubscribeSdk();
  });

  async function hydrateWalletFromModal() {
    const walletProvider = modal.getWalletProvider() || (typeof window !== "undefined" ? window.ethereum : undefined);
    walletProviderAvailable = Boolean(walletProvider);
    if (!walletProvider) return;

    try {
      await defaultEvmStores.setProvider(walletProvider);
    } catch (err) {
      console.warn("Failed to hydrate wallet provider", err);
    }
  }

  async function ensureWalletSigner() {
    if ($signer) return true;

    await hydrateWalletFromModal();
    if ($signer) return true;

    await modal.open();
    await hydrateWalletFromModal();
    return Boolean($signer);
  }

  function resetMarketForm() {
    tokenSymbol = "";
    tokenDescription = "";
    marketStatus = "";
    marketDeployError = "";
    deployedAddress = "";
    deployTxHash = "";
  }

  function clearExistingMarketState() {
    checkedMarketKey = "";
    existingMarketAddress = "";
    existingMarketLoading = false;
    existingMarketError = "";
  }

  function mergeOracleSummaries(nextOracles: OracleSummary[]) {
    return nextOracles.map((oracle) => {
      const existing = oracles.find((current) => current.id === oracle.id);
      if (!existing) return oracle;

      return {
        ...oracle,
        description: existing.description,
        frequency: existing.frequency,
        currentRound: existing.currentRound,
        liveLastRound: existing.liveLastRound,
        slots: existing.slots,
        loadingContract: existing.loadingContract,
        contractError: existing.contractError,
      };
    });
  }

  function oracleContractLoadKey() {
    if (!sdkReady?.ORACLE || !oracles.length) return "";
    const oracleIds = oracles.map((oracle) => oracle.id.toLowerCase()).sort().join(",");
    return `${sdkReady.ORACLE.address || "oracle"}:${oracleIds}`;
  }

  function selectMarketSide(long: boolean) {
    selectedLong = long;
    resetMarketForm();
  }

  function selectMarketLeverage(leverage: Leverage) {
    selectedLeverage = leverage;
    resetMarketForm();
  }

  function handleMarketSideChange(event: Event) {
    selectMarketSide((event.currentTarget as HTMLSelectElement).value === "true");
  }

  function handleMarketLeverageChange(event: Event) {
    selectMarketLeverage((event.currentTarget as HTMLSelectElement).value as Leverage);
  }

  async function loadOracleContracts() {
    if (!sdkReady?.ORACLE || !oracles.length) return;

    const loadKey = oracleContractLoadKey();
    if (!loadKey || loadKey === loadedOracleContractKey || loadKey === loadingOracleContractKey) return;

    const request = ++contractLoadRequest;
    loadingOracleContractKey = loadKey;
    oracles = oracles.map((oracle) => ({ ...oracle, loadingContract: true, contractError: "" }));

    const nextOracles = await Promise.all(
      oracles.map(async (oracle) => {
        try {
          const contract = sdkReady.ORACLE.attach(oracle.id);
          const [description, frequency, currentRound, liveLastRound, rawSlots] = await Promise.all([
            contract.description().catch(() => ""),
            contract.frequency().catch(() => null),
            contract.getCurrentRound().catch(() => null),
            contract.getLastRound(false).catch(() => null),
            loadOracleSlots(contract),
          ]);
          const slotDefinitions = await loadSlotDefinitions(description);
          const slots = rawSlots.map((slot) => ({
            ...slot,
            label: slotDefinitions[slot.index]?.label || slot.label,
            formula: slotDefinitions[slot.index]?.formula,
          }));

          return {
            ...oracle,
            description,
            frequency: frequency === null ? null : Number(frequency),
            currentRound: currentRound?.toString?.() || "",
            liveLastRound: liveLastRound?.toString?.() || "",
            slots,
            loadingContract: false,
            contractError: "",
          };
        } catch (err) {
          console.warn("Unable to load oracle contract", oracle.id, err);
          return {
            ...oracle,
            slots: [],
            loadingContract: false,
            contractError: "Unable to read live oracle slots.",
          };
        }
      })
    );

    if (request !== contractLoadRequest) return;

    oracles = nextOracles;
    loadedOracleContractKey = loadKey;
    loadingOracleContractKey = "";
    if (!selectedOracleId && oracles[0]) selectedOracleId = oracles[0].id;
    if (selectedOracle?.slots?.length && !selectedSlot) selectedSlotIndex = selectedOracle.slots[0].index;
  }

  async function loadOracleSlots(contract: any) {
    const slots = (
      await Promise.all(
        Array.from({ length: 8 }, async (_, index) => {
          try {
            const [price, decimals] = await Promise.all([
              contract["lastPrice(uint8)"](index),
              contract.getDecimals(index),
            ]);

            if (price.isZero()) return null;

            return {
              index,
              label: `Slot ${index}`,
              price: formatUnits(price, decimals),
              decimals: Number(decimals),
            };
          } catch {
            return null;
          }
        })
      )
    ).filter(Boolean) as OracleSlot[];

    return slots;
  }

  function parseMethodologyPointer(description: string) {
    const pubkey = description.match(/^Spec author:\s*([0-9a-f]{64})$/im)?.[1];
    const d = description.match(/^Spec d:\s*(.+)$/im)?.[1]?.trim();
    const specHash = description.match(/^Spec hash:\s*(0x[0-9a-f]{64})$/im)?.[1];
    if (!pubkey || !d || !specHash) return null;
    return { pubkey, d, specHash };
  }

  function eventHasDTag(event: NostrMethodologyEvent, d: string) {
    return event.tags.some((tag) => tag[0] === "d" && tag[1] === d);
  }

  async function loadSlotDefinitions(description: string) {
    const pointer = parseMethodologyPointer(description);
    if (!pointer) return {} as Record<number, OracleSlotDefinition>;

    const filters = { kinds: [specEventKind], authors: [pointer.pubkey], "#d": [pointer.d] };
    const relayFetches = nostrRelays.map(async (relay) => {
      const pool = new SimplePool();
      try {
        const event = (await pool.get([relay], filters, { maxWait: 4000 })) as NostrMethodologyEvent | null;
        if (!event) throw new Error(`No methodology event returned from ${relay}.`);
        if (event.kind !== specEventKind || event.pubkey !== pointer.pubkey || !eventHasDTag(event, pointer.d)) {
          throw new Error(`Methodology coordinate mismatch from ${relay}.`);
        }

        const content = JSON.parse(event.content) as {
          methodology?: { hash?: string };
          spec?: { slots?: OracleSlotDefinition[] };
        };
        if (content.methodology?.hash !== pointer.specHash) throw new Error(`Methodology hash mismatch from ${relay}.`);
        return content.spec?.slots || [];
      } finally {
        pool.close([relay]);
      }
    });

    try {
      const slots = await Promise.any(relayFetches);
      return Object.fromEntries(
        slots
          .filter((slot) => Number.isInteger(slot.index) && slot.label)
          .map((slot) => [slot.index, slot])
      ) as Record<number, OracleSlotDefinition>;
    } catch (err) {
      console.warn("Unable to load oracle methodology", err);
      return {} as Record<number, OracleSlotDefinition>;
    }
  }

  function leverageValue(leverage: Leverage) {
    return leverageOptions.indexOf(leverage);
  }

  function leverageSuffix(leverage: Leverage) {
    if (leverage === "SQUARED") return "²";
    if (leverage === "CUBED") return "³";
    return "";
  }

  function defaultMarketSymbol() {
    const slotName = selectedSlot?.label || `SLOT${selectedSlotIndex}`;
    return slotName.replace(/\s+/g, "").toUpperCase();
  }

  function marketName(long: boolean, leverage: Leverage) {
    return `${long ? "Stip" : "Flip"} ${defaultMarketSymbol()}${leverageSuffix(leverage)}`;
  }

  function proposalMarketName(proposal: MarketProposal) {
    return `${proposal.long ? "Stip" : "Flip"} ${proposal.name}${leverageSuffix(proposal.leverage)}`;
  }

  function marketDeploymentKey(oracleAddress: string, slotIndex: number, long: boolean, leverage: Leverage) {
    return keccak256(
      solidityPack(["address", "uint8", "bool", "uint8"], [oracleAddress, slotIndex, long, leverageValue(leverage)])
    );
  }

  function createMarketProposal(
    oracle: OracleSummary | undefined,
    slot: OracleSlot | undefined,
    long: boolean,
    leverage: Leverage,
    symbol: string,
    description: string
  ): MarketProposal | undefined {
    if (!oracle || !slot) return undefined;

    const name = symbol.trim() || defaultMarketSymbol();
    return {
      slotIndex: slot.index,
      long,
      leverage,
      name,
      description:
        description.trim() ||
        `${proposalMarketName({ slotIndex: slot.index, long, leverage, name, description: "" })} market using ${shortAddress(oracle.id, 10)} slot ${slot.index}`,
    };
  }

  async function refreshExistingMarket(key: string) {
    if (!sdkReady?.SYNTH_FACTORY) {
      clearExistingMarketState();
      return;
    }

    const request = ++existingMarketRequest;
    checkedMarketKey = key;
    existingMarketAddress = "";
    existingMarketError = "";
    existingMarketLoading = true;

    try {
      const existingAddress = await sdkReady.SYNTH_FACTORY.synths(key);
      if (request !== existingMarketRequest || key !== checkedMarketKey) return;
      existingMarketAddress = existingAddress && existingAddress !== zeroAddress ? existingAddress : "";
    } catch (err) {
      if (request !== existingMarketRequest || key !== checkedMarketKey) return;
      console.warn("Unable to check existing market", err);
      existingMarketError = "Unable to check whether this market already exists.";
    } finally {
      if (request === existingMarketRequest && key === checkedMarketKey) {
        existingMarketLoading = false;
      }
    }
  }

  function marketDeploymentProblem(
    oracle: OracleSummary | undefined,
    slot: OracleSlot | undefined,
    proposal: MarketProposal | undefined
  ) {
    if (!oracle) return "Select an oracle.";
    if (oracle.loadingContract) return "Oracle slots are still loading.";
    if (oracle.contractError) return oracle.contractError;
    if (!slot) return "Select an oracle slot with a non-zero live price.";
    if (!sdkReady?.SYNTH_FACTORY) return "SynthFactory is not available on this network.";
    if (!$signer && !walletProviderAvailable) return $signerAddress ? "Reconnect your wallet signer before deploying." : "Connect a wallet before deploying.";
    if (!$signer && walletProviderAvailable) return "Wallet provider found. Click Create Market to load the signer and continue.";
    if (Number($chainId || 0) !== 63) return "Switch your wallet to Mordor before deploying.";
    if (!proposal?.name.trim()) return "Enter a token symbol.";
    return "";
  }

  function canDeployMarket() {
    const problem = marketDeploymentProblem(selectedOracle, selectedSlot, marketProposal);
    return (
      !problem ||
      problem.startsWith("Wallet provider found.") ||
      problem.startsWith("Connect a wallet") ||
      problem.startsWith("Reconnect your wallet")
    );
  }

  async function deployMarket() {
    marketDeployError = "";
    marketStatus = "";

    if (!marketProposal || !selectedOracle || !selectedSlot) {
      marketDeployError = "Select an oracle slot before creating a market.";
      return;
    }

    if (!sdkReady?.SYNTH_FACTORY) {
      marketDeployError = "SynthFactory is not available on this network.";
      return;
    }

    if (!(await ensureWalletSigner())) {
      marketDeployError = $signerAddress ? "Reconnect your wallet signer before deploying." : "Connect a wallet before deploying.";
      return;
    }

    if (Number($chainId || 0) !== 63) {
      marketDeployError = "SynthFactory is currently configured for Mordor only.";
      return;
    }

    marketDeploying = true;
    try {
      const factory = sdkReady.SYNTH_FACTORY.connect($signer);
      if (existingMarketAddress) {
        marketStatus = `Market already exists at ${existingMarketAddress}`;
        return;
      }
      const existingAddress = selectedMarketKey ? await sdkReady.SYNTH_FACTORY.synths(selectedMarketKey) : zeroAddress;
      if (existingAddress !== zeroAddress) {
        existingMarketAddress = existingAddress;
        marketStatus = `Market already exists at ${existingAddress}`;
        return;
      }

      const predictedAddress = await factory.callStatic.createSynth(
        selectedOracle.id,
        marketProposal.slotIndex,
        marketProposal.name,
        marketProposal.description,
        marketProposal.long,
        leverageValue(marketProposal.leverage)
      );
      const tx = await broadcastTransaction(
        `Creating ${proposalMarketName(marketProposal)}`,
        factory.createSynth(
          selectedOracle.id,
          marketProposal.slotIndex,
          marketProposal.name,
          marketProposal.description,
          marketProposal.long,
          leverageValue(marketProposal.leverage)
        )
      );
      await tx.wait();

      deployedAddress = predictedAddress;
      deployTxHash = tx.hash;
      marketStatus = `Market deployed at ${predictedAddress}`;
    } catch (err) {
      marketDeployError = err instanceof Error ? err.message : "Market deployment failed.";
    } finally {
      marketDeploying = false;
    }
  }

  function formatDuration(seconds?: number | null) {
    if (!seconds) return "Unknown";
    if (seconds >= 86400 && seconds % 86400 === 0) return `${compact(seconds / 86400, 0)} days`;
    if (seconds >= 3600 && seconds % 3600 === 0) return `${compact(seconds / 3600, 0)} hours`;
    if (seconds >= 60 && seconds % 60 === 0) return `${compact(seconds / 60, 0)} mins`;
    return `${compact(seconds, 0)} sec`;
  }

  function marketUpdatedAt(market: ExistingMarket) {
    return formatDate(market.latestSnapshots?.[0]?.timestamp);
  }

  function oracleDisplayRound(oracle: OracleSummary) {
    return Number(oracle.liveLastRound || 0) || Number(oracle.lastRound || 0);
  }
</script>

<svelte:head>
  <title>Create Market | Stip & Flip</title>
</svelte:head>

<header
  class="app-page-header fixed w-full px-8 pt-20 lg:relative lg:m-auto lg:mt-40 lg:max-w-7xl lg:px-0 lg:pt-0"
  id="top"
>
  <div class="py-4">
    <a class="app-muted mb-3 inline-flex items-center gap-2 text-sm font-semibold hover:text-white" href={navigate("/markets", $page.url)}>
      <span aria-hidden="true">←</span>
      <span>Back to markets</span>
    </a>
    <div class="app-label">Market creation</div>
    <div class="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <h1 class="text-3xl font-bold lg:text-5xl">Create market from Oracle</h1>
        <p class="app-muted mt-2 max-w-3xl">
          Pick an existing oracle, choose a live non-zero slot, then deploy the missing synth market.
        </p>
      </div>
      <a class="btn btn-outline rounded-full" href={navigate("/oracles/create", $page.url)}>Create oracle</a>
    </div>
  </div>
</header>

<div class="lg:h-auto lg:pt-0 container-height" id="container">
  <div class="mx-auto max-w-7xl space-y-6 px-4 lg:px-0">
    <section class="grid gap-3 md:grid-cols-3">
      <div class="app-panel rounded-lg p-4">
        <div class="app-label">Oracles</div>
        <div class="mt-2 text-3xl font-bold">{oracles.length}</div>
        <div class="app-muted mt-1 text-sm">Available settlement feeds</div>
      </div>
      <div class="app-panel rounded-lg p-4">
        <div class="app-label">Live slots</div>
        <div class="mt-2 text-3xl font-bold">{selectedOracle?.slots?.length || 0}</div>
        <div class="app-muted mt-1 text-sm">Non-zero prices on selected oracle</div>
      </div>
      <div class="app-panel rounded-lg p-4">
        <div class="app-label">Existing markets</div>
        <div class="mt-2 text-3xl font-bold">{selectedMarketsForOracle.length}</div>
        <div class="app-muted mt-1 text-sm">Already using selected oracle</div>
      </div>
    </section>

    {#if loading}
      <section class="app-panel rounded-lg p-8 app-muted">Loading oracles...</section>
    {:else if error}
      <section class="app-panel rounded-lg p-8 text-error">{error}</section>
    {:else if oracles.length === 0}
      <section class="app-panel rounded-lg p-8">
        <div class="app-label">No oracle found</div>
        <h2 class="mt-2 text-2xl font-bold">Create an oracle before creating a market</h2>
        <p class="app-muted mt-3 max-w-2xl">
          Markets are created from existing oracle slots. Once an oracle has been deployed and has at least one non-zero
          submitted slot price, it will appear here.
        </p>
        <a class="btn btn-primary mt-5 rounded-full" href={navigate("/oracles/create", $page.url)}>
          Create oracle
        </a>
      </section>
    {:else}
      <section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="app-panel rounded-lg p-5">
          <div class="app-label">1. Oracle</div>
          <h2 class="mt-1 text-xl font-bold">Select settlement source</h2>
          <div class="mt-4 space-y-3">
            {#each oracles as oracle (oracle.id)}
              <button
                class={`w-full rounded-lg border p-4 text-left transition ${
                  selectedOracleId === oracle.id
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
                type="button"
                on:click={() => {
                  selectedOracleId = oracle.id;
                  selectedSlotIndex = oracle.slots?.[0]?.index || 0;
                  resetMarketForm();
                }}
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="font-mono font-bold">{shortAddress(oracle.id, 10)}</div>
                    <div class="app-muted mt-1 text-sm">{formatDuration(oracle.frequency)} cadence</div>
                  </div>
                  <span class="badge badge-outline">{oracle.slots?.length || 0} slots</span>
                </div>
                <div class="app-muted mt-3 grid gap-2 text-xs sm:grid-cols-3">
                  <span>{compactEther(oracle.totalStake)} ETC staked</span>
                  <span>{compact(oracle.participantCount, 0)} stakers</span>
                  <span>round {compact(oracleDisplayRound(oracle), 0)}</span>
                </div>
                {#if oracle.contractError}
                  <div class="mt-3 text-sm text-error">{oracle.contractError}</div>
                {:else if oracle.loadingContract}
                  <div class="app-muted mt-3 text-sm">Reading contract slots...</div>
                {/if}
              </button>
            {/each}
          </div>
        </div>

        <div class="space-y-6">
          <section class="app-panel rounded-lg p-5">
            <div class="app-label">2. Slot</div>
            <h2 class="mt-1 text-xl font-bold">Choose a live oracle slot</h2>

            {#if selectedOracle?.loadingContract}
              <div class="app-muted mt-4">Reading oracle contract...</div>
            {:else if !selectedOracle?.slots?.length}
              <div class="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm">
                This oracle has no non-zero live slots yet. Submit at least one valid price round before creating a market.
              </div>
            {:else}
              <div class="mt-4 grid gap-3 md:grid-cols-2">
                {#each selectedOracle.slots as slot (slot.index)}
                  <button
                    class={`rounded-lg border p-4 text-left ${
                      Number(selectedSlotIndex) === slot.index
                        ? "border-primary bg-primary/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                    type="button"
                    on:click={() => {
                      selectedSlotIndex = slot.index;
                      resetMarketForm();
                    }}
                  >
                    <div class="app-label">Slot {slot.index}</div>
                    {#if slot.formula}
                      <div class="app-muted mt-1 font-mono text-xs">{slot.formula}</div>
                    {/if}
                    {#if slot.label !== `Slot ${slot.index}`}
                      <div class="mt-2 text-lg font-bold">{slot.label}</div>
                    {/if}
                    <div class="mt-2 break-words font-mono text-2xl font-bold">{slot.price}</div>
                    <div class="app-muted mt-2 text-sm">{slot.decimals} decimals</div>
                  </button>
                {/each}
              </div>
            {/if}
          </section>

          <section class="app-panel rounded-lg p-5">
            <div class="app-label">3. Market</div>
            <h2 class="mt-1 text-xl font-bold">Configure synth</h2>

            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <label class="form-control">
                <span class="label-text">Side</span>
                <select class="select select-bordered" value={selectedLong} on:change={handleMarketSideChange}>
                  {#each sideOptions as side (side.label)}
                    <option value={side.long}>{side.label}</option>
                  {/each}
                </select>
              </label>
              <label class="form-control">
                <span class="label-text">Leverage</span>
                <select class="select select-bordered" value={selectedLeverage} on:change={handleMarketLeverageChange}>
                  {#each leverageOptions as leverage (leverage)}
                    <option value={leverage}>{leverage}</option>
                  {/each}
                </select>
              </label>
              <label class="form-control">
                <span class="label-text">Token symbol</span>
                <input class="input input-bordered font-mono" placeholder={defaultMarketSymbol()} bind:value={tokenSymbol} />
              </label>
              <label class="form-control md:col-span-2">
                <span class="label-text">Description</span>
                <textarea class="textarea textarea-bordered min-h-24" bind:value={tokenDescription}></textarea>
              </label>
            </div>

            {#if marketProposal}
              <div class="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm">
                <div class="app-label">Preview</div>
                <div class="mt-2 font-bold">{proposalMarketName(marketProposal)}</div>
                <div class="app-muted mt-1 font-mono">{marketProposal.name}</div>
                <div class="app-muted mt-2">{marketProposal.description}</div>
              </div>
            {/if}

            {#if deployProblem}
              <div class="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning-content">{deployProblem}</div>
            {/if}
            {#if marketDeployError}
              <div class="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{marketDeployError}</div>
            {/if}
            {#if existingMarketLoading}
              <div class="app-muted mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
                Checking whether this market already exists...
              </div>
            {/if}
            {#if existingMarketError}
              <div class="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning-content">{existingMarketError}</div>
            {/if}
            {#if existingMarketAddress}
              <div class="mt-4 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
                Market already deployed at
                <a class="break-all font-mono underline" href={navigate(`/markets/${existingMarketAddress}`, $page.url)}>
                  {existingMarketAddress}
                </a>
              </div>
            {/if}
            {#if marketStatus}
              <div class="mt-4 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">{marketStatus}</div>
            {/if}
            {#if deployedAddress}
              <div class="app-muted mt-2 break-all font-mono text-xs">
                tx {deployTxHash}
              </div>
            {/if}

            <div class="mt-5 flex flex-wrap gap-2">
              {#if !$signer && !walletProviderAvailable}
                <button class="btn btn-primary rounded-full" type="button" on:click={ensureWalletSigner}>
                  {$signerAddress ? "Reconnect Wallet" : "Connect Wallet"}
                </button>
              {:else if Number($chainId || 0) !== 63}
                <button class="btn btn-primary rounded-full" type="button" on:click={() => switchNetwork(63)}>
                  Switch to Mordor
                </button>
              {/if}
              <button
                class="btn btn-primary rounded-full"
                type="button"
                disabled={marketDeploying || existingMarketLoading || Boolean(existingMarketAddress) || !marketProposal || !sdkReady?.SYNTH_FACTORY}
                on:click={deployMarket}
              >
                {marketDeploying ? "Creating..." : "Create Market"}
              </button>
            </div>
          </section>
        </div>
      </section>

      {#if selectedMarketsForOracle.length}
        <section class="app-panel overflow-hidden rounded-lg">
          <div class="border-b border-white/10 p-4">
            <div class="app-label">Already created</div>
            <h2 class="mt-1 text-xl font-bold">Markets using selected oracle</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Market</th>
                  <th>Side</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {#each selectedMarketsForOracle as market (market.id)}
                  <tr>
                    <td>
                      <a class="font-mono text-primary" href={navigate(`/markets/${market.id}`, $page.url)}>{shortAddress(market.id, 10)}</a>
                    </td>
                    <td>{market.long ? "Long" : "Short"}</td>
                    <td>{marketUpdatedAt(market)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </section>
      {/if}
    {/if}
  </div>
</div>
