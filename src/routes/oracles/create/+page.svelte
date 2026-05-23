<script lang="ts">
  import Icon from "@iconify/svelte";
  import * as nip19 from "nostr-tools/nip19";
  import { SimplePool } from "nostr-tools/pool";
  import { defaultAbiCoder, formatEther, getCreate2Address, keccak256, parseEther, solidityPack } from "ethers/lib/utils";
  import { onMount } from "svelte";
  import { broadcastTransaction, resolveTransaction } from "src/hooks/transactions";
  import { switchNetwork, updateVc } from "src/lib";
  import { modal } from "src/lib/web3";
  import { sdk } from "src/stores";
  import { chainId, defaultEvmStores, signer, signerAddress } from "svelte-ethers-store";

  type Endpoint = {
    id: string;
    provider: string;
    url: string;
    maxAge: string;
    notes: string;
  };

  type EndpointTestResult = {
    ok: boolean;
    loading: boolean;
    status?: number;
    statusText?: string;
    preview?: string;
    error?: string;
    testedUrl?: string;
  };

  type Feed = {
    id: string;
    name: string;
    base: string;
    quote: string;
    observation: string;
    algorithm: string;
    minSources: number;
    clusterSize: number;
    rounding: string;
    endpoints: Endpoint[];
  };

  type Slot = {
    id: string;
    index: number;
    label: string;
    baseFeed: string;
    quoteFeed: string;
    formula: string;
    decimals: number;
    estimatedMax?: string;
    finalRounding: string;
    missingData: string;
  };

  type SynthPlan = {
    id: string;
    slotId: string;
    selected: boolean;
    long: boolean;
    leverage: "NONE" | "SQUARED" | "CUBED";
    name: string;
    description: string;
    initialLiquidity: string;
    deployedAddress?: string;
    deployTxHash?: string;
    deployedAt?: string;
  };

  type DurationUnit = "seconds" | "minutes" | "hours" | "days";
  type Step = "oracle" | "feeds" | "operate";

  type OracleDeployment = {
    configHash: string;
    chainId: number;
    factory: string;
    address: string;
    txHash: string;
    deployedAt: string;
  };

  type SpecPublication = {
    kind: 30312;
    chainId?: number;
    factory?: string;
    pubkey: string;
    d: string;
    relays: string[];
    specHash: string;
    eventId: string;
    naddr: string;
    predictedOracle: string;
    publishedAt: string;
    verifiedAt?: string;
    verifiedRelay?: string;
  };

  type NostrMethodologyEvent = {
    id: string;
    pubkey: string;
    kind: number;
    tags: string[][];
    content: string;
  };

  type CreateOracleDraft = {
    version: 1;
    savedAt: string;
    step: Step;
    oracle: {
      oracleName: string;
      initialized: string;
      frequencyValue: number;
      frequencyUnit: DurationUnit;
      roundDurationValue: number;
      roundDurationUnit: DurationUnit;
      delayValue: number;
      delayUnit: DurationUnit;
      minStake: string;
      modulo: number;
      drops: string;
    };
    oracleDeployment?: OracleDeployment;
    specPublication?: SpecPublication;
    feeds: Feed[];
    slots: Slot[];
    synths: SynthPlan[];
  };

  type DraftParseResult =
    | {
        ok: true;
        draft: CreateOracleDraft;
      }
    | {
        ok: false;
        error: string;
      };

  const draftKey = "stip-flip:create-oracle:draft:v1";
  const algorithms = [
    "single_source",
    "priority_fallback",
    "mean",
    "median",
    "trimmed_mean",
    "closest_cluster_mean",
    "weighted_mean",
  ];

  const roundingModes = ["floor", "ceil", "half_up", "half_even"];
  const leverageOptions: SynthPlan["leverage"][] = ["NONE", "SQUARED", "CUBED"];
  const durationUnits: DurationUnit[] = ["seconds", "minutes", "hours", "days"];
  const createSteps: { id: Step; label: string }[] = [
    { id: "oracle", label: "1. Oracle Parameters" },
    { id: "feeds", label: "2. Feeds and Slots" },
    { id: "operate", label: "3. Operate Oracle" },
  ];
  const specEventKind = 30312;
  const intentEventKind = 30313;
  const nostrRelays = [
    "wss://relay.nuts.cash",
    "wss://relay.damus.io",
    "wss://nos.lol",
    "wss://relay.nostr.band",
  ];
  const int32Max = 2147483647;
  const unitSeconds: Record<DurationUnit, number> = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
  };

  function createId() {
    return globalThis.crypto?.randomUUID?.() || `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function utcInputParts(value: string) {
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) return { date: "", time: "" };

    const iso = new Date(timestamp).toISOString();
    return {
      date: iso.slice(0, 10),
      time: iso.slice(11, 16),
    };
  }

  function setInitializedPart(part: "date" | "time", value: string) {
    const current = utcInputParts(initialized);
    const date = part === "date" ? value : current.date || new Date().toISOString().slice(0, 10);
    const time = part === "time" ? value : current.time || "00:00";

    if (!date || !time) {
      initialized = "";
      return;
    }

    initialized = new Date(`${date}T${time}:00.000Z`).toISOString().replace(".000Z", "Z");
  }

  function selectStep(target: Step) {
    if (target === "operate") {
      goToOperate();
      return;
    }

    step = target;
  }

  let step: Step = "oracle";
  let oracleName = "Crypto prices in ETC";
  let initialized = "";
  let frequencyValue = 1;
  let frequencyUnit: DurationUnit = "days";
  let roundDurationValue = 2;
  let roundDurationUnit: DurationUnit = "hours";
  let delayValue = 1;
  let delayUnit: DurationUnit = "hours";
  let minStake = "0.1";
  let modulo = 7;
  let drops = "6,0";

  let feeds: Feed[] = [
    {
      id: createId(),
      name: "BTC_USD",
      base: "BTC",
      quote: "USD",
      observation: "previous completed UTC day close",
      algorithm: "closest_cluster_mean",
      minSources: 3,
      clusterSize: 3,
      rounding: "half_up",
      endpoints: [
        {
          id: createId(),
          provider: "CoinGecko",
          url: "https://api.coingecko.com/api/v3/coins/bitcoin/history?date={DD-MM-YYYY}",
          maxAge:
            "The /history snapshot is implicitly 00:00:00 UTC for the requested date; latest completed UTC day is available after 00:35 UTC.",
          notes: "Use market_data.current_price.usd. Reject missing market_data or zero value.",
        },
      ],
    },
    {
      id: createId(),
      name: "ETC_USD",
      base: "ETC",
      quote: "USD",
      observation: "same target timestamp as dependent slots",
      algorithm: "median",
      minSources: 2,
      clusterSize: 2,
      rounding: "half_up",
      endpoints: [
        {
          id: createId(),
          provider: "CoinGecko",
          url: "https://api.coingecko.com/api/v3/coins/ethereum-classic/history?date={DD-MM-YYYY}",
          maxAge:
            "The /history snapshot is implicitly 00:00:00 UTC for the requested date; latest completed UTC day is available after 00:35 UTC.",
          notes: "Use market_data.current_price.usd. Reject missing market_data or zero value.",
        },
      ],
    },
  ];

  let slots: Slot[] = [
    {
      id: createId(),
      index: 0,
      label: "BTC/ETC",
      baseFeed: "BTC_USD",
      quoteFeed: "ETC_USD",
      formula: "BTC_USD / ETC_USD",
      decimals: 4,
      estimatedMax: "250000",
      finalRounding: "half_up",
      missingData: "Do not submit this slot for the round if either feed cannot be computed deterministically.",
    },
  ];

  let synths: SynthPlan[] = [
    {
      id: createId(),
      slotId: slots[0].id,
      selected: true,
      long: true,
      leverage: "NONE",
      name: "BTC",
      description: "Synthetic Bitcoin priced in ETC",
      initialLiquidity: "0",
    },
  ];

  let endpointTests: Record<string, EndpointTestResult> = {};
  let draftReady = false;
  let draftStatus = "";
  let importDraftInput: HTMLInputElement;
  let draftSaveTimer: ReturnType<typeof setTimeout>;
  let oracleDeployment: OracleDeployment | undefined;
  let specPublication: SpecPublication | undefined;
  let specPublishing = false;
  let specPublishError = "";
  let oracleDeploying = false;
  let oracleDeployError = "";
  let oracleStakeAmount = "0.1";
  let oracleStaking = false;
  let oracleStakeError = "";
  let oracleStakeStatusLoading = false;
  let oracleStakeStatusError = "";
  let oracleStakeStatus:
    | {
        stakeEtc: string;
        manaEtc: string;
        nostrPubkey: string;
        isStaked: boolean;
        linkedToSpec: boolean;
      }
    | undefined;
  let oracleStakeStatusKey = "";
  let specVerifying = false;
  let specVerifyError = "";
  let marketDeploying = false;
  let marketDeployError = "";
  let walletProviderAvailable = false;

  $: initializedParts = utcInputParts(initialized);

  onMount(() => {
    restoreDraft();
    oracleStakeAmount = minStake || "0.1";
    draftReady = true;
    updateVc();
    hydrateWalletFromModal();
    const unsubscribe = modal.subscribeProvider((state) => {
      walletProviderAvailable = Boolean(state?.provider || modal.getWalletProvider());
      hydrateWalletFromModal();
    });

    return () => {
      unsubscribe?.();
    };
  });

  function isDurationUnit(value: unknown): value is DurationUnit {
    return typeof value === "string" && durationUnits.includes(value as DurationUnit);
  }

  function isStep(value: unknown): value is Step {
    return value === "oracle" || value === "feeds" || value === "operate";
  }

  function createDraft(): CreateOracleDraft {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      step,
      oracle: {
        oracleName,
        initialized,
        frequencyValue,
        frequencyUnit,
        roundDurationValue,
        roundDurationUnit,
        delayValue,
        delayUnit,
        minStake,
        modulo,
        drops,
      },
      oracleDeployment,
      specPublication,
      feeds,
      slots,
      synths,
    };
  }

  function applyDraft(draft: CreateOracleDraft) {
    step = draft.step;
    oracleName = draft.oracle.oracleName;
    initialized = draft.oracle.initialized;
    frequencyValue = draft.oracle.frequencyValue;
    frequencyUnit = draft.oracle.frequencyUnit;
    roundDurationValue = draft.oracle.roundDurationValue;
    roundDurationUnit = draft.oracle.roundDurationUnit;
    delayValue = draft.oracle.delayValue;
    delayUnit = draft.oracle.delayUnit;
    minStake = draft.oracle.minStake;
    modulo = draft.oracle.modulo;
    drops = draft.oracle.drops;
    oracleDeployment = draft.oracleDeployment;
    specPublication = draft.specPublication;
    feeds = draft.feeds;
    slots = normalizeSlotIndexes(draft.slots);
    synths = draft.synths;
  }

  function parseDraft(value: string | null): DraftParseResult {
    if (!value) return { ok: false, error: "empty draft JSON" };

    try {
      const draft = JSON.parse(value) as Partial<CreateOracleDraft> & { step?: Step | "markets" };
      if (draft.version !== 1) return { ok: false, error: "expected draft version 1" };
      if (!draft.oracle) return { ok: false, error: "missing oracle section" };
      if (draft.step === "markets") draft.step = "operate";
      if (!isStep(draft.step)) return { ok: false, error: "invalid or missing step" };
      if (!isDurationUnit(draft.oracle.frequencyUnit)) return { ok: false, error: "invalid oracle.frequencyUnit" };
      if (!isDurationUnit(draft.oracle.roundDurationUnit)) {
        return { ok: false, error: "invalid oracle.roundDurationUnit" };
      }
      if (!isDurationUnit(draft.oracle.delayUnit)) return { ok: false, error: "invalid oracle.delayUnit" };
      if (!Array.isArray(draft.feeds)) return { ok: false, error: "missing feeds array" };
      if (!Array.isArray(draft.slots)) return { ok: false, error: "missing slots array" };
      if (!Array.isArray(draft.synths)) return { ok: false, error: "missing synths array" };

      return { ok: true, draft: draft as CreateOracleDraft };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "invalid JSON",
      };
    }
  }

  function restoreDraft() {
    const result = parseDraft(localStorage.getItem(draftKey));
    if (!result.ok) return;

    applyDraft(result.draft);
    draftStatus = `Draft restored from ${new Date(result.draft.savedAt).toLocaleString()}`;
  }

  function saveDraft() {
    if (!draftReady) return;

    localStorage.setItem(draftKey, JSON.stringify(createDraft()));
    draftStatus = "Draft saved";
  }

  function scheduleSaveDraft() {
    if (!draftReady) return;

    clearTimeout(draftSaveTimer);
    draftSaveTimer = setTimeout(saveDraft, 400);
  }

  function clearDraft() {
    clearTimeout(draftSaveTimer);
    localStorage.removeItem(draftKey);
    draftStatus = "Draft cleared";
    window.location.reload();
  }

  function exportDraft() {
    const text = JSON.stringify(createDraft(), null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `stip-flip-oracle-draft-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    draftStatus = "Draft exported";
  }

  async function copyDraft() {
    await navigator.clipboard.writeText(JSON.stringify(createDraft(), null, 2));
    draftStatus = "Draft copied";
  }

  function applyImportedDraft(text: string) {
    const result = parseDraft(text);
    if (!result.ok) {
      draftStatus = `Draft import failed: ${result.error}`;
      return;
    }

    applyDraft(result.draft);
    endpointTests = {};
    localStorage.setItem(draftKey, JSON.stringify(result.draft));
    draftStatus = "Draft imported";
  }

  async function importDraftFile(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      draftStatus = "Draft import failed: choose a .json file";
      return;
    }

    applyImportedDraft(await file.text());
  }

  function getUtcDateParts() {
    const date = new Date();
    const yyyy = date.getUTCFullYear().toString();
    const mm = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const dd = date.getUTCDate().toString().padStart(2, "0");
    return { yyyy, mm, dd };
  }

  function resolveUrlTemplate(url: string) {
    const { yyyy, mm, dd } = getUtcDateParts();
    const midnight = Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd), 0, 0, 0);
    const previousMidnight = midnight - 86_400_000;
    const nextMidnight = midnight + 86_400_000;
    const isoDateTime = (timestamp: number) => new Date(timestamp).toISOString().replace(".000Z", "Z");
    return url
      .trim()
      .replaceAll("{YYYY-MM-DD}", `${yyyy}-${mm}-${dd}`)
      .replaceAll("{YYYY/MM/DD}", `${yyyy}/${mm}/${dd}`)
      .replaceAll("{DD-MM-YYYY}", `${dd}-${mm}-${yyyy}`)
      .replaceAll("{DD/MM/YYYY}", `${dd}/${mm}/${yyyy}`)
      .replaceAll("{PREVIOUS_MIDNIGHT_MS}", previousMidnight.toString())
      .replaceAll("{PREVIOUS_MIDNIGHT_UNIX}", Math.floor(previousMidnight / 1000).toString())
      .replaceAll("{PREVIOUS_MIDNIGHT_ISO}", isoDateTime(previousMidnight))
      .replaceAll("{MIDNIGHT_MS}", midnight.toString())
      .replaceAll("{MIDNIGHT_UNIX}", Math.floor(midnight / 1000).toString())
      .replaceAll("{MIDNIGHT_ISO}", isoDateTime(midnight))
      .replaceAll("{NEXT_MIDNIGHT_MS}", nextMidnight.toString())
      .replaceAll("{NEXT_MIDNIGHT_UNIX}", Math.floor(nextMidnight / 1000).toString())
      .replaceAll("{NEXT_MIDNIGHT_ISO}", isoDateTime(nextMidnight))
      .replaceAll("{YYYY}", yyyy)
      .replaceAll("{MM}", mm)
      .replaceAll("{DD}", dd);
  }

  function previewResponse(body: unknown) {
    if (typeof body === "string") return body.slice(0, 1600);
    return JSON.stringify(body, null, 2).slice(0, 1600);
  }

  async function tryEndpoint(endpoint: Endpoint) {
    const testedUrl = resolveUrlTemplate(endpoint.url);
    if (!testedUrl) {
      endpointTests = {
        ...endpointTests,
        [endpoint.id]: { ok: false, loading: false, error: "Enter a URL before testing this endpoint." },
      };
      return;
    }

    endpointTests = {
      ...endpointTests,
      [endpoint.id]: { ok: false, loading: true, testedUrl },
    };

    try {
      const response = await fetch("/api/endpoint-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: testedUrl }),
      });
      const result = await response.json();
      const endpointOk = Boolean(response.ok && result.ok);

      endpointTests = {
        ...endpointTests,
        [endpoint.id]: {
          ok: endpointOk,
          loading: false,
          status: result.status ?? response.status,
          statusText: result.statusText ?? response.statusText,
          preview: result.body === undefined ? previewResponse(result) : previewResponse(result.body),
          testedUrl,
          error: endpointOk ? undefined : result.error || `HTTP ${result.status ?? response.status} ${result.statusText ?? response.statusText}`,
        },
      };
    } catch (error) {
      endpointTests = {
        ...endpointTests,
        [endpoint.id]: {
          ok: false,
          loading: false,
          testedUrl,
          error: error instanceof Error ? error.message : "Endpoint request failed.",
        },
      };
    }
  }

  function addEndpoint(feed: Feed) {
    feeds = feeds.map((item) =>
      item.id === feed.id
        ? {
            ...item,
            endpoints: [
              ...item.endpoints,
              {
                id: createId(),
                provider: "",
                url: "",
                maxAge: "",
                notes: "",
              },
            ],
          }
        : item
    );
  }

  function removeEndpoint(feed: Feed, endpointId: string) {
    feeds = feeds.map((item) =>
      item.id === feed.id
        ? {
            ...item,
            endpoints: item.endpoints.filter((endpoint) => endpoint.id !== endpointId),
          }
        : item
    );
    const { [endpointId]: removed, ...remaining } = endpointTests;
    endpointTests = remaining;
  }

  function addFeed() {
    feeds = [
      ...feeds,
      {
        id: createId(),
        name: `FEED_${feeds.length + 1}`,
        base: "",
        quote: "",
        observation: "",
        algorithm: "median",
        minSources: 1,
        clusterSize: 1,
        rounding: "half_up",
        endpoints: [],
      },
    ];
  }

  function removeFeed(id: string) {
    feeds = feeds.filter((feed) => feed.id !== id);
  }

  function addSlot() {
    const firstFeed = feeds[0]?.name || "";
    slots = [
      ...slots,
      {
        id: createId(),
        index: slots.length,
        label: "",
        baseFeed: firstFeed,
        quoteFeed: "",
        formula: "",
        decimals: 4,
        estimatedMax: "",
        finalRounding: "half_up",
        missingData: "Do not submit this slot if required feeds are unavailable.",
      },
    ];
  }

  function removeSlot(id: string) {
    slots = normalizeSlotIndexes(slots.filter((slot) => slot.id !== id));
    synths = synths.filter((synth) => synth.slotId !== id);
  }

  function durationToSeconds(value: number, unit: DurationUnit) {
    return Math.max(0, Number(value || 0)) * unitSeconds[unit];
  }

  function durationText(value: number, unit: DurationUnit) {
    const amount = Math.max(0, Number(value || 0));
    const label = amount === 1 ? unit.replace(/s$/, "") : unit;
    return `${amount} ${label}`;
  }

  function parseInitializedTimestamp() {
    const timestamp = Date.parse(initialized);
    if (!Number.isFinite(timestamp)) return 0;
    return Math.floor(timestamp / 1000);
  }

  function dropsArray() {
    return drops
      .split(",")
      .map((drop) => Number(drop.trim()))
      .filter((drop) => Number.isInteger(drop) && drop >= 0 && drop <= 255);
  }

  function fullSpecHash() {
    return keccak256(defaultAbiCoder.encode(["string"], [generatedDescription]));
  }

  function specDTag(specHash = fullSpecHash()) {
    return `oracle:${Number($chainId || 63)}:${$sdk?.ORACLE_FACTORY?.address || "factory"}:methodology:initial:${specHash}`;
  }

  function onChainOracleDescription(pubkey: string, d: string, specHash = fullSpecHash()) {
    return `Oracle: ${oracleName}
Spec hash: ${specHash}
Spec kind: ${specEventKind}
Spec author: ${pubkey}
Spec d: ${d}`;
  }

  function oracleKey(args: ReturnType<typeof oracleCreateArgs>) {
    return keccak256(
      defaultAbiCoder.encode(
        ["uint8[8]", "uint8[]", "uint8", "uint64", "uint24", "uint24", "uint24", "uint256", "string"],
        [
          args.decimals,
          args.drops,
          args.modulo,
          args.initialized,
          args.frequency,
          args.roundDuration,
          args.delay,
          args.minStake,
          args.description,
        ]
      )
    );
  }

  function predictCloneAddress(implementation: string, salt: string, deployer: string) {
    const initCode = solidityPack(
      ["bytes10", "bytes20", "bytes15"],
      ["0x3d602d80600a3d3981f3", implementation, "0x5af43d82803e903d91602b57fd5bf3"]
    );
    return getCreate2Address(deployer, salt, keccak256(initCode));
  }

  function oracleCreateArgs(description = specPublication ? onChainOracleDescription(specPublication.pubkey, specPublication.d, specPublication.specHash) : "") {
    return {
      decimals: decimalsArray(),
      drops: dropsArray(),
      modulo: Number(modulo || 0),
      initialized: parseInitializedTimestamp(),
      frequency,
      roundDuration,
      delay,
      minStake: parseEther(minStake || "0"),
      description,
    };
  }

  function oracleConfigHash() {
    const args = oracleCreateArgs();
    return keccak256(
      defaultAbiCoder.encode(
        ["uint8[8]", "uint8[]", "uint8", "uint64", "uint24", "uint24", "uint24", "uint256", "string"],
        [
          args.decimals,
          args.drops,
          args.modulo,
          args.initialized,
          args.frequency,
          args.roundDuration,
          args.delay,
          args.minStake,
          args.description,
        ]
      )
    );
  }

  function currentSpecPublicationValid() {
    return Boolean(
      specPublication &&
        specPublication.specHash === fullSpecHash() &&
        specPublication.d === specDTag(specPublication.specHash) &&
        (specPublication.chainId === undefined || specPublication.chainId === Number($chainId || 63)) &&
        (specPublication.factory === undefined ||
          specPublication.factory.toLowerCase() === $sdk?.ORACLE_FACTORY?.address?.toLowerCase())
    );
  }

  function eventHasDTag(event: NostrMethodologyEvent, d: string) {
    return event.tags.some((tag) => tag[0] === "d" && tag[1] === d);
  }

  function eventContentSpecHash(event: NostrMethodologyEvent) {
    try {
      const content = JSON.parse(event.content) as { methodology?: { hash?: string }; spec?: unknown };
      return content.methodology?.hash;
    } catch {
      return undefined;
    }
  }

  function decodeSpecNaddr(naddr: string) {
    const decoded = nip19.decode(naddr);
    if (decoded.type !== "naddr") throw new Error("Methodology pointer is not an naddr.");

    const data = decoded.data;
    return {
      pubkey: data.pubkey,
      d: data.identifier,
      kind: data.kind,
      relays: data.relays?.length ? data.relays : nostrRelays,
    };
  }

  async function fetchPublishedSpec(naddr: string, specHash: string, expectedEventId?: string) {
    const pointer = decodeSpecNaddr(naddr);
    const filters = { kinds: [pointer.kind], authors: [pointer.pubkey], "#d": [pointer.d] };
    const relayFetches = pointer.relays.map(async (relay) => {
      const pool = new SimplePool();
      try {
        const event = (await pool.get([relay], filters, { maxWait: 4000 })) as NostrMethodologyEvent | null;
        if (!event) throw new Error(`No methodology event returned from ${relay}.`);
        if (event.kind !== specEventKind || event.pubkey !== pointer.pubkey || !eventHasDTag(event, pointer.d)) {
          throw new Error(`Methodology coordinate mismatch from ${relay}.`);
        }
        if (expectedEventId && event.id !== expectedEventId) throw new Error(`Methodology event id mismatch from ${relay}.`);
        if (eventContentSpecHash(event) !== specHash) {
          throw new Error(`Methodology hash mismatch from ${relay}.`);
        }
        return { event, relay };
      } finally {
        pool.close([relay]);
      }
    });

    return Promise.any(relayFetches);
  }

  async function verifySpecPublication() {
    specVerifyError = "";

    if (!specPublication) {
      specVerifyError = "No methodology naddr has been published for this draft.";
      return;
    }

    specVerifying = true;
    try {
      const fetched = await fetchPublishedSpec(specPublication.naddr, specPublication.specHash, specPublication.eventId);
      specPublication = {
        ...specPublication,
        verifiedAt: new Date().toISOString(),
        verifiedRelay: fetched.relay,
      };
      saveDraft();
      draftStatus = "Spec fetched from Nostr";
    } catch (error) {
      specVerifyError = error instanceof Error ? error.message : "Nostr event fetch failed.";
    } finally {
      specVerifying = false;
    }
  }

  function specPublicationProblem() {
    if (!specPublication) return "No methodology event has been published for this draft.";
    if (specPublication.specHash !== fullSpecHash()) return "The form methodology changed after the Nostr event was published.";
    if (specPublication.d !== specDTag(specPublication.specHash)) return "The Nostr event coordinate does not match the current factory/configuration.";
    if (specPublication.chainId !== undefined && specPublication.chainId !== Number($chainId || 63)) return "The Nostr event was published for a different chain.";
    if (
      specPublication.factory !== undefined &&
      specPublication.factory.toLowerCase() !== $sdk?.ORACLE_FACTORY?.address?.toLowerCase()
    ) {
      return "The Nostr event was published for a different OracleFactory.";
    }
    return "";
  }

  function oracleDeploymentProblem() {
    if (!$sdk?.ORACLE_FACTORY) return "OracleFactory is not available on this network.";
    if (!$signer && !walletProviderAvailable) return $signerAddress ? "Reconnect your wallet signer before deploying." : "Connect a wallet before deploying.";
    if (!$signer && walletProviderAvailable) return "Wallet provider found. Click Deploy Oracle to load the signer and continue.";
    if (Number($chainId || 0) !== 63) return "Switch your wallet to Mordor before deploying.";
    if (!currentSpecPublicationValid()) return specPublicationProblem() || "Publish the current methodology spec to Nostr before deploying.";
    if (!parseInitializedTimestamp()) return "Enter a valid UTC round 0 start time before deploying.";
    return "";
  }

  function canDeployOracle() {
    const problem = oracleDeploymentProblem();
    return !problem || problem.startsWith("Wallet provider found.");
  }

  async function hydrateWalletFromModal() {
    const walletProvider = modal.getWalletProvider() || (typeof window !== "undefined" ? window.ethereum : undefined);
    walletProviderAvailable = Boolean(walletProvider);
    if (!walletProvider) return;

    try {
      await defaultEvmStores.setProvider(walletProvider);
    } catch (error) {
      console.warn("Failed to hydrate wallet provider", error);
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

  function currentOracleDeploymentValid() {
    try {
      return Boolean(
        oracleDeployment &&
          currentSpecPublicationValid() &&
          oracleDeployment.configHash === oracleConfigHash() &&
          oracleDeployment.chainId === Number($chainId || 63) &&
          oracleDeployment.factory.toLowerCase() === $sdk?.ORACLE_FACTORY?.address?.toLowerCase()
      );
    } catch {
      return false;
    }
  }

  async function refreshOracleStakeStatus() {
    oracleStakeStatusError = "";

    if (!oracleDeployment?.address || !$sdk?.ORACLE || !$signerAddress) {
      oracleStakeStatus = undefined;
      return;
    }

    oracleStakeStatusLoading = true;
    try {
      const oracle = $sdk.ORACLE.attach(oracleDeployment.address);
      const [stake, mana, nostrPubkey] = await Promise.all([
        oracle.stakes($signerAddress),
        oracle.mana($signerAddress),
        oracle.nostrPubkeys($signerAddress),
      ]);
      const normalizedNostrPubkey = String(nostrPubkey || "").toLowerCase();
      const specPubkey = specPublication?.pubkey ? `0x${specPublication.pubkey}`.toLowerCase() : "";

      oracleStakeStatus = {
        stakeEtc: formatEther(stake),
        manaEtc: formatEther(mana),
        nostrPubkey: normalizedNostrPubkey,
        isStaked: stake.gte(parseEther(minStake || "0")),
        linkedToSpec: Boolean(specPubkey && normalizedNostrPubkey === specPubkey),
      };
    } catch (error) {
      oracleStakeStatus = undefined;
      oracleStakeStatusError = error instanceof Error ? error.message : "Could not load stake status.";
    } finally {
      oracleStakeStatusLoading = false;
    }
  }

  function marketKey(slotId: string, long: boolean, leverage: SynthPlan["leverage"]) {
    return `${slotId}:${long ? "long" : "inverse"}:${leverage}`;
  }

  function marketName(slot: Slot | undefined, long: boolean, leverage: SynthPlan["leverage"]) {
    const baseName = slot?.label.split("/")[0] || "ASSET";
    const exponent = leverage === "SQUARED" ? "²" : leverage === "CUBED" ? "³" : "";
    return `${long ? "Stip" : "Flip"} ${baseName}${exponent}`;
  }

  function marketTokenName(slot: Slot) {
    return slot.label.split("/")[0] || "ASSET";
  }

  function leverageValue(leverage: SynthPlan["leverage"]) {
    return leverageOptions.indexOf(leverage);
  }

  function synthDeploymentKey(synth: SynthPlan) {
    const slot = findSlot(synth.slotId);
    if (!oracleDeployment?.address || !slot) return "";

    return keccak256(solidityPack(["address", "uint8", "bool", "uint8"], [oracleDeployment.address, slot.index, synth.long, leverageValue(synth.leverage)]));
  }

  function selectedUndeployedSynths() {
    return selectedSynths.filter((synth) => !synth.deployedAddress);
  }

  function marketDeploymentProblem() {
    if (!currentOracleDeploymentValid()) return "Deploy the current oracle configuration before creating markets.";
    if (!$sdk?.SYNTH_FACTORY) return "SynthFactory is not available on this network.";
    if (!$signer && !walletProviderAvailable) return $signerAddress ? "Reconnect your wallet signer before deploying markets." : "Connect a wallet before deploying markets.";
    if (!$signer && walletProviderAvailable) return "Wallet provider found. Click Deploy Selected Markets to load the signer and continue.";
    if (Number($chainId || 0) !== 63) return "Switch your wallet to Mordor before deploying markets.";
    if (selectedSynths.length === 0) return "Select at least one market to deploy.";
    if (selectedUndeployedSynths().length === 0) return "All selected markets are already deployed.";
    return "";
  }

  function canDeployMarkets() {
    const problem = marketDeploymentProblem();
    return !problem || problem.startsWith("Wallet provider found.") || problem === "All selected markets are already deployed.";
  }

  async function assertSynthOraclePrice(slot: Slot, synth: SynthPlan) {
    if (!oracleDeployment?.address || !$sdk?.ORACLE) return;

    const oracle = $sdk.ORACLE.attach(oracleDeployment.address);
    const price = await oracle.lastPrice(slot.index, synth.long, leverageValue(synth.leverage));
    if (price.eq(0)) {
      throw new Error(
        `${marketName(slot, synth.long, synth.leverage)} cannot be deployed yet. The Oracle returns 0 for slot ${slot.index}, so submit at least one valid price round before creating markets.`
      );
    }
  }

  function syncMarketProposals() {
    const existing = new Map(
      synths.map((synth) => [marketKey(synth.slotId, synth.long, synth.leverage), synth])
    );
    synths = slots.flatMap((slot) =>
      [true, false].flatMap((long) =>
        leverageOptions.map((leverage) => {
          const key = marketKey(slot.id, long, leverage);
          const existingSynth = existing.get(key);
          return (
            existingSynth || {
              id: createId(),
              slotId: slot.id,
              selected: leverage === "NONE",
              long,
              leverage,
              name: marketTokenName(slot),
              description: `${marketName(slot, long, leverage)} market using ${slot.label || `slot ${slots.indexOf(slot)}`}`,
              initialLiquidity: "0",
            }
          );
        })
      )
    );
  }

  function goToOperate() {
    if (!currentOracleDeploymentValid()) {
      oracleDeployError = "Deploy this oracle configuration before operating it.";
      return;
    }

    step = "operate";
  }

  async function deployOracle() {
    oracleDeployError = "";

    if (!$sdk?.ORACLE_FACTORY) {
      oracleDeployError = "OracleFactory is not available on this network.";
      return;
    }

    if (!(await ensureWalletSigner())) {
      oracleDeployError = $signerAddress ? "Reconnect your wallet signer before deploying." : "Connect a wallet before deploying.";
      return;
    }

    if (Number($chainId || 0) !== 63) {
      oracleDeployError = "OracleFactory is currently configured for Mordor only.";
      return;
    }

    if (!currentSpecPublicationValid()) {
      oracleDeployError = specPublicationProblem() || "Publish the current methodology spec to Nostr before deploying.";
      return;
    }

    const args = oracleCreateArgs();
    if (!args.initialized) {
      oracleDeployError = "Enter a valid UTC round 0 start time before deploying.";
      return;
    }

    oracleDeploying = true;
    try {
      const configHash = oracleConfigHash();
      const factory = $sdk.ORACLE_FACTORY.connect($signer);
      const tx = await broadcastTransaction(
        "Creating oracle",
        factory.createOracle(
          args.decimals,
          args.drops,
          args.modulo,
          args.initialized,
          args.frequency,
          args.roundDuration,
          args.delay,
          args.minStake,
          args.description
        )
      );
      const receipt = await tx.wait();
      const event = receipt.events?.find((item) => item.address.toLowerCase() === factory.address.toLowerCase() && item.event === "OracleCreated");
      const address = event?.args?.oracle as string | undefined;

      if (!address) {
        throw new Error("OracleCreated event was not found in the transaction receipt.");
      }

      oracleDeployment = {
        configHash,
        chainId: Number($chainId || 63),
        factory: factory.address,
        address,
        txHash: tx.hash,
        deployedAt: new Date().toISOString(),
      };
      saveDraft();
      draftStatus = "Oracle deployed";
      step = "operate";
    } catch (error) {
      oracleDeployError = error instanceof Error ? error.message : "Oracle deployment failed.";
    } finally {
      oracleDeploying = false;
    }
  }

  async function deployMarkets() {
    marketDeployError = "";

    if (!currentOracleDeploymentValid()) {
      marketDeployError = "Deploy the current oracle configuration before creating markets.";
      return;
    }

    if (!$sdk?.SYNTH_FACTORY) {
      marketDeployError = "SynthFactory is not available on this network.";
      return;
    }

    if (!(await ensureWalletSigner())) {
      marketDeployError = $signerAddress ? "Reconnect your wallet signer before deploying markets." : "Connect a wallet before deploying markets.";
      return;
    }

    if (Number($chainId || 0) !== 63) {
      marketDeployError = "SynthFactory is currently configured for Mordor only.";
      return;
    }

    const pendingSynths = selectedUndeployedSynths();
    if (pendingSynths.length === 0) {
      marketDeployError = selectedSynths.length === 0 ? "Select at least one market to deploy." : "All selected markets are already deployed.";
      return;
    }

    marketDeploying = true;
    try {
      const factory = $sdk.SYNTH_FACTORY.connect($signer);
      for (const synth of pendingSynths) {
        const slot = findSlot(synth.slotId);
        if (!slot || !oracleDeployment?.address) throw new Error(`Missing slot or oracle address for ${synth.name}.`);

        const key = synthDeploymentKey(synth);
        const existingAddress = await $sdk.SYNTH_FACTORY.synths(key);
        if (existingAddress !== "0x0000000000000000000000000000000000000000") {
          synth.deployedAddress = existingAddress;
          synth.deployedAt = new Date().toISOString();
          continue;
        }

        const leverage = leverageValue(synth.leverage);
        await assertSynthOraclePrice(slot, synth);
        const predictedAddress = await factory.callStatic.createSynth(
          oracleDeployment.address,
          slot.index,
          synth.name,
          synth.description,
          synth.long,
          leverage
        );
        const tx = await broadcastTransaction(
          `Creating ${marketName(slot, synth.long, synth.leverage)}`,
          factory.createSynth(oracleDeployment.address, slot.index, synth.name, synth.description, synth.long, leverage)
        );
        await tx.wait();

        synth.deployedAddress = predictedAddress;
        synth.deployTxHash = tx.hash;
        synth.deployedAt = new Date().toISOString();
        synths = [...synths];
        saveDraft();
      }

      draftStatus = "Markets deployed";
      saveDraft();
    } catch (error) {
      marketDeployError = error instanceof Error ? error.message : "Market deployment failed.";
    } finally {
      marketDeploying = false;
    }
  }

  function oracleOperatorConfig() {
    return {
      oracleName,
      chainId: Number($chainId || 63),
      oracle: oracleDeployment?.address,
      oracleFactory: $sdk?.ORACLE_FACTORY?.address,
      spec: specPublication
        ? {
            kind: specPublication.kind,
            pubkey: specPublication.pubkey,
            d: specPublication.d,
            eventId: specPublication.eventId,
            naddr: specPublication.naddr,
            relays: specPublication.relays,
            specHash: specPublication.specHash,
          }
        : undefined,
      timings: {
        initialized,
        frequencySeconds: frequency,
        roundDurationSeconds: roundDuration,
        delaySeconds: delay,
      },
      operatorRequirements: {
        evmNetwork: "ETC Mordor",
        evmPrivateKeyEnv: "ORACLE_EVM_PRIVATE_KEY",
        nostrPrivateKeyEnv: "ORACLE_NOSTR_PRIVATE_KEY",
        minimumStakeEtc: minStake,
        requiresFundedEvmAddress: true,
        requiresStakedEvmAddress: true,
        notes:
          "The EVM operator address must have enough ETC for gas and must be staked on the Oracle contract before setPrices submissions are expected to succeed.",
      },
      minStakeEtc: minStake,
      slots: slots.map((slot) => ({
        index: slot.index,
        label: slot.label,
        formula: slot.formula,
        decimals: slot.decimals,
        missingData: slot.missingData,
      })),
      feeds: feeds.map((feed) => ({
        name: feed.name,
        base: feed.base,
        quote: feed.quote,
        observation: feed.observation,
        algorithm: feed.algorithm,
        minSources: feed.minSources,
        clusterSize: feed.clusterSize,
        rounding: feed.rounding,
        endpoints: feed.endpoints,
      })),
    };
  }

  function oracleAgentPrompt() {
    const config = JSON.stringify(oracleOperatorConfig(), null, 2);
    return `Build a production Go daemon that operates this Stip & Flip oracle.

Goal:
- Fetch the oracle methodology from Nostr.
- Publish a Nostr pre-submission intent for every round.
- Compute all feed and slot prices exactly from the methodology.
- Submit packed slot prices to the Oracle contract with setPrices(prices, round).
- Run continuously as a daemon with structured logs, retries, health checks, and durable state.

Hard requirements:
- Implement in Go.
- Use ETC Mordor/Ethereum JSON-RPC through configuration, not hardcoded secrets.
- Load the operator EVM private key and Nostr key from environment variables or a local secret store.
- The EVM operator address derived from ORACLE_EVM_PRIVATE_KEY must have ETC for gas on the configured chain.
- The EVM operator address must be staked on the Oracle contract with at least the configured minimum stake before submitting prices.
- The Nostr key should be linked to the staked EVM address through Oracle.deposit(bytes32) or Oracle.setNostrPubkey(bytes32) when available.
- Never submit a slot value if its required feeds cannot be computed deterministically.
- Never invent fallback endpoints. Follow the Nostr methodology event and local config.
- Fetch each configured endpoint at most once per computation cycle.
- Apply per-provider/host rate limiting; do not burst multiple requests to the same API host.
- Treat HTTP 429 as an excluded source for that cycle unless Retry-After allows a safe bounded retry inside the submission window.
- Do not aggressively retry rate-limited endpoints; use bounded backoff and preserve deterministic behavior.
- Continue only if each required feed still has at least minSources valid sources after exclusions.
- Do not use parallel endpoint fan-out unless provider-specific rate limits are enforced.
- Publish a kind ${intentEventKind} Nostr intent before every setPrices transaction.
- Fetch methodology from the naddr in config. Some relays may not return addressable events through plain author/#d filters.
- Verify the fetched methodology event id, author, kind, d tag, and specHash before computing prices.
- Verify the fetched methodology hash against specHash before computing prices.
- Query these relays first: ${nostrRelays.join(", ")}.
- Include relay.nuts.cash in all publication relay lists.
- Publish intents to every configured publication relay, but do not let one unreachable relay block submission.
- Treat Nostr intent publication as successful when at least one configured relay accepts the event; fail only if all publication relays fail.

Nostr event rules:
- Methodology proposal kind: ${specEventKind}.
- Pre-submission intent kind: ${intentEventKind}.
- Intent tags should include:
  ["oracle", oracleAddress]
  ["chain", chainId]
  ["round", round]
  ["methodology", "initial", specHash]
  ["prices_hash", keccak256(encoded prices)]
- Intent content should include explicit computed feed values, endpoint status, packed slot values, excluded sources, and the final prices integer.
- Intent content should include HTTP status/errors for excluded or rate-limited sources.

On-chain rules:
- Before submitting, read Oracle.getCurrentRound().
- Only submit for the current allowed round.
- Pack each slot value according to the Oracle slot packing contract.
- Call Oracle.setPrices(uint256 prices, uint64 round).
- Confirm transaction inclusion and persist submitted round hashes locally.

Dry-run rules:
- Provide a dry-run mode that computes feeds, slots, packed prices, and prices_hash without publishing to Nostr or sending an EVM transaction.
- Allow overriding the displayed round for dry runs outside the submission window.
- Before running as a daemon or attempting a live round submission, run dry-run and inspect whether every required feed has enough valid sources, slot values pack correctly, methodology verification passes, and the final prices_hash is produced.
- Treat dry-run failure as a blocker for live submission.

Deliverables:
- A Go module with a daemon command.
- A config file schema matching the JSON below.
- Unit tests for endpoint parsing, reconciliation, slot calculation, and packing.
- Integration hooks that can run against Mordor RPC.
- A README explaining environment variables, Nostr setup, and daemon operation.

Oracle operator config:
\`\`\`json
${config}
\`\`\`
`;
  }

  function downloadOracleAgentBundle() {
    const bundle = {
      version: 1,
      createdAt: new Date().toISOString(),
      recommendedLanguage: "go",
      usage: "Give this bundle to your agent to build or run an oracle operator.",
      prompt: oracleAgentPrompt(),
      config: oracleOperatorConfig(),
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `stip-flip-oracle-agent-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function copyOracleAgentPrompt() {
    await navigator.clipboard.writeText(oracleAgentPrompt());
    draftStatus = "Oracle agent prompt copied";
  }

  async function stakeOracle() {
    oracleStakeError = "";

    if (!currentOracleDeploymentValid() || !oracleDeployment?.address) {
      oracleStakeError = "Deploy the current oracle configuration before staking.";
      return;
    }

    if (!(await ensureWalletSigner())) {
      oracleStakeError = $signerAddress ? "Reconnect your wallet signer before staking." : "Connect a wallet before staking.";
      return;
    }

    if (Number($chainId || 0) !== 63) {
      oracleStakeError = "Oracle staking is currently configured for Mordor only.";
      return;
    }

    oracleStaking = true;
    try {
      const oracle = $sdk.ORACLE.attach(oracleDeployment.address).connect($signer);
      const value = parseEther(oracleStakeAmount || "0");
      const nostrPubkey = specPublication?.pubkey && specPublication.pubkey.length === 64 ? `0x${specPublication.pubkey}` : "";
      const tx = nostrPubkey
        ? await broadcastTransaction("Staking oracle", oracle["deposit(bytes32)"](nostrPubkey, { value }))
        : await broadcastTransaction("Staking oracle", oracle["deposit()"]({ value }));
      const receipt = await tx.wait();
      resolveTransaction(tx.hash, receipt.status || 0);
      await refreshOracleStakeStatus();
      draftStatus = "Oracle staked";
    } catch (error) {
      oracleStakeError = error instanceof Error ? error.message : "Oracle staking failed.";
    } finally {
      oracleStaking = false;
    }
  }

  async function publishSpecToNostr() {
    specPublishError = "";
    oracleDeployError = "";

    const nostr = (window as unknown as { nostr?: { getPublicKey: () => Promise<string>; signEvent: (event: unknown) => Promise<{ id: string; pubkey: string }> } }).nostr;
    if (!nostr) {
      specPublishError = "Install or enable a NIP-07 Nostr extension before publishing.";
      return;
    }

    if (!$sdk?.ORACLE_FACTORY) {
      specPublishError = "OracleFactory is not available on this network.";
      return;
    }

    if (Number($chainId || 0) !== 63) {
      specPublishError = "OracleFactory is currently configured for Mordor only.";
      return;
    }

    specPublishing = true;
    try {
      const pubkey = await nostr.getPublicKey();
      const specHash = fullSpecHash();
      const d = specDTag(specHash);
      const description = onChainOracleDescription(pubkey, d, specHash);
      const args = oracleCreateArgs(description);
      const salt = oracleKey(args);
      const implementation = await $sdk.ORACLE_FACTORY.oracleImplementation();
      const predictedOracle = predictCloneAddress(implementation, salt, $sdk.ORACLE_FACTORY.address);
      const content = JSON.stringify(
        {
          oracle: predictedOracle,
          chainId: Number($chainId || 63),
          action: "initial_methodology",
          effectiveRound: 0,
          methodology: {
            id: `${oracleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "oracle"}-v1`,
            hash: specHash,
          },
          spec: createDraft(),
        },
        null,
        2
      );
      const unsigned = {
        kind: specEventKind,
        pubkey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ["d", d],
          ["oracle", predictedOracle],
          ["oracle_factory", $sdk.ORACLE_FACTORY.address],
          ["chain", String(Number($chainId || 63))],
          ["effective_round", "0"],
          ["action", "initial_methodology"],
          ["methodology", "initial", specHash],
        ],
        content,
      };
      const signed = await nostr.signEvent(unsigned);
      const naddr = nip19.naddrEncode({ identifier: d, pubkey, kind: specEventKind, relays: nostrRelays });
      const pool = new SimplePool();
      await Promise.any(pool.publish(nostrRelays, signed as never));
      pool.close(nostrRelays);
      const fetched = await fetchPublishedSpec(naddr, specHash, signed.id);

      specPublication = {
        kind: specEventKind,
        chainId: Number($chainId || 63),
        factory: $sdk.ORACLE_FACTORY.address,
        pubkey,
        d,
        relays: nostrRelays,
        specHash,
        eventId: signed.id,
        naddr,
        predictedOracle,
        publishedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        verifiedRelay: fetched.relay,
      };
      saveDraft();
      draftStatus = "Spec published and fetched from Nostr";
    } catch (error) {
      specPublishError = error instanceof Error ? error.message : "Nostr publication failed.";
    } finally {
      specPublishing = false;
    }
  }

  function decimalsArray() {
    const values = Array(8).fill(0);
    slots.slice(0, 8).forEach((slot, index) => {
      values[index] = Number(slot.decimals || 0);
    });
    return values;
  }

  function normalizeSlotIndexes(items: Slot[]) {
    return items.map((slot, index) => ({ ...slot, index }));
  }

  function formatDecimal(value: number) {
    return Number.isFinite(value)
      ? value.toLocaleString(undefined, { maximumFractionDigits: 12 })
      : "not available";
  }

  function maxRepresentableValue(decimals: number) {
    return int32Max / 10 ** Math.max(0, Number(decimals || 0));
  }

  function suggestedDecimals(estimatedMax: string) {
    const maxValue = Number(estimatedMax);
    if (!Number.isFinite(maxValue) || maxValue <= 0) return undefined;

    return Math.max(0, Math.floor(Math.log10(int32Max / maxValue)));
  }

  function applySuggestedDecimals(slot: Slot) {
    const suggestion = suggestedDecimals(slot.estimatedMax || "");
    if (suggestion === undefined) return;
    slot.decimals = Math.min(18, suggestion);
  }

  function findSlot(slotId: string) {
    return slots.find((slot) => slot.id === slotId);
  }

  function formatDrops() {
    return drops
      .split(",")
      .map((drop) => drop.trim())
      .filter(Boolean)
      .join(", ");
  }

  function pluralize(count: number, singular: string, plural = `${singular}s`) {
    return `${count} ${count === 1 ? singular : plural}`;
  }

  function feedSummary(feed: Feed) {
    const feedName = feed.name || "Unnamed feed";
    const pair = feed.base && feed.quote ? `${feed.base}/${feed.quote}` : feed.base || feed.quote || "unlabeled pair";
    const observation = feed.observation || "observation rule not specified";
    const sourceCount = pluralize(feed.endpoints.length, "source");
    const requiredSources = pluralize(Number(feed.minSources || 0), "valid source");
    const algorithm = feed.algorithm || "algorithm not selected";

    return `${feedName} (${pair}) = ${observation} from ${sourceCount}; require ${requiredSources}; reconcile by ${algorithm}.`;
  }

  function feedSpec(feed: Feed) {
    const endpoints = feed.endpoints
      .map(
        (endpoint, index) =>
          `    ${index + 1}. ${endpoint.provider || "Provider"}: ${endpoint.url || "URL required"}; timing/validity: ${
            endpoint.maxAge || "not specified"
          }; extraction notes: ${endpoint.notes || "none"}`
      )
      .join("\n");

    return `Feed ${feed.name}: ${feed.base}/${feed.quote}
  Observation: ${feed.observation || "not specified"}
  Algorithm: ${feed.algorithm}; minimum valid sources: ${feed.minSources}; cluster size: ${feed.clusterSize}; rounding: ${feed.rounding}
  Endpoints:
${endpoints || "    No endpoints defined."}`;
  }

  function slotSpec(slot: Slot, index: number) {
    return `Slot ${index} ${slot.label}
  Output formula: ${slot.formula || `${slot.baseFeed}${slot.quoteFeed ? ` / ${slot.quoteFeed}` : ""}`}
  Base feed: ${slot.baseFeed || "not specified"}
  Quote feed: ${slot.quoteFeed || "not used"}
  Submitted decimals: ${slot.decimals}
  Estimated maximum value: ${slot.estimatedMax || "not specified"}
  Final rounding: ${slot.finalRounding}
  Missing data rule: ${slot.missingData}`;
  }

  $: generatedDescription = `Oracle: ${oracleName}

Deterministic data feeds:
${feeds.map(feedSpec).join("\n\n")}

Oracle slots:
${slots.map(slotSpec).join("\n\n")}

Submission rule:
  For every allowed round, participants must compute each feed from the exact endpoints and extraction notes above, apply the declared reconciliation algorithm, compute each slot formula, round to the declared submitted decimals, and submit the resulting packed integer. If a slot's missing data rule is triggered, participants must not invent a fallback.`;

  $: selectedSynths = synths.filter((synth) => synth.selected);
  $: frequency = durationToSeconds(frequencyValue, frequencyUnit);
  $: roundDuration = durationToSeconds(roundDurationValue, roundDurationUnit);
  $: delay = durationToSeconds(delayValue, delayUnit);
  $: {
    step;
    oracleName;
    initialized;
    frequencyValue;
    frequencyUnit;
    roundDurationValue;
    roundDurationUnit;
    delayValue;
    delayUnit;
    minStake;
    modulo;
    drops;
    feeds;
    slots;
    synths;
    scheduleSaveDraft();
  }
  $: {
    const nextStakeStatusKey = `${oracleDeployment?.address || ""}:${$signerAddress || ""}:${specPublication?.pubkey || ""}:${minStake}`;
    if (nextStakeStatusKey !== oracleStakeStatusKey) {
      oracleStakeStatusKey = nextStakeStatusKey;
      refreshOracleStakeStatus();
    }
  }
</script>

<svelte:head>
  <title>Create Oracle | Stip & Flip</title>
</svelte:head>

<header
  class="app-page-header fixed w-full px-8 pt-20 lg:relative lg:m-auto lg:mt-40 lg:max-w-7xl lg:px-0 lg:pt-0"
  id="top"
>
  <div class="py-4">
    <div>
      <a class="app-muted mb-3 inline-flex items-center gap-2 text-sm font-semibold hover:text-primary" href="/oracles">
        <Icon icon="mdi:arrow-left" />
        Oracles
      </a>
      <div class="app-label">Oracle creation</div>
      <div class="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 class="text-3xl font-bold lg:text-5xl">Create and operate an Oracle</h1>
          <p class="app-muted mt-2 max-w-3xl">
            Define the oracle as an exact data pipeline, map derived values to slots, publish the methodology, then
            stake and operate the deployed oracle.
          </p>
        </div>
        <div class="flex flex-col gap-2 text-sm lg:items-end">
          {#if draftStatus}
            <div class="app-muted">{draftStatus}</div>
          {/if}
          <div class="flex flex-wrap gap-2 lg:justify-end">
            <button class="btn btn-outline btn-sm rounded-full" type="button" on:click={exportDraft}>
              <Icon icon="mdi:download-outline" />
              Export
            </button>
            <button class="btn btn-outline btn-sm rounded-full" type="button" on:click={copyDraft}>
              <Icon icon="mdi:content-copy" />
              Copy
            </button>
            <button class="btn btn-outline btn-sm rounded-full" type="button" on:click={() => importDraftInput.click()}>
              <Icon icon="mdi:upload-outline" />
              Import
            </button>
            <input
              class="hidden"
              type="file"
              accept=".json,application/json"
              bind:this={importDraftInput}
              on:change={importDraftFile}
            />
            <button class="btn btn-ghost btn-sm rounded-full" type="button" on:click={clearDraft}>
              <Icon icon="mdi:delete-outline" />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>

<div class="lg:h-auto lg:pt-0 container-height" id="container">
  <div class="mx-auto max-w-7xl space-y-6 px-4 lg:px-0">
    {#if step === "oracle"}
    <section class="app-panel rounded-lg p-5">
      <div class="mb-5 flex justify-center">
        <div class="app-nav grid w-full max-w-3xl gap-1 rounded-full p-1 md:inline-grid md:w-auto md:grid-cols-3">
          {#each createSteps as createStep (createStep.id)}
            <button
              class={`btn rounded-full ${step === createStep.id ? "btn-primary" : "btn-ghost"}`}
              type="button"
              on:click={() => selectStep(createStep.id)}
            >
              {createStep.label}
            </button>
          {/each}
        </div>
      </div>

      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="app-label">Oracle contract fields</div>
          <h2 class="mt-1 text-xl font-bold">Schedule and settlement rules</h2>
        </div>
      </div>

      <div class="mt-5 space-y-3">
        <div class="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <label class="block font-semibold" for="oracle-name">Oracle name</label>
          <span class="app-muted mt-1 block text-sm">Human-readable title used at the top of the generated oracle instructions.</span>
          <input id="oracle-name" class="input input-bordered mt-3 w-full" bind:value={oracleName} />
        </div>
        <div class="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <label class="block font-semibold" for="oracle-initialized-date">Round 0 start time</label>
          <span class="app-muted mt-1 block text-sm">Timestamp anchoring the whole calendar. Use UTC, for example midnight for daily rounds.</span>
          <div class="mt-3 grid gap-2 md:grid-cols-[1fr_12rem]">
            <input
              id="oracle-initialized-date"
              class="input input-bordered w-full"
              type="date"
              value={initializedParts.date}
              on:input={(event) => setInitializedPart("date", event.currentTarget.value)}
            />
            <input
              id="oracle-initialized-time"
              class="input input-bordered w-full"
              type="time"
              step="60"
              value={initializedParts.time}
              on:input={(event) => setInitializedPart("time", event.currentTarget.value)}
            />
          </div>
          <div class="app-muted mt-2 text-xs">UTC timestamp: <span class="font-mono">{initialized || "not set"}</span></div>
        </div>
        <div class="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <label class="block font-semibold" for="oracle-frequency">Round interval</label>
          <span class="app-muted mt-1 block text-sm">
            Time between round starts. {durationText(frequencyValue, frequencyUnit)} equals {frequency} seconds in OracleFactory.
          </span>
          <span class="mt-3 grid grid-cols-[1fr_8rem] gap-2">
            <input id="oracle-frequency" class="input input-bordered" type="number" min="1" bind:value={frequencyValue} />
            <select class="select select-bordered" aria-label="Round interval unit" bind:value={frequencyUnit}>
              {#each durationUnits as unit (unit)}
                <option value={unit}>{unit}</option>
              {/each}
            </select>
          </span>
        </div>
        <div class="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <label class="block font-semibold" for="oracle-round-duration">Submission window</label>
          <span class="app-muted mt-1 block text-sm">
            Time after a round opens when oracle participants can submit prices. {durationText(roundDurationValue, roundDurationUnit)} equals {roundDuration} seconds in OracleFactory.
          </span>
          <span class="mt-3 grid grid-cols-[1fr_8rem] gap-2">
            <input id="oracle-round-duration" class="input input-bordered" type="number" min="1" bind:value={roundDurationValue} />
            <select class="select select-bordered" aria-label="Submission window unit" bind:value={roundDurationUnit}>
              {#each durationUnits as unit (unit)}
                <option value={unit}>{unit}</option>
              {/each}
            </select>
          </span>
        </div>
        <div class="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <label class="block font-semibold" for="oracle-delay">Trader claim priority</label>
          <span class="app-muted mt-1 block text-sm">
            Extra time LP mint/burn claims wait, so trader exits can claim settled collateral first. {durationText(delayValue, delayUnit)} equals {delay} seconds in OracleFactory.
          </span>
          <span class="mt-3 grid grid-cols-[1fr_8rem] gap-2">
            <input id="oracle-delay" class="input input-bordered" type="number" min="0" bind:value={delayValue} />
            <select class="select select-bordered" aria-label="Trader claim priority unit" bind:value={delayUnit}>
              {#each durationUnits as unit (unit)}
                <option value={unit}>{unit}</option>
              {/each}
            </select>
          </span>
        </div>
        <div class="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <label class="block font-semibold" for="oracle-min-stake">Minimum stake</label>
          <span class="app-muted mt-1 block text-sm">Minimum ETC stake required before an oracle participant can submit prices.</span>
          <input id="oracle-min-stake" class="input input-bordered mt-3 w-full" bind:value={minStake} />
        </div>
        <div class="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <label class="block font-semibold" for="oracle-modulo">Calendar cycle length</label>
          <span class="app-muted mt-1 block text-sm">Modulo used for skipped rounds. Use 7 for a weekly daily cycle, 24 for hourly daily cycle, 0 for none.</span>
          <input id="oracle-modulo" class="input input-bordered mt-3 w-full" type="number" min="0" max="255" bind:value={modulo} />
        </div>
        <div class="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <label class="block font-semibold" for="oracle-drops">Skipped positions</label>
          <span class="app-muted mt-1 block text-sm">Comma-separated residues skipped in the cycle, e.g. weekend positions for a daily weekly oracle.</span>
          <input id="oracle-drops" class="input input-bordered mt-3 w-full" placeholder="6,0" bind:value={drops} />
        </div>
      </div>

      <div class="mt-5 flex justify-end">
        <button class="btn btn-primary rounded-full" type="button" on:click={() => (step = "feeds")}>
          Define feeds and slots
        </button>
      </div>
    </section>
    {/if}

    {#if step === "feeds"}
    <section class="app-panel rounded-lg p-5">
      <div class="mb-5 flex justify-center">
        <div class="app-nav grid w-full max-w-3xl gap-1 rounded-full p-1 md:inline-grid md:w-auto md:grid-cols-3">
          {#each createSteps as createStep (createStep.id)}
            <button
              class={`btn rounded-full ${step === createStep.id ? "btn-primary" : "btn-ghost"}`}
              type="button"
              on:click={() => selectStep(createStep.id)}
            >
              {createStep.label}
            </button>
          {/each}
        </div>
      </div>

      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="app-label">Reusable quote and base feeds</div>
          <h2 class="mt-1 text-xl font-bold">Endpoint algorithms</h2>
        </div>
        <button class="btn btn-primary btn-sm rounded-full" type="button" on:click={addFeed}>
          <Icon icon="mdi:plus" />
          Feed
        </button>
      </div>

      <div class="mt-5 space-y-4">
        {#each feeds as feed (feed.id)}
          <article class="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div class="mb-4 rounded-lg border border-primary/20 bg-primary/10 p-4">
              <div class="app-label">Feed spec</div>
              <p class="mt-2 font-mono text-sm leading-relaxed">{feedSummary(feed)}</p>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label class="form-control">
                <span class="label-text">Feed id</span>
                <input class="input input-bordered font-mono" bind:value={feed.name} />
              </label>
              <label class="form-control">
                <span class="label-text">Base</span>
                <input class="input input-bordered" bind:value={feed.base} />
              </label>
              <label class="form-control">
                <span class="label-text">Quote</span>
                <input class="input input-bordered" bind:value={feed.quote} />
              </label>
              <label class="form-control">
                <span class="label-text">Observation rule</span>
                <input class="input input-bordered" bind:value={feed.observation} />
              </label>
              <label class="form-control">
                <span class="label-text">Algorithm</span>
                <select class="select select-bordered" bind:value={feed.algorithm}>
                  {#each algorithms as algorithm (algorithm)}
                    <option value={algorithm}>{algorithm}</option>
                  {/each}
                </select>
              </label>
              <label class="form-control">
                <span class="label-text">Minimum valid sources</span>
                <input class="input input-bordered" type="number" min="1" bind:value={feed.minSources} />
              </label>
              <label class="form-control">
                <span class="label-text">Cluster size</span>
                <input class="input input-bordered" type="number" min="1" bind:value={feed.clusterSize} />
              </label>
              <label class="form-control">
                <span class="label-text">Feed rounding</span>
                <select class="select select-bordered" bind:value={feed.rounding}>
                  {#each roundingModes as mode (mode)}
                    <option value={mode}>{mode}</option>
                  {/each}
                </select>
              </label>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <div class="app-label">Endpoints</div>
              <div class="flex gap-2">
                <button class="btn btn-outline btn-xs rounded-full" type="button" on:click={() => addEndpoint(feed)}>
                  <Icon icon="mdi:plus" />
                  Endpoint
                </button>
                <button class="btn btn-ghost btn-xs rounded-full" type="button" on:click={() => removeFeed(feed.id)}>
                  Remove feed
                </button>
              </div>
            </div>

            <div class="mt-3 space-y-3">
              {#each feed.endpoints as endpoint (endpoint.id)}
                {@const endpointTest = endpointTests[endpoint.id]}
                <div class="grid gap-3 rounded-lg border border-white/10 p-3 md:grid-cols-2">
                  <label class="form-control">
                    <span class="label-text">Provider</span>
                    <input class="input input-bordered" bind:value={endpoint.provider} />
                  </label>
                  <label class="form-control md:col-span-2">
                    <span class="label-text">URL template</span>
                    <input class="input input-bordered font-mono" bind:value={endpoint.url} />
                  </label>
                  <label class="form-control">
                    <span class="label-text">Timing and validity rule</span>
                    <textarea class="textarea textarea-bordered min-h-24" bind:value={endpoint.maxAge}></textarea>
                  </label>
                  <label class="form-control">
                    <span class="label-text">Extraction notes</span>
                    <div class="flex h-full gap-2">
                      <textarea class="textarea textarea-bordered min-h-24 flex-1" bind:value={endpoint.notes}></textarea>
                      <button
                        class="btn btn-outline self-end"
                        aria-label="Try endpoint"
                        type="button"
                        disabled={endpointTest?.loading || !endpoint.url.trim()}
                        on:click={() => tryEndpoint(endpoint)}
                      >
                        {#if endpointTest?.loading}
                          <span class="loading loading-spinner loading-xs"></span>
                        {:else}
                          <Icon icon="mdi:play-circle-outline" />
                        {/if}
                        Try
                      </button>
                      <button
                        class="btn btn-ghost btn-square self-end"
                        aria-label="Remove endpoint"
                        type="button"
                        on:click={() => removeEndpoint(feed, endpoint.id)}
                      >
                        <Icon icon="mdi:trash-can-outline" />
                      </button>
                    </div>
                  </label>
                  {#if endpointTest}
                    <div
                      class={`rounded-lg border p-3 text-sm md:col-span-2 ${
                        endpointTest.loading
                          ? "border-info/30 bg-info/10"
                          : endpointTest.ok
                            ? "border-success/30 bg-success/10"
                            : "border-error/30 bg-error/10"
                      }`}
                    >
                      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div class="font-semibold">
                          {#if endpointTest.loading}
                            Testing endpoint
                          {:else if endpointTest.ok}
                            Endpoint responded
                          {:else}
                            Endpoint test failed
                          {/if}
                        </div>
                        {#if endpointTest.status}
                          <div class="font-mono text-xs">
                            HTTP {endpointTest.status} {endpointTest.statusText || ""}
                          </div>
                        {/if}
                      </div>
                      {#if endpointTest.testedUrl}
                        <div class="app-muted mt-2 break-all font-mono text-xs">{endpointTest.testedUrl}</div>
                      {/if}
                      {#if endpointTest.error}
                        <div class="mt-3 rounded border border-current/20 p-2">{endpointTest.error}</div>
                      {/if}
                      {#if endpointTest.preview && !endpointTest.loading}
                        <details class="mt-3">
                          <summary class="cursor-pointer text-xs font-semibold uppercase tracking-wide">Response preview</summary>
                          <pre class="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded border border-current/20 p-3 text-xs">{endpointTest.preview}</pre>
                        </details>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </article>
        {/each}
      </div>
    </section>

    <section class="app-panel rounded-lg p-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="app-label">Oracle slots</div>
          <h2 class="mt-1 text-xl font-bold">Derived values submitted onchain</h2>
        </div>
        <button class="btn btn-primary btn-sm rounded-full" type="button" on:click={addSlot} disabled={slots.length >= 8}>
          <Icon icon="mdi:plus" />
          Slot
        </button>
      </div>

      <div class="mt-5 space-y-4">
        {#each slots as slot, slotIndex (slot.id)}
          {@const suggestedSlotDecimals = suggestedDecimals(slot.estimatedMax || "")}
          {@const slotMaxValue = maxRepresentableValue(slot.decimals)}
          <article class="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div class="mb-4 flex flex-col gap-1 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div class="app-label">Slot {slotIndex}</div>
                <h3 class="mt-1 text-lg font-bold">{slot.label || `Slot ${slotIndex}`}</h3>
              </div>
              <div class="app-muted font-mono text-xs">{slot.formula || slot.baseFeed || "Formula not specified"}</div>
            </div>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label class="form-control">
                <span class="label-text">Output label</span>
                <input class="input input-bordered" placeholder="BTC/ETC" bind:value={slot.label} />
              </label>
              <label class="form-control">
                <span class="label-text">Base feed</span>
                <select class="select select-bordered" bind:value={slot.baseFeed}>
                  {#each feeds as feed (feed.id)}
                    <option value={feed.name}>{feed.name}</option>
                  {/each}
                </select>
              </label>
              <label class="form-control">
                <span class="label-text">Quote feed</span>
                <select class="select select-bordered" bind:value={slot.quoteFeed}>
                  <option value="">None</option>
                  {#each feeds as feed (feed.id)}
                    <option value={feed.name}>{feed.name}</option>
                  {/each}
                </select>
              </label>
              <label class="form-control lg:col-span-2">
                <span class="label-text">Formula</span>
                <input class="input input-bordered font-mono" bind:value={slot.formula} />
              </label>
              <label class="form-control">
                <span class="label-text">Submitted decimals</span>
                <input class="input input-bordered" type="number" min="0" max="18" bind:value={slot.decimals} />
              </label>
              <label class="form-control">
                <span class="label-text">Final rounding</span>
                <select class="select select-bordered" bind:value={slot.finalRounding}>
                  {#each roundingModes as mode (mode)}
                    <option value={mode}>{mode}</option>
                  {/each}
                </select>
              </label>
              <label class="form-control md:col-span-2 lg:col-span-4">
                <span class="label-text">Missing data rule</span>
                <textarea class="textarea textarea-bordered min-h-20" bind:value={slot.missingData}></textarea>
              </label>
            </div>

            <div class="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-end">
                <label class="form-control flex-1">
                  <span class="label-text">Conservative max value</span>
                  <input
                    class="input input-bordered font-mono"
                    placeholder="Maximum expected {slot.label || 'slot'} price"
                    bind:value={slot.estimatedMax}
                  />
                </label>
                <div class="flex flex-1 flex-col gap-1 text-sm">
                  <div>
                    Max at {slot.decimals} decimals:
                    <span class="font-mono">{formatDecimal(slotMaxValue)}</span>
                  </div>
                  <div class="app-muted">
                    {#if suggestedSlotDecimals !== undefined}
                      Suggested decimals: <span class="font-mono">{suggestedSlotDecimals}</span>
                    {:else}
                      Enter a conservative upper bound to estimate safe decimals.
                    {/if}
                  </div>
                </div>
                <button
                  class="btn btn-outline btn-sm rounded-full"
                  type="button"
                  disabled={suggestedSlotDecimals === undefined}
                  on:click={() => applySuggestedDecimals(slot)}
                >
                  Apply
                </button>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <button class="btn btn-ghost btn-xs rounded-full" type="button" on:click={() => removeSlot(slot.id)}>
                Remove slot
              </button>
            </div>
          </article>
        {/each}
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="app-panel rounded-lg p-5">
        <div class="app-label">Generated oracle description</div>
        <h2 class="mt-1 text-xl font-bold">Canonical participant instructions</h2>
        <textarea class="textarea textarea-bordered mt-4 h-[32rem] w-full font-mono text-xs" readonly value={generatedDescription}></textarea>
        <div class="app-muted mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs">
          On-chain deployment stores a compact description with the hash of these instructions. The full methodology
          remains in this draft JSON to avoid oversized OracleFactory transactions.
        </div>
      </div>

      <div class="app-panel rounded-lg p-5">
        <div class="app-label">Deployment milestone</div>
        <h2 class="mt-1 text-xl font-bold">Deploy Oracle contract</h2>
        <p class="app-muted mt-3 text-sm">
          Step 3 is locked to the deployed oracle address. If this configuration changes after deployment, deploy a new
          oracle before staking and operating it.
        </p>

        {#if oracleDeployment}
          <div class="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm">
            <div class="app-muted">Current deployment</div>
            <div class="mt-1 break-all font-mono">{oracleDeployment.address}</div>
            <div class="app-muted mt-2 break-all text-xs">tx {oracleDeployment.txHash}</div>
            {#if currentOracleDeploymentValid()}
              <div class="mt-3 font-semibold text-success">Matches current configuration</div>
            {:else}
              <div class="mt-3 font-semibold text-warning">Configuration changed since deployment</div>
            {/if}
          </div>
        {/if}

        {#if specPublication}
          <div class="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm">
            <div class="app-muted">Nostr methodology event</div>
            <div class="mt-1 break-all font-mono">{specPublication.naddr}</div>
            <div class="app-muted mt-2 break-all text-xs">author {specPublication.pubkey}</div>
            <div class="app-muted mt-1 break-all text-xs">d {specPublication.d}</div>
            <div class="app-muted mt-1 break-all text-xs">predicted oracle {specPublication.predictedOracle}</div>
            {#if specPublication.verifiedAt}
              <div class="app-muted mt-1 break-all text-xs">
                fetched from {specPublication.verifiedRelay} at {new Date(specPublication.verifiedAt).toLocaleString()}
              </div>
            {/if}
            {#if currentSpecPublicationValid()}
              <div class="mt-3 font-semibold text-success">Matches current methodology</div>
            {:else}
              <div class="mt-3 font-semibold text-warning">Methodology changed since publication</div>
              <div class="app-muted mt-1 text-xs">{specPublicationProblem()}</div>
            {/if}
          </div>
        {/if}

        {#if specPublishError}
          <div class="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{specPublishError}</div>
        {/if}

        {#if oracleDeployError}
          <div class="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{oracleDeployError}</div>
        {/if}

        <div class="mt-5 flex flex-wrap gap-2">
          {#if currentOracleDeploymentValid()}
            <button class="btn btn-primary rounded-full" type="button" on:click={goToOperate}>
              Continue to Operate Oracle
            </button>
          {:else if !specPublication || !currentSpecPublicationValid()}
            {#if specPublication}
              <div class="basis-full rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning-content">
                {specPublicationProblem()}
              </div>
            {/if}
            <button class="btn btn-primary rounded-full" type="button" disabled={specPublishing} on:click={publishSpecToNostr}>
              {specPublishing ? "Publishing..." : "Publish Spec to Nostr"}
            </button>
          {:else}
            {#if oracleDeploymentProblem()}
              <div class="basis-full rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning-content">
                {oracleDeploymentProblem()}
              </div>
            {/if}
            {#if !$signer && !walletProviderAvailable}
              <button class="btn btn-primary rounded-full" type="button" on:click={ensureWalletSigner}>
                {$signerAddress ? "Reconnect Wallet" : "Connect Wallet"}
              </button>
            {:else if Number($chainId || 0) !== 63}
              <button class="btn btn-primary rounded-full" type="button" on:click={() => switchNetwork(63)}>
                Switch to Mordor
              </button>
            {/if}
            <button class="btn btn-primary rounded-full" type="button" disabled={oracleDeploying || !canDeployOracle()} on:click={deployOracle}>
              {oracleDeploying ? "Deploying..." : "Deploy Oracle"}
            </button>
          {/if}
        </div>
      </div>
    </section>
    {/if}

    {#if step === "operate"}
    <section class="app-panel rounded-lg p-5">
      <div class="mb-5 flex justify-center">
        <div class="app-nav grid w-full max-w-3xl gap-1 rounded-full p-1 md:inline-grid md:w-auto md:grid-cols-3">
          {#each createSteps as createStep (createStep.id)}
            <button
              class={`btn rounded-full ${step === createStep.id ? "btn-primary" : "btn-ghost"}`}
              type="button"
              on:click={() => selectStep(createStep.id)}
            >
              {createStep.label}
            </button>
          {/each}
        </div>
      </div>

      <div class="rounded-lg border border-base-300 bg-base-100/70 p-4 md:p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div class="app-label">Oracle operation</div>
            <h2 class="mt-1 text-xl font-bold">Stake and run the oracle</h2>
            <p class="app-muted mt-2 max-w-3xl text-sm">
              A deployed oracle is not live infrastructure until operators stake, publish round intent, compute prices,
              and submit valid rounds. Markets should be created later from an oracle that already returns non-zero prices.
            </p>
          </div>
          <button class="btn btn-outline btn-sm rounded-full" type="button" on:click={() => (step = "feeds")}>
            Back to feeds
          </button>
        </div>

        <div class="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          <div class="rounded-lg border border-base-300 bg-base-200/30 p-3">
            <div class="flex items-center justify-between gap-3">
              <div class="app-muted text-xs">Oracle</div>
              <span class={currentOracleDeploymentValid() ? "badge badge-success badge-outline" : "badge badge-warning badge-outline"}>
                {currentOracleDeploymentValid() ? "deployed" : "not deployed"}
              </span>
            </div>
            <div class="mt-2 break-all font-mono text-sm">{oracleDeployment?.address || "Deploy the oracle from Step 2 first."}</div>
          </div>

          <div class="rounded-lg border border-base-300 bg-base-200/30 p-3">
            <div class="app-muted text-xs">Operator requirement</div>
            <div class="mt-2 font-mono text-sm">{minStake} ETC minimum stake</div>
            {#if !$signerAddress}
              <div class="app-muted mt-2 text-xs">Connect a wallet to check whether this account is already staked.</div>
            {:else if oracleStakeStatusLoading}
              <div class="app-muted mt-2 text-xs">Checking stake status...</div>
            {:else if oracleStakeStatus}
              <div class={oracleStakeStatus.isStaked ? "mt-2 text-xs font-semibold text-success" : "mt-2 text-xs font-semibold text-warning"}>
                {oracleStakeStatus.isStaked ? "Current wallet is staked" : "Current wallet is below minimum"}
              </div>
            {:else if oracleStakeStatusError}
              <div class="mt-2 text-xs font-semibold text-error">{oracleStakeStatusError}</div>
            {/if}
          </div>

          <div class="rounded-lg border border-base-300 bg-base-200/30 p-3">
            <div class="flex items-center justify-between gap-3">
              <div class="app-muted text-xs">Methodology</div>
              {#if specPublication?.verifiedAt}
                <span class="badge badge-success badge-outline">fetched</span>
              {:else if specPublication}
                <span class="badge badge-warning badge-outline">published</span>
              {:else}
                <span class="badge badge-ghost">missing</span>
              {/if}
            </div>
            <div class="mt-2 break-all font-mono text-xs">{specPublication?.naddr || "No Nostr spec"}</div>
            {#if specPublication?.verifiedAt}
              <div class="app-muted mt-2 break-all text-xs">
                fetched from {specPublication.verifiedRelay} at {new Date(specPublication.verifiedAt).toLocaleString()}
              </div>
            {:else if specPublication}
              <div class="mt-2 text-xs font-semibold text-warning">Not fetched back from relays yet</div>
            {/if}
            {#if specVerifyError}
              <div class="mt-2 text-xs font-semibold text-error">{specVerifyError}</div>
            {/if}
            {#if specPublication}
              <button class="btn btn-outline btn-xs mt-3 rounded-full" type="button" disabled={specVerifying} on:click={verifySpecPublication}>
                {specVerifying ? "Fetching..." : "Fetch Nostr Event"}
              </button>
            {/if}
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-lg border border-base-300 bg-base-100/60 p-4">
          <div class="app-label">Stake</div>
          <h2 class="mt-1 text-xl font-bold">Stake as an oracle operator</h2>
          <p class="app-muted mt-2 text-sm">
            Staking links your EVM account to the Nostr public key that published the methodology when available.
            The contract requires enough stake before price submissions are accepted.
          </p>

          {#if oracleStakeError}
            <div class="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{oracleStakeError}</div>
          {/if}

          <div class="mt-4 rounded-lg border border-base-300 bg-base-200/40 p-3 text-sm">
            <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <div class="font-semibold">Current wallet stake</div>
                {#if !$signerAddress}
                  <div class="app-muted mt-1 text-xs">Connect a wallet to check stake status.</div>
                {:else if oracleStakeStatusLoading}
                  <div class="app-muted mt-1 text-xs">Checking Oracle stake...</div>
                {:else if oracleStakeStatus}
                  <div class={oracleStakeStatus.isStaked ? "mt-1 font-semibold text-success" : "mt-1 font-semibold text-warning"}>
                    {oracleStakeStatus.isStaked ? "Staked" : "Below minimum stake"}
                  </div>
                  <div class="app-muted mt-1 font-mono text-xs">stake {oracleStakeStatus.stakeEtc} ETC</div>
                  <div class="app-muted mt-1 font-mono text-xs">mana {oracleStakeStatus.manaEtc}</div>
                  {#if oracleStakeStatus.nostrPubkey !== "0x0000000000000000000000000000000000000000000000000000000000000000"}
                    <div class="app-muted mt-1 break-all font-mono text-xs">nostr {oracleStakeStatus.nostrPubkey}</div>
                    <div class={oracleStakeStatus.linkedToSpec ? "mt-1 text-xs font-semibold text-success" : "mt-1 text-xs font-semibold text-warning"}>
                      {oracleStakeStatus.linkedToSpec ? "Linked to methodology author" : "Linked to a different Nostr key"}
                    </div>
                  {:else}
                    <div class="mt-1 text-xs font-semibold text-warning">No Nostr key linked on-chain</div>
                  {/if}
                {:else if oracleStakeStatusError}
                  <div class="mt-1 text-xs font-semibold text-error">{oracleStakeStatusError}</div>
                {:else}
                  <div class="app-muted mt-1 text-xs">Stake status unavailable.</div>
                {/if}
              </div>
              <button class="btn btn-outline btn-xs rounded-full" type="button" disabled={oracleStakeStatusLoading || !oracleDeployment?.address || !$signerAddress} on:click={refreshOracleStakeStatus}>
                Refresh
              </button>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
            <label class="form-control flex-1">
              <span class="label-text">Stake amount ETC</span>
              <input class="input input-bordered font-mono" bind:value={oracleStakeAmount} />
            </label>
            {#if !$signer && !walletProviderAvailable}
              <button class="btn btn-primary rounded-full" type="button" on:click={ensureWalletSigner}>
                {$signerAddress ? "Reconnect Wallet" : "Connect Wallet"}
              </button>
            {:else if Number($chainId || 0) !== 63}
              <button class="btn btn-primary rounded-full" type="button" on:click={() => switchNetwork(63)}>
                Switch to Mordor
              </button>
            {/if}
            <button class="btn btn-primary rounded-full" type="button" disabled={oracleStaking || !currentOracleDeploymentValid()} on:click={stakeOracle}>
              {oracleStaking ? "Staking..." : "Stake Oracle"}
            </button>
          </div>
        </div>

        <div class="rounded-lg border border-base-300 bg-base-100/60 p-4">
          <div class="app-label">Agent bundle</div>
          <h2 class="mt-1 text-xl font-bold">Give this to your agent</h2>
          <p class="app-muted mt-2 text-sm">
            The bundle instructs an agent to fetch the Nostr methodology, publish Nostr pre-submission intent, compute
            source prices, pack slots, submit rounds, and run continuously as a daemon.
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button class="btn btn-primary rounded-full" type="button" on:click={downloadOracleAgentBundle}>
              Download Agent Bundle
            </button>
            <button class="btn btn-outline rounded-full" type="button" on:click={copyOracleAgentPrompt}>
              Copy Prompt
            </button>
          </div>
        </div>
      </section>

      <div class="divider"></div>

      <section class="grid gap-4 lg:grid-cols-3">
        <div class="rounded-lg border border-base-300 bg-base-100/60 p-4">
          <div class="font-bold">1. Stake</div>
          <p class="app-muted mt-2 text-sm">Deposit at least the minimum stake and link the Nostr key used for coordination.</p>
        </div>
        <div class="rounded-lg border border-base-300 bg-base-100/60 p-4">
          <div class="font-bold">2. Publish intent</div>
          <p class="app-muted mt-2 text-sm">
            Before every round submission, publish a kind {intentEventKind} Nostr event with explicit computed prices.
          </p>
        </div>
        <div class="rounded-lg border border-base-300 bg-base-100/60 p-4">
          <div class="font-bold">3. Submit prices</div>
          <p class="app-muted mt-2 text-sm">Call Oracle.setPrices for allowed rounds. Markets can be created later once lastPrice is non-zero.</p>
        </div>
      </section>
    </section>
    {/if}
  </div>
</div>
