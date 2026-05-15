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

  const heroFlow = [
    {
      title: "Trade anywhere",
      text: "Apps, AMMs, and market makers compete on execution.",
      icon: "mdi:swap-horizontal",
    },
    {
      title: "Hold tokens",
      text: "Wallet balances represent portable long or short exposure.",
      icon: "mdi:wallet-outline",
    },
    {
      title: "Settle once",
      text: "Oracle rounds and ETC collateral define canonical value.",
      icon: "mdi:database-check-outline",
    },
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
  <link rel="canonical" href="https://stipflip.xyz/" />
  <meta property="og:title" content="Stip & Flip | Perpetual Settlement Layer" />
  <meta
    property="og:description"
    content="Stip & Flip is the settlement layer for tokenized perpetual markets on ETC."
  />
  <meta property="og:url" content="https://stipflip.xyz/" />
  <meta property="og:image" content="https://stipflip.xyz/og-preview.png" />
  <meta
    property="og:image:secure_url"
    content="https://stipflip.xyz/og-preview.png"
  />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta
    property="og:image:alt"
    content="Stip & Flip - perpetual markets that settle like tokens."
  />
  <meta name="twitter:title" content="Stip & Flip | Perpetual Settlement Layer" />
  <meta
    name="twitter:description"
    content="Stip & Flip is the settlement layer for tokenized perpetual markets on ETC."
  />
  <meta name="twitter:image" content="https://stipflip.xyz/og-preview.png" />
</svelte:head>

<main class="landing-page min-h-screen overflow-x-hidden bg-protocol">
  <section class="hero relative px-5 pb-16 pt-24 lg:px-12 lg:pb-20">
    <img class="hero-mark" src="/icon.svg" alt="" aria-hidden="true" />
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="hero-shell mx-auto min-h-[calc(100vh-6rem)] max-w-[1384px]">
      <div class="hero-copy">
        <div class="eyebrow">
          <Icon icon="mdi:infinity" />
          The perpetual settlement layer
        </div>

        <h1>Perpetual markets that settle like tokens.</h1>

        <p class="hero-subtitle">
          S&F turns perp exposure into wallet-held position tokens. Trade can happen anywhere, while collateral, prices, funding, and settlement stay canonical.
        </p>

        <div class="hero-actions">
          <a class="sprinter-button primary" href="/swap">
            Launch App
            <Icon icon="mdi:arrow-right" />
          </a>
          <a
            class="sprinter-button secondary"
            href="https://docs.stipflip.xyz/docs/general-overview/core-thesis"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Thesis
          </a>
        </div>
      </div>

      <div class="hero-side" aria-label="Protocol flow">
        <div class="flow-panel">
          <div class="flow-panel-header">
            <span>Execution is separate from settlement</span>
          </div>

          <div class="flow-lanes">
            {#each heroFlow as step, index}
              <div class="flow-step">
                <div class="flow-icon">
                  <Icon icon={step.icon} />
                </div>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </div>
              {#if index < heroFlow.length - 1}
                <div class="flow-rail" aria-hidden="true"></div>
              {/if}
            {/each}
          </div>

          <div class="token-strip" aria-label="Example position tokens">
            <span>S-BTC</span>
            <span>F-ETH²</span>
            <span>S-SOL³</span>
          </div>
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
    <div class="ticker-track">
      <span>No company operator</span>
      <span>Open oracle</span>
      <span>No trader liquidation engine</span>
      <span>Permissionless markets</span>
      <span>Portable positions</span>
      <span>ETC collateral</span>
      <span>No company operator</span>
      <span>Open oracle</span>
      <span>No trader liquidation engine</span>
      <span>Permissionless markets</span>
      <span>Portable positions</span>
      <span>ETC collateral</span>
    </div>
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
    color: #242424;
  }

  .bg-protocol {
    background: #efefef;
  }

  .hero {
    isolation: isolate;
    color: #242424;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0)),
      #efefef;
  }

  .hero::before {
    position: absolute;
    inset: auto 0 0;
    z-index: 0;
    height: 58%;
    content: "";
    background:
      linear-gradient(rgba(36, 36, 36, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(36, 36, 36, 0.08) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: linear-gradient(to top, black, transparent);
    opacity: 0.5;
    pointer-events: none;
  }

  .hero::after {
    position: absolute;
    inset: auto -10rem -18rem auto;
    z-index: 0;
    width: 38rem;
    height: 38rem;
    content: "";
    background:
      linear-gradient(rgba(36, 36, 36, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(36, 36, 36, 0.08) 1px, transparent 1px);
    background-color: #c6d8e2;
    background-size: 28px 28px;
    border-radius: 24px;
    rotate: 12deg;
    opacity: 0.6;
    pointer-events: none;
  }

  .hero-mark {
    position: absolute;
    z-index: 1;
    right: -10rem;
    bottom: -8rem;
    width: min(60vw, 48rem);
    aspect-ratio: 1;
    opacity: 0.08;
    pointer-events: none;
    user-select: none;
    filter: grayscale(1) contrast(1.3);
  }

  .hero-grid {
    position: absolute;
    z-index: 1;
    right: max(1.5rem, calc((100vw - 1384px) / 2));
    bottom: 3rem;
    width: min(42vw, 34rem);
    height: min(42vw, 34rem);
    background:
      linear-gradient(90deg, rgba(36, 36, 36, 0.16) 1px, transparent 1px),
      linear-gradient(0deg, rgba(36, 36, 36, 0.14) 1px, transparent 1px),
      radial-gradient(circle at 38% 36%, rgba(158, 230, 173, 0.55), transparent 18rem);
    background-size: 2.4rem 2.4rem, 2.4rem 2.4rem, auto;
    opacity: 0.52;
    mask-image: radial-gradient(circle, black, transparent 72%);
    pointer-events: none;
  }

  .hero-shell {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 28rem);
    gap: clamp(2rem, 5vw, 5rem);
    align-items: center;
  }

  .hero-copy {
    max-width: 52rem;
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
    color: inherit;
  }

  .hero-copy h1 {
    position: relative;
    z-index: 2;
    max-width: 50rem;
    font-size: clamp(3.2rem, 7.2vw, 6.9rem);
    line-height: 0.91;
    overflow-wrap: break-word;
  }

  .hero-subtitle {
    position: relative;
    z-index: 2;
    max-width: 45rem;
    margin-top: 1.35rem;
    color: #6c6c6c;
    font-size: clamp(1.02rem, 1.55vw, 1.25rem);
    line-height: 1.5;
  }

  .eyebrow,
  .section-kicker,
  .core-label {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: #4d805b;
    font-size: 0.78rem;
    font-weight: 750;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .eyebrow {
    position: relative;
    z-index: 2;
    margin-bottom: 1.4rem;
    border: 1px solid rgba(36, 36, 36, 0.1);
    border-radius: 999px;
    padding: 0.7rem 0.95rem;
    background: rgba(255, 255, 255, 0.58);
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

  .sprinter-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    border-radius: 999px;
    padding: 0.86rem 1.2rem;
    font-size: clamp(1rem, 1.2vw, 1.18rem);
    font-weight: 750;
    line-height: 1.15;
    transition: opacity 160ms ease, transform 160ms ease;
  }

  .sprinter-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .sprinter-button.primary {
    color: #efefef;
    background: #4d805b;
  }

  .sprinter-button.secondary {
    color: #efefef;
    background: #242424;
  }

  .hero-side {
    position: relative;
    z-index: 2;
  }

  .flow-panel {
    display: grid;
    gap: 1.25rem;
    border-radius: 24px;
    padding: clamp(1.15rem, 2.5vw, 1.65rem);
    color: #242424;
    background: #e5e5e5;
    box-shadow: 0 26px 80px rgba(36, 36, 36, 0.1);
  }

  .flow-panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid rgba(36, 36, 36, 0.1);
    padding-bottom: 1rem;
  }

  .flow-panel-header span {
    max-width: 14rem;
    color: #7a7a7a;
    font-size: 0.92rem;
    line-height: 1.35;
  }

  .flow-lanes {
    display: grid;
  }

  .flow-step {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.45);
    padding: 1rem;
  }

  .flow-icon {
    display: grid;
    flex: none;
    width: 2.6rem;
    height: 2.6rem;
    place-items: center;
    border-radius: 12px;
    color: #efefef;
    background: #242424;
  }

  .flow-icon :global(svg) {
    font-size: 1.35rem;
  }

  .flow-step strong {
    display: block;
    font-size: 1.1rem;
    line-height: 1.15;
  }

  .flow-step p {
    margin-top: 0.35rem;
    color: #707070;
    font-size: 0.94rem;
    line-height: 1.4;
  }

  .flow-rail {
    width: 2px;
    height: 1.2rem;
    margin-left: 2.25rem;
    background: linear-gradient(#4d805b, rgba(77, 128, 91, 0.1));
  }

  .token-strip {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.55rem;
    border-top: 1px solid rgba(36, 36, 36, 0.1);
    padding-top: 1rem;
  }

  .token-strip span {
    border-radius: 999px;
    padding: 0.65rem 0.55rem;
    text-align: center;
    color: #4d805b;
    background: #9ee6ad;
    font-weight: 800;
    font-size: 0.9rem;
  }

  .visual-hero {
    color: #efefef;
    background:
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      #242424;
    background-size: 44px 44px, 44px 44px, auto;
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
      linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035)),
      #2b2b2b;
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
    color: rgba(239, 239, 239, 0.72);
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
    color: rgba(239, 239, 239, 0.56);
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
    border: 1px solid rgba(198, 216, 226, 0.22);
    border-radius: 16px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.055);
  }

  .token-card span {
    color: #9ee6ad;
    font-size: clamp(1.25rem, 2.1vw, 1.95rem);
    font-weight: 800;
  }

  .token-card strong {
    display: block;
    margin-top: 0.45rem;
    color: rgba(239, 239, 239, 0.72);
  }

  .settlement-core {
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 16px;
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
    color: rgba(239, 239, 239, 0.7);
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
    border-block: 1px solid rgba(36, 36, 36, 0.1);
    overflow-x: auto;
    background: #d8e5df;
  }

  .ticker-track {
    display: flex;
    width: max-content;
    gap: 3rem;
    padding: 1.35rem 1.5rem;
    animation: ticker-scroll 36s linear infinite;
  }

  .ticker-track span {
    color: #255976;
    font-weight: 750;
    white-space: nowrap;
  }

  @keyframes ticker-scroll {
    from {
      transform: translateX(0);
    }

    to {
      transform: translateX(-50%);
    }
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
    color: #6c6c6c;
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
    border: 1px solid rgba(36, 36, 36, 0.08);
    border-radius: 24px;
    padding: 1.3rem;
    color: #242424;
    background: #e5e5e5;
    overflow: hidden;
    transition: transform 160ms ease, color 160ms ease, background 160ms ease;
  }

  .path-card:hover {
    transform: translateY(-4px);
    color: #efefef;
    background: #4d805b;
  }

  .path-card :global(svg) {
    color: #4d805b;
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
    color: #707070;
    line-height: 1.55;
  }

  .path-card:hover :global(svg),
  .path-card:hover p {
    color: rgba(239, 239, 239, 0.78);
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
    border-radius: 24px;
    padding: clamp(1.3rem, 3vw, 2.25rem);
    color: #242424;
    background: #e5e5e5;
    border: 1px solid rgba(36, 36, 36, 0.08);
  }

  .mechanism-column.market {
    background: #d8e5df;
  }

  .mechanism-column span {
    color: #4d805b;
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
    color: #707070;
    line-height: 1.68;
  }

  .connector {
    display: grid;
    place-items: center;
    color: #4d805b;
    font-weight: 800;
  }

  .connector div {
    border: 1px solid rgba(77, 128, 91, 0.28);
    border-radius: 999px;
    padding: 0.8rem 1rem;
    background: #d8e5df;
  }

  .comparison-table {
    border-top: 1px solid rgba(36, 36, 36, 0.1);
    margin-top: 3rem;
  }

  .comparison-row {
    display: grid;
    grid-template-columns: 0.75fr 1fr 1fr;
    gap: 1rem;
    border-bottom: 1px solid rgba(36, 36, 36, 0.1);
    padding: 1rem 0;
    color: #707070;
  }

  .comparison-row span:first-child {
    color: #242424;
    font-weight: 700;
  }

  .comparison-row strong {
    color: #4d805b;
  }

  .etc-panel,
  .final-cta {
    border-radius: 24px;
    border: 1px solid rgba(36, 36, 36, 0.08);
    background:
      linear-gradient(135deg, rgba(216, 229, 223, 0.92), rgba(229, 229, 229, 0.94)),
      #e5e5e5;
    color: #242424;
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
    .hero-shell {
      grid-template-columns: 1fr;
      align-content: center;
      gap: 2rem;
    }

    .hero-mark {
      right: -9rem;
      bottom: 8rem;
      width: 28rem;
      opacity: 0.06;
    }

    .hero-grid {
      right: -8rem;
      bottom: 8rem;
      width: 24rem;
      height: 24rem;
      opacity: 0.32;
    }

    .hero-copy h1 {
      font-size: clamp(2.95rem, 12vw, 3.55rem);
    }

    .hero-actions {
      flex-direction: column;
    }

    .sprinter-button {
      width: 100%;
    }

    .hero-side {
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

    .ticker-track {
      animation-duration: 44s;
    }
  }
</style>
