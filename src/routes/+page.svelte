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

<main class="landing-page min-h-screen overflow-hidden bg-protocol text-base-content">
  <section class="hero relative px-5 pb-16 pt-28 lg:px-12 lg:pb-20">
    <img class="hero-mark" src="/icon.svg" alt="" aria-hidden="true" />
    <div class="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center">
      <div class="hero-copy max-w-5xl">
        <div class="eyebrow">
          <Icon icon="mdi:ethereum" />
          ETC settlement
        </div>

        <h1>The perpetual settlement layer.</h1>

        <p class="hero-subtitle">
          S&F makes perpetual positions work like tokens. You can trade them anywhere, while the protocol handles collateral, prices, funding, and settlement.
        </p>

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
        <span class="section-kicker">Settlement stack</span>
        <h2>The position is portable. Settlement stays canonical.</h2>
      </div>

      <div class="settlement-stage" aria-label="S&F settlement stack">
        <div class="venue-row">
          <div class="venue-pill">S&F App</div>
          <div class="venue-pill">AMMs</div>
          <div class="venue-pill">Market makers</div>
          <div class="venue-pill">Other venues</div>
        </div>

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

        <div class="settlement-core">
          <div>
            <span class="core-label">S&F contracts on ETC</span>
            <h2>Canonical settlement defines what every position token represents.</h2>
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
        <h2>Perps should not be trapped inside venues.</h2>
      </div>
      <div class="intro-copy">
        <p>
          Most perpetual systems make the venue the center of the market. The venue owns the account model, execution path, oracle dependency, liquidation system, and listing surface.
        </p>
        <p>
          S&F moves the center of gravity to the position token. A market can disappear, compete, or route elsewhere without becoming the canonical source of the position.
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
      <h2>Settlement and execution are different jobs.</h2>
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
        <h2>S&F is infrastructure, not only a place to trade.</h2>
        <p>
          dYdX, GMX, and Synthetix-style systems can be strong venues or liquidity networks. S&F is aiming at the lower layer: tokenized perpetual settlement without a single executor, custodian, or price-feed operator in charge.
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
      <h2>Neutral collateral for a neutral settlement layer.</h2>
      <p>
        If S&F is meant to be a common base for perpetual exposure, settlement should not depend on a venue chain, bridge, sequencer, or company-controlled collateral system. ETC is the app-wide settlement asset.
      </p>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 pb-28 pt-14 lg:px-12">
    <div class="final-cta">
      <div>
        <span class="section-kicker">Build the market layer</span>
        <h2>Create execution around tokenized perpetual exposure.</h2>
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
    max-width: 100vw;
    overflow-x: hidden;
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
    background:
      radial-gradient(circle at 8% 22%, rgba(150, 232, 174, 0.18), transparent 30rem),
      radial-gradient(circle at 82% 28%, rgba(147, 108, 255, 0.16), transparent 28rem);
  }

  .hero-mark {
    position: absolute;
    top: 7rem;
    right: max(-1rem, calc((100vw - 92rem) / 2));
    width: min(54vw, 48rem);
    aspect-ratio: 1;
    opacity: 0.34;
    pointer-events: none;
    user-select: none;
    mix-blend-mode: screen;
    filter:
      sepia(0.42)
      saturate(3.2)
      hue-rotate(62deg)
      brightness(1.28)
      drop-shadow(0 34px 100px rgba(158, 230, 173, 0.34));
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
    max-width: 72rem;
    font-size: clamp(3.55rem, 6.7vw, 7.1rem);
    line-height: 0.92;
    overflow-wrap: break-word;
  }

  .hero-subtitle {
    max-width: 50rem;
    margin-top: 1.25rem;
    color: hsl(var(--bc) / 0.74);
    font-size: clamp(1.05rem, 1.7vw, 1.35rem);
    line-height: 1.55;
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
    margin-bottom: 1.4rem;
    border: 1px solid rgba(158, 230, 173, 0.34);
    border-radius: 999px;
    padding: 0.65rem 0.9rem;
    background: rgba(158, 230, 173, 0.08);
  }

  .hero-actions,
  .final-actions {
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
  .settlement-core {
    position: relative;
    z-index: 1;
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
    margin: 2.25rem 0 1.6rem;
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
      right: -5rem;
      width: 22rem;
      opacity: 0.18;
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
