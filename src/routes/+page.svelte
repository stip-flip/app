<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  onMount(() => {
    document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
  });

  const paths = [
    {
      title: "Trade",
      text: "Enter tokenized perpetual exposure through OTC settlement or instant secondary markets.",
      href: "/swap",
      icon: "mdi:swap-horizontal",
    },
    {
      title: "Provide liquidity",
      text: "Back synthetic exposure through funding-rate markets and earn protocol flows.",
      href: "/earn",
      icon: "mdi:chart-line",
    },
    {
      title: "Submit prices",
      text: "Stake ETC, participate in oracle rounds, and earn bounties for accurate data.",
      href: "/oracle",
      icon: "mdi:database-eye",
    },
    {
      title: "Create markets",
      text: "Launch new synthetic assets and build execution around S&F position tokens.",
      href: "https://docs.stipflip.xyz/docs/developer/synth-creation",
      icon: "mdi:source-branch-plus",
    },
  ];

  const settlement = [
    "ETC collateral",
    "Issuance and redemption",
    "Funding-rate accounting",
    "Open oracle rounds",
    "Position-token balances",
  ];

  const comparisons = [
    ["Position", "Venue account state", "Wallet-held token"],
    ["Execution", "One venue", "Any market"],
    ["Oracle", "Liquidation feed", "Settlement feed"],
    ["Listings", "Operator controlled", "Permissionless"],
    ["Collateral", "Venue assumptions", "ETC base layer"],
  ];
</script>

<svelte:head>
  <title>Stip & Flip | Perpetual Settlement Layer</title>
  <meta
    name="description"
    content="Stip & Flip is the settlement layer for tokenized perpetual markets on ETC."
  />
</svelte:head>

<main class="landing-page min-h-screen overflow-x-hidden bg-protocol text-base-content">
  <section class="hero relative px-5 pb-16 pt-28 lg:px-12 lg:pb-20">
    <img class="hero-mark" src="/icon.svg" alt="" aria-hidden="true" />
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center">
      <div class="hero-copy max-w-5xl">
        <div class="eyebrow">
          <Icon icon="mdi:infinity" />
          The perpetual protocol
        </div>

        <h1>A base layer for perpetual markets.</h1>

        <p class="hero-subtitle">
          Markets compete on execution. Perp logic lives in the protocol.
        </p>

        <div class="hero-principles" aria-label="Protocol principles">
          <span>Open to everyone</span>
          <span>No insiders</span>
          <span>No admin keys</span>
          <span>No backdoors</span>
        </div>

        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="/swap">
            Launch App
            <Icon icon="mdi:arrow-right" />
          </a>
          <a
            class="btn btn-outline btn-lg fine-border"
            href="https://docs.stipflip.xyz/docs/general-overview/core-thesis"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Thesis
          </a>
        </div>
      </div>
    </div>
  </section>

  <section class="visual-hero px-5 py-20 lg:px-12 lg:py-28">
    <div class="mx-auto max-w-7xl">
      <div class="visual-section-heading">
        <span class="section-kicker">The missing primitive</span>
        <h2>Perp positions should move like tokens, not account balances.</h2>
      </div>

      <div class="settlement-stage" aria-label="S&F settlement stack">
        <div class="stack-label">Venues trade</div>
        <div class="venue-row">
          <div class="venue-pill">S&F App</div>
          <div class="venue-pill">AMMs</div>
          <div class="venue-pill">Market makers</div>
          <div class="venue-pill">Other venues</div>
        </div>

        <div class="stack-arrow" aria-hidden="true">
          <span>execute against</span>
        </div>

        <div class="stack-label">Tokenized positions move</div>
        <div class="token-orbit">
          <div class="token-card">
            <span>S-BTC</span>
            <strong>Long BTC exposure</strong>
          </div>
          <div class="token-card">
            <span>F-ETH²</span>
            <strong>Inverse power exposure</strong>
          </div>
          <div class="token-card">
            <span>S-SOL³</span>
            <strong>Cubed SOL exposure</strong>
          </div>
        </div>

        <div class="stack-arrow" aria-hidden="true">
          <span>settled by</span>
        </div>

        <div class="settlement-core">
          <div>
            <span class="core-label">S&F settles</span>
            <h2>One ruleset defines what every position token is worth.</h2>
          </div>
          <ul>
            {#each settlement as item}
              <li><Icon icon="mdi:check-circle" /> {item}</li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="ticker-band" aria-label="Protocol attributes">
    <div>No company operator</div>
    <div>Open oracle</div>
    <div>No trader liquidation engine</div>
    <div>Permissionless markets</div>
    <div>Portable positions</div>
    <div>ETC collateral</div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-24 lg:px-12">
    <div class="split-intro">
      <div>
        <span class="section-kicker">The shift</span>
        <h2>Stop rebuilding exchanges. Start composing markets.</h2>
      </div>
      <div class="intro-copy">
        <p>
          Most DeFi perp systems still look like centralized exchanges with transparent accounting. The venue remains the center: it owns the account model, execution path, price-feed dependency, funding logic, liquidation system, and listing surface.
        </p>
        <p>
          S&F moves the center of gravity to the protocol. Price feeds, funding-rate discovery, position accounting, and settlement become open protocol layers. Markets can then compete on execution without becoming the source of truth.
        </p>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-10 lg:px-12">
    <div class="path-grid">
      {#each paths as path}
        <a
          class="path-card"
          href={path.href}
          target={path.href.startsWith("http") ? "_blank" : undefined}
          rel={path.href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          <Icon icon={path.icon} />
          <span>{path.title}</span>
          <p>{path.text}</p>
        </a>
      {/each}
    </div>
  </section>

  <section class="mechanism-section mx-auto max-w-7xl px-5 py-24 lg:px-12">
    <div class="section-heading">
      <span class="section-kicker">How it works</span>
      <h2>Minting changes supply. Trading moves ownership.</h2>
    </div>

    <div class="mechanism-visual">
      <div class="mechanism-column">
        <span>OTC settlement</span>
        <h3>Issue or redeem position tokens</h3>
        <p>OTC changes synthetic supply. It locks collateral or tokens, waits for the next oracle round, and settles against the protocol pool.</p>
      </div>
      <div class="connector" aria-hidden="true">
        <div>Position tokens</div>
      </div>
      <div class="mechanism-column market">
        <span>Market execution</span>
        <h3>Trade existing tokens instantly</h3>
        <p>Markets move ownership of tokens that already exist. They compete on liquidity, routing, and UX without becoming the source of truth.</p>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-24 lg:px-12">
    <div class="comparison-layout">
      <div>
        <span class="section-kicker">Compared to perp venues</span>
        <h2>A lower layer than the exchange.</h2>
        <p>
          Hyperliquid, dYdX, GMX, and Synthetix-style systems can be strong venues or liquidity networks. But the market is still organized around a venue. S&F is aiming at the lower layer: a decentralized perp market where feeds, funding discovery, positions, and settlement can all live in the open protocol.
        </p>
      </div>
      <div class="comparison-table">
        {#each comparisons as row}
          <div class="comparison-row">
            <span>{row[0]}</span>
            <span>{row[1]}</span>
            <strong>{row[2]}</strong>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-24 lg:px-12">
    <div class="etc-panel">
      <span class="section-kicker">Why ETC</span>
      <h2>ETC keeps the collateral side simple.</h2>
      <p>
        If S&F is meant to be a common base for perpetual exposure, settlement should not depend on a venue chain, bridge, sequencer, or company-controlled collateral system. ETC is the app-wide settlement asset.
      </p>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 pb-28 pt-14 lg:px-12">
    <div class="final-cta">
      <div>
        <span class="section-kicker">Build on top</span>
        <h2>Bring your own venue, router, or market maker.</h2>
      </div>
      <div class="final-actions">
        <a class="btn btn-primary btn-lg" href="/swap">Launch App</a>
        <a
          class="btn btn-outline btn-lg fine-border"
          href="https://docs.stipflip.xyz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read Docs
        </a>
      </div>
    </div>
  </section>
</main>

<style>
  :global(.root:has(.landing-page)) {
    height: auto;
    min-height: 100vh;
    max-width: 100vw;
    overflow-x: hidden;
    overflow-y: visible;
  }

  .landing-page {
    width: 100%;
    max-width: 100vw;
  }

  .bg-protocol {
    background:
      linear-gradient(115deg, hsl(var(--b3)) 0%, hsl(var(--b1)) 42%, #26383b 100%),
      radial-gradient(circle at 12% 18%, hsl(var(--p) / 0.24), transparent 30rem);
  }

  .hero {
    isolation: isolate;
    background:
      linear-gradient(rgba(158, 230, 173, 0.085) 1px, transparent 1px),
      linear-gradient(90deg, rgba(158, 230, 173, 0.085) 1px, transparent 1px),
      radial-gradient(circle at 18% 34%, rgba(158, 230, 173, 0.2), transparent 24rem),
      radial-gradient(circle at 72% 18%, rgba(158, 230, 173, 0.12), transparent 18rem),
      radial-gradient(circle at 88% 34%, rgba(147, 108, 255, 0.2), transparent 31rem),
      linear-gradient(118deg, rgba(12, 16, 22, 0.42), transparent 48%);
    background-size: 44px 44px, 44px 44px, auto, auto, auto, auto;
  }

  .hero::before {
    position: absolute;
    inset: 0;
    z-index: 0;
    content: "";
    background:
      linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 8.8rem 8.8rem;
    mask-image: radial-gradient(circle at 64% 42%, black, transparent 74%);
    opacity: 0.62;
    pointer-events: none;
  }

  .hero::after {
    position: absolute;
    inset: auto -18rem -18rem auto;
    z-index: 0;
    width: 46rem;
    height: 46rem;
    content: "";
    border-radius: 999px;
    background:
      radial-gradient(circle, rgba(158, 230, 173, 0.18), rgba(147, 108, 255, 0.08) 38%, transparent 68%);
    filter: blur(12px);
    pointer-events: none;
  }

  .hero-mark {
    position: absolute;
    z-index: 1;
    top: 5.2rem;
    left: min(44vw, calc(50% - 0.5rem));
    width: min(66vw, 60rem);
    aspect-ratio: 1;
    opacity: 0.56;
    pointer-events: none;
    user-select: none;
    mix-blend-mode: lighten;
    transform: translateX(-3%);
    filter:
      sepia(0.6)
      saturate(3.8)
      hue-rotate(62deg)
      brightness(1.68)
      drop-shadow(0 34px 110px rgba(158, 230, 173, 0.52));
  }

  .hero-grid {
    position: absolute;
    z-index: 1;
    top: 5.2rem;
    left: min(44vw, calc(50% - 0.5rem));
    width: min(66vw, 60rem);
    aspect-ratio: 1;
    background:
      linear-gradient(90deg, rgba(158, 230, 173, 0.22) 1px, transparent 1px),
      linear-gradient(0deg, rgba(158, 230, 173, 0.17) 1px, transparent 1px),
      radial-gradient(circle at 36% 34%, rgba(158, 230, 173, 0.32), transparent 18rem);
    background-size: 4.25rem 4.25rem, 4.25rem 4.25rem, auto;
    mask-image: url("/icon.svg");
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
    -webkit-mask-image: url("/icon.svg");
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
    opacity: 0.62;
    transform: translateX(-3%);
    pointer-events: none;
  }

  .hero-copy h1,
  .visual-section-heading h2,
  .split-intro h2,
  .section-heading h2,
  .comparison-layout h2,
  .etc-panel h2,
  .final-cta h2 {
    font-weight: 650;
    letter-spacing: 0;
    color: hsl(var(--bc));
  }

  .hero-copy h1 {
    position: relative;
    z-index: 2;
    max-width: 72rem;
    font-size: clamp(3.55rem, 6.7vw, 7.1rem);
    line-height: 0.92;
    overflow-wrap: break-word;
    text-shadow: 0 22px 80px rgba(0, 0, 0, 0.34);
  }

  .hero-subtitle {
    position: relative;
    z-index: 2;
    max-width: 50rem;
    margin-top: 1.25rem;
    color: hsl(var(--bc) / 0.74);
    font-size: clamp(1.05rem, 1.7vw, 1.35rem);
    line-height: 1.55;
  }

  .hero-principles {
    position: relative;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    max-width: 52rem;
    margin-top: 1.15rem;
  }

  .hero-principles span {
    border: 1px solid rgba(158, 230, 173, 0.28);
    border-radius: 999px;
    padding: 0.55rem 0.75rem;
    color: hsl(var(--bc) / 0.78);
    background: rgba(17, 18, 28, 0.42);
    font-size: 0.86rem;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
  }

  .eyebrow,
  .section-kicker,
  .core-label {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: #9ee6ad;
    font-size: 0.78rem;
    font-weight: 750;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .eyebrow {
    position: relative;
    z-index: 2;
    margin-bottom: 1.4rem;
    border: 1px solid rgba(158, 230, 173, 0.42);
    border-radius: 999px;
    padding: 0.65rem 0.9rem;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.025)),
      rgba(158, 230, 173, 0.1);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 16px 60px rgba(0, 0, 0, 0.16);
  }

  .hero-actions,
  .final-actions {
    position: relative;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    margin-top: 1.5rem;
  }

  .visual-hero {
    background:
      radial-gradient(circle at 82% 42%, rgba(147, 108, 255, 0.16), transparent 30rem),
      rgba(255, 255, 255, 0.015);
  }

  .visual-section-heading {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .visual-section-heading h2 {
    max-width: 58rem;
    font-size: clamp(2.6rem, 5.5vw, 6rem);
    line-height: 0.94;
  }

  .settlement-stage {
    position: relative;
    min-height: auto;
    border-radius: 1.4rem;
    padding: clamp(1.1rem, 3vw, 2.5rem);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
      rgba(20, 22, 34, 0.44);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 38px 100px rgba(0, 0, 0, 0.22);
    overflow: hidden;
  }

  .settlement-stage::before {
    position: absolute;
    inset: 12%;
    content: "";
    background:
      linear-gradient(rgba(158, 230, 173, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(158, 230, 173, 0.08) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(circle, black, transparent 74%);
  }

  .venue-row,
  .token-orbit,
  .settlement-core,
  .stack-label,
  .stack-arrow {
    position: relative;
    z-index: 1;
  }

  .stack-label {
    margin-bottom: 0.65rem;
    color: #9ee6ad;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .venue-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .venue-pill {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    padding: 0.8rem 1rem;
    color: hsl(var(--bc) / 0.74);
    background: rgba(255, 255, 255, 0.055);
    font-size: 0.92rem;
  }

  .token-orbit {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    margin: 0 0 0.8rem;
  }

  .stack-arrow {
    display: grid;
    place-items: center;
    margin: 1.05rem 0;
    color: hsl(var(--bc) / 0.56);
    font-size: 0.78rem;
    font-weight: 750;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .stack-arrow span {
    border: 1px solid rgba(158, 230, 173, 0.2);
    border-radius: 999px;
    padding: 0.45rem 0.75rem;
    background: rgba(17, 18, 28, 0.48);
  }

  .token-card {
    min-height: 12rem;
    border: 1px solid rgba(158, 230, 173, 0.24);
    border-radius: 1rem;
    padding: 1rem;
    background: rgba(158, 230, 173, 0.08);
  }

  .token-card span {
    color: #9ee6ad;
    font-size: clamp(1.25rem, 2.1vw, 1.95rem);
    font-weight: 800;
  }

  .token-card strong {
    display: block;
    margin-top: 0.45rem;
    color: hsl(var(--bc) / 0.72);
  }

  .settlement-core {
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 1rem;
    padding: 1.15rem;
    background: rgba(17, 18, 28, 0.7);
  }

  .settlement-core h2 {
    margin-top: 0.65rem;
    font-size: clamp(1.45rem, 2.1vw, 2.05rem);
    line-height: 1.02;
  }

  .settlement-core ul {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.7rem;
    margin-top: 1.35rem;
    color: hsl(var(--bc) / 0.7);
  }

  .settlement-core li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .settlement-core li :global(svg) {
    flex: none;
    color: #9ee6ad;
  }

  .ticker-band {
    display: grid;
    grid-template-columns: repeat(6, minmax(10rem, 1fr));
    border-block: 1px solid rgba(255, 255, 255, 0.09);
    overflow-x: auto;
    background: rgba(255, 255, 255, 0.035);
  }

  .ticker-band div {
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    padding: 1.1rem 1.25rem;
    color: hsl(var(--bc) / 0.72);
    white-space: nowrap;
  }

  .split-intro,
  .comparison-layout,
  .final-cta {
    display: grid;
    gap: 2rem;
  }

  .split-intro h2,
  .section-heading h2,
  .comparison-layout h2,
  .etc-panel h2,
  .final-cta h2 {
    margin-top: 0.7rem;
    font-size: clamp(2.7rem, 5.2vw, 5.8rem);
    line-height: 0.93;
  }

  .intro-copy,
  .comparison-layout p,
  .etc-panel p {
    color: hsl(var(--bc) / 0.72);
    font-size: 1.08rem;
    line-height: 1.72;
  }

  .intro-copy {
    display: grid;
    gap: 1.2rem;
  }

  .path-grid {
    display: grid;
    gap: 1rem;
  }

  .path-card {
    min-height: 15rem;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 1rem;
    padding: 1.3rem;
    background: rgba(255, 255, 255, 0.045);
    transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
  }

  .path-card:hover {
    transform: translateY(-4px);
    border-color: rgba(158, 230, 173, 0.34);
    background: rgba(158, 230, 173, 0.075);
  }

  .path-card :global(svg) {
    color: #9ee6ad;
    font-size: 2rem;
  }

  .path-card span {
    display: block;
    margin-top: 2.6rem;
    font-size: 1.35rem;
    font-weight: 700;
  }

  .path-card p {
    margin-top: 0.7rem;
    color: hsl(var(--bc) / 0.68);
    line-height: 1.55;
  }

  .section-heading {
    max-width: 58rem;
  }

  .mechanism-visual {
    display: grid;
    gap: 1rem;
    margin-top: 2.4rem;
  }

  .mechanism-column {
    border-radius: 1.15rem;
    padding: clamp(1.3rem, 3vw, 2.25rem);
    background: rgba(255, 255, 255, 0.055);
    border: 1px solid rgba(255, 255, 255, 0.11);
  }

  .mechanism-column.market {
    background: rgba(158, 230, 173, 0.08);
  }

  .mechanism-column span {
    color: #9ee6ad;
    font-weight: 750;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.78rem;
  }

  .mechanism-column h3 {
    margin-top: 0.9rem;
    font-size: clamp(1.75rem, 3vw, 3rem);
    line-height: 1;
  }

  .mechanism-column p {
    margin-top: 1rem;
    color: hsl(var(--bc) / 0.68);
    line-height: 1.68;
  }

  .connector {
    display: grid;
    place-items: center;
    color: #9ee6ad;
    font-weight: 800;
  }

  .connector div {
    border: 1px solid rgba(158, 230, 173, 0.32);
    border-radius: 999px;
    padding: 0.8rem 1rem;
    background: rgba(158, 230, 173, 0.08);
  }

  .comparison-table {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    margin-top: 3rem;
  }

  .comparison-row {
    display: grid;
    grid-template-columns: 0.75fr 1fr 1fr;
    gap: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem 0;
    color: hsl(var(--bc) / 0.68);
  }

  .comparison-row span:first-child {
    color: hsl(var(--bc));
    font-weight: 700;
  }

  .comparison-row strong {
    color: #9ee6ad;
  }

  .etc-panel,
  .final-cta {
    border-radius: 1.25rem;
    border: 1px solid rgba(158, 230, 173, 0.2);
    background:
      radial-gradient(circle at 85% 15%, rgba(158, 230, 173, 0.16), transparent 25rem),
      rgba(255, 255, 255, 0.045);
    padding: clamp(1.4rem, 4vw, 3rem);
  }

  @media (min-width: 768px) {
    .path-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .mechanism-visual {
      grid-template-columns: 1fr auto 1fr;
      align-items: stretch;
    }
  }

  @media (min-width: 1024px) {
    .split-intro,
    .final-cta {
      grid-template-columns: 0.95fr 1.05fr;
      align-items: center;
    }

    .comparison-layout {
      display: block;
    }

    .comparison-layout > div:first-child {
      max-width: 58rem;
    }

    .path-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (max-width: 767px) {
    .hero-mark {
      top: 6rem;
      left: 48%;
      width: 24rem;
      opacity: 0.3;
      transform: translateX(-10%);
    }

    .hero-grid {
      top: 6rem;
      left: 48%;
      width: 24rem;
      opacity: 0.42;
      transform: translateX(-10%);
    }

    .hero-copy h1 {
      font-size: clamp(2.85rem, 12.2vw, 3.55rem);
    }

    .hero-actions {
      flex-direction: column;
    }

    .hero-actions .btn {
      width: 100%;
    }

    .settlement-stage {
      min-height: auto;
    }

    .venue-row,
    .token-orbit,
    .settlement-core ul,
    .comparison-row {
      grid-template-columns: 1fr;
    }

    .ticker-band {
      grid-template-columns: repeat(6, minmax(12rem, 1fr));
    }
  }
</style>
