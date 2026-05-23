<script lang="ts">
  import Icon from "@iconify/svelte";
  import Logo from "src/components/logo.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
  });

  const companyServices = [
    {
      title: "B2B onboarding",
      icon: "mdi:account-tie-outline",
      text: "S&F helps brokers, wallets, fintech apps, market makers, and digital asset venues understand the protocol, choose their role, and launch around Stipflip.",
    },
    {
      title: "Technical implementation",
      icon: "mdi:tools",
      text: "S&F provides developer tools, API guidance, market setup, oracle integration support, monitoring, dashboards, and implementation assistance for production deployments.",
    },
    {
      title: "Compliance package",
      icon: "mdi:file-document-check-outline",
      text: "S&F prepares protocol documentation, risk mapping, MiCA/MiFID analysis support, transparency reports, and materials legal teams need to evaluate their service model.",
    },
    {
      title: "Operator playbooks",
      icon: "mdi:book-cog-outline",
      text: "S&F designs playbooks for venues, liquidity providers, market makers, oracle participants, and application builders operating around the public protocol.",
    },
    {
      title: "Ecosystem growth",
      icon: "mdi:source-branch-sync",
      text: "S&F coordinates builders, reference markets, liquidity experiments, public documentation, and partner support so the public good becomes useful financial infrastructure.",
    },
    {
      title: "Enterprise support",
      icon: "mdi:lifebuoy",
      text: "S&F monetizes professional support, onboarding, analytics, monitoring, technical services, and implementation work around a protocol it does not control.",
    },
  ];

  const architecture = [
    "No operator",
    "No admin keys",
    "No custodial venue",
    "No balance-sheet counterparty",
    "Fully collateralized exposure",
    "Protocol-level settlement",
  ];

  const roadmap = [
    ["0-3 months", "Luxembourg setup, MiCA/MiFID legal memo, protocol risk mapping, onboarding materials"],
    ["3-6 months", "First company onboarding, operator tooling, market-maker sandbox, monitoring, analytics"],
    ["6-12 months", "Production support, reference markets, compliance documentation, ecosystem partnerships"],
  ];

  const assets = [
    ["Public good", "Stipflip is permissionless infrastructure created by S&F but not controlled by S&F"],
    ["Protocol", "Collateral, issuance, redemption, oracle rounds, funding, and settlement are public protocol rules"],
    ["Product", "The app surface already exposes wallet, swap, earn, oracle, and market flows"],
    ["Company layer", "S&F provides onboarding, consultancy, implementation, compliance documentation, tooling, analytics, and ecosystem support"],
  ];

  const regulatoryRisks = [
    ["Custody", "Users hold wallet position tokens instead of venue account balances"],
    ["Counterparty", "Exposure is fully collateralized instead of promised by an operator balance sheet"],
    ["Control", "No admin keys or privileged venue can become the hidden market controller"],
    ["Settlement", "Value is settled by code, collateral, and oracle rounds instead of discretionary venue logic"],
  ];

  const marketStats = [
    ["2025 CEX perp volume", "$86.2T"],
    ["2025 perp DEX volume", "$6.7T"],
    ["Perp DEX growth", "+346%"],
  ];

  const participants = [
    {
      title: "Market makers",
      role: "Arbitrage and liquidity",
      text: "Quote markets, manage inventory, arbitrage settlement value against market prices, and capture spreads around oracle-round timing.",
      className: "market-makers",
    },
    {
      title: "Liquidity providers",
      role: "Funding and fees",
      text: "Deploy collateral into protocol pools, choose activation rates, and earn funding and fees for underwriting transparent exposure.",
      className: "liquidity-providers",
    },
    {
      title: "Trading venues",
      role: "New client products",
      text: "Offer perpetual exposure to existing clients with public settlement infrastructure underneath their own interface.",
      className: "trading-venues",
    },
    {
      title: "Wallets and fintech apps",
      role: "Embedded exposure",
      text: "Add wallet-held exposure products where users keep positions as transferable tokens.",
      className: "wallets",
    },
    {
      title: "Oracle/data providers",
      role: "Price rewards",
      text: "Stake into oracle rounds, submit prices, earn rewards, and secure canonical settlement value.",
      className: "oracle-providers",
    },
    {
      title: "Product builders",
      role: "New financial products",
      text: "Build automated markets, aggregators, structured products, agents, risk dashboards, routing systems, and custom execution.",
      className: "product-builders",
    },
  ];
</script>

<svelte:head>
  <title>S&F | Fit 4 Start Pitch</title>
  <meta
    name="description"
    content="S&F created Stipflip as public-good settlement infrastructure for compliant tokenized exposure."
  />
</svelte:head>

<main class="pitch-page">
  <section class="hero relative px-5 pb-16 pt-28 lg:px-12 lg:pb-20">
    <img class="hero-mark" src="/icon.svg" alt="" aria-hidden="true" />
    <div class="hero-grid" aria-hidden="true"></div>

    <div class="hero-shell mx-auto min-h-[calc(100vh-7rem)] max-w-[1384px]">
      <div class="hero-copy">
        <div class="eyebrow">
          <Icon icon="mdi:shield-check-outline" />
          Fit 4 Start Digital pitch
        </div>

        <h1>Public-good settlement infrastructure for tokenized exposure.</h1>

        <p class="hero-subtitle">
          Perpetuals are one of digital assets' largest markets. European financial actors need compliant infrastructure to compete. S&F created Stipflip: a public-good perpetual protocol with no operator, no admin keys, no custodial venue, and no counterparty risk.
        </p>

        <div class="hero-actions">
          <a class="sprinter-button primary" href="#memo">Read memo</a>
          <a class="sprinter-button secondary" href="#regulation">Regulatory thesis</a>
        </div>
      </div>

      <aside class="hero-side" aria-label="Pitch summary">
        <div class="summary-panel">
          <span class="panel-kicker">Core distinction</span>
          <div class="summary-row">
            <span>Stipflip</span>
            <strong>Permissionless public-good perpetual protocol</strong>
          </div>
          <div class="summary-row">
            <span>S&F</span>
            <strong>Creator and ecosystem company, not protocol operator</strong>
          </div>
          <div class="summary-row">
            <span>Market</span>
            <strong>Fully collateralized synthetic exposure without a trusted venue</strong>
          </div>
        </div>
      </aside>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-20 lg:px-12 lg:py-28">
    <div class="market-lead">
      <div>
        <span class="section-kicker">The European opportunity</span>
        <h2>Perpetuals are massive. Europe needs infrastructure it can actually use.</h2>
      </div>
      <div class="market-stat-grid">
        {#each marketStats as stat (stat[0])}
          <div class="market-stat">
            <strong>{stat[1]}</strong>
            <span>{stat[0]}</span>
          </div>
        {/each}
      </div>
      <p>
        The perpetuals market is dominated by offshore venues and trusted operators. European brokers, wallets, fintech apps, market makers, and digital asset venues have distribution and clients, but they lack a public settlement layer that removes custody, counterparty, admin-key, and opaque settlement risk.
      </p>
      <p>
        Stipflip gives European actors a way into this market: fully collateralized synthetic exposure, wallet-held position tokens, transparent collateral, and settlement by public protocol rules.
      </p>
      <span class="source-note">Market figures: CoinGecko 2025 Annual Crypto Industry Report.</span>
    </div>
  </section>

  <section class="dark-band px-5 py-20 lg:px-12 lg:py-28" id="memo">
    <div class="mx-auto max-w-7xl">
      <div class="visual-section-heading">
        <span class="section-kicker">Investment memo</span>
        <h2>A perpetual protocol without an operator.</h2>
      </div>

      <div class="thesis-stage">
        <div class="thesis-copy">
          <span class="core-label">The thesis</span>
          <h3>
            Most perpetual markets introduce a trusted venue: an exchange, clearing engine, admin-controlled protocol, or balance-sheet counterparty. Stipflip removes that role.
          </h3>
        </div>
        <div class="architecture-grid">
          {#each architecture as item (item)}
            <div class="architecture-item">
              <Icon icon="mdi:check-circle" />
              <span>{item}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <section class="ticker-band" aria-label="Pitch attributes">
    <div class="ticker-track">
      <span>Zero counterparty risk thesis</span>
      <span>Public-good protocol</span>
      <span>No admin keys</span>
      <span>No custodial operator</span>
      <span>MiCA and MiFID compliance gain</span>
      <span>Luxembourg fintech infrastructure</span>
      <span>Zero counterparty risk thesis</span>
      <span>Public-good protocol</span>
      <span>No admin keys</span>
      <span>No custodial operator</span>
      <span>MiCA and MiFID compliance gain</span>
      <span>Luxembourg fintech infrastructure</span>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-12 lg:px-12">
    <div class="market-panel">
      <span class="section-kicker">What S&F does</span>
      <h2>Help European companies build around the public-good protocol.</h2>
      <p>
        Stipflip is public infrastructure. S&F is the company that makes it usable for professional actors: consultancy, company onboarding, implementation support, protocol documentation, compliance materials, monitoring, analytics, and operator playbooks.
      </p>
      <p>
        Venues can build execution, interfaces, routing, liquidity, risk controls, and customer relationships around Stipflip. S&F helps them reach production without building a full perpetual exchange stack from scratch.
      </p>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-10 lg:px-12">
    <div class="proof-grid">
      {#each companyServices as point (point.title)}
        <article class="proof-card">
          <Icon icon={point.icon} />
          <span>{point.title}</span>
          <p>{point.text}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-24 lg:px-12">
    <div class="participants-section">
      <div class="participants-heading">
        <span class="section-kicker">Who builds around it</span>
        <h2>A public-good protocol creates opportunities for more than venues.</h2>
        <p>
          Stipflip separates settlement from execution. Market makers, liquidity providers, venues, wallets, data providers, and builders can specialize around the same public settlement layer.
        </p>
      </div>
      <div class="ecosystem-map" aria-label="Stipflip ecosystem roles">
        <div class="orbit-ring" aria-hidden="true"></div>
        <div class="orbit-line line-market-makers" aria-hidden="true"></div>
        <div class="orbit-line line-trading-venues" aria-hidden="true"></div>
        <div class="orbit-line line-oracle-providers" aria-hidden="true"></div>
        <div class="orbit-line line-product-builders" aria-hidden="true"></div>
        <div class="orbit-line line-liquidity-providers" aria-hidden="true"></div>
        <div class="orbit-line line-wallets" aria-hidden="true"></div>

        <div class="ecosystem-center">
          <div class="center-logo" aria-label="Stipflip">
            <Logo width="8rem" height="8rem" />
          </div>
          <strong>Public-good settlement protocol</strong>
          <p>No operator · No admin keys · No counterparty risk</p>
        </div>

        {#each participants as participant (participant.title)}
          <article class={`ecosystem-node ${participant.className}`}>
            <span>{participant.title}</span>
            <strong>{participant.role}</strong>
            <p>{participant.text}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-24 lg:px-12" id="regulation">
    <div class="regulatory-panel">
      <span class="section-kicker">MiCA / MiFID gain</span>
      <h2>Stipflip removes the operator risks that make perpetual markets hard to supervise.</h2>
      <p>
        MiCA and MiFID are difficult for perpetual markets because the usual model combines many risk-heavy functions in one venue: custody, execution, pricing, liquidation, counterparty exposure, admin control, and settlement. Stipflip changes that market structure. Settlement is defined by code, collateral, and oracle rounds, not by a company balance sheet or discretionary intermediary.
      </p>
      <div class="regulatory-columns">
        {#each regulatoryRisks as risk (risk[0])}
          <div>
            <strong>{risk[0]}</strong>
            <p>{risk[1]}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-16 lg:px-12">
    <div class="evidence-layout">
      <div>
        <span class="section-kicker">Current foundation</span>
        <h2>S&F has already created the public protocol it is applying to grow.</h2>
      </div>
      <div class="evidence-table">
        {#each assets as row (row[0])}
          <div class="evidence-row">
            <span>{row[0]}</span>
            <strong>{row[1]}</strong>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-5 py-24 lg:px-12">
    <div class="roadmap-panel">
      <span class="section-kicker">Use of Fit 4 Start</span>
      <h2>Turn an operatorless perpetual protocol into European financial infrastructure.</h2>
      <div class="roadmap-grid">
        {#each roadmap as step (step[0])}
          <div class="roadmap-card">
            <span>{step[0]}</span>
            <p>{step[1]}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>
</main>

<style>
  :global(.root:has(.pitch-page)) {
    height: auto;
    min-height: 100vh;
    max-width: 100vw;
    overflow-x: hidden;
    overflow-y: visible;
  }

  .pitch-page {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    color: #242424;
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
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 30rem);
    gap: clamp(2rem, 5vw, 5rem);
    align-items: center;
  }

  .hero-copy {
    max-width: 58rem;
  }

  .hero-copy h1,
  .visual-section-heading h2,
  .regulatory-panel h2,
  .evidence-layout h2,
  .roadmap-panel h2 {
    font-weight: 650;
    letter-spacing: 0;
    color: inherit;
  }

  .hero-copy h1 {
    position: relative;
    z-index: 2;
    max-width: 57rem;
    font-size: clamp(3rem, 6.8vw, 6.7rem);
    line-height: 0.91;
    overflow-wrap: break-word;
  }

  .hero-subtitle {
    position: relative;
    z-index: 2;
    max-width: 48rem;
    margin-top: 1.35rem;
    color: #6c6c6c;
    font-size: clamp(1.02rem, 1.55vw, 1.25rem);
    line-height: 1.5;
  }

  .eyebrow,
  .section-kicker,
  .panel-kicker,
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

  .hero-actions {
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

  .summary-panel {
    display: grid;
    gap: 1rem;
    border-radius: 24px;
    padding: clamp(1.15rem, 2.5vw, 1.65rem);
    color: #242424;
    background: #e5e5e5;
    box-shadow: 0 26px 80px rgba(36, 36, 36, 0.1);
  }

  .summary-row {
    border-radius: 16px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.48);
  }

  .summary-row span {
    display: block;
    color: #4d805b;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .summary-row strong {
    display: block;
    margin-top: 0.45rem;
    font-size: 1.05rem;
    line-height: 1.25;
  }

  .dark-band {
    color: #efefef;
    background:
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      #242424;
    background-size: 44px 44px, 44px 44px, auto;
  }

  .market-lead {
    display: grid;
    gap: 1.4rem;
  }

  .market-lead h2 {
    margin-top: 0.7rem;
    max-width: 72rem;
    color: #242424;
    font-size: clamp(2.7rem, 5.6vw, 6rem);
    font-weight: 650;
    letter-spacing: 0;
    line-height: 0.93;
  }

  .market-lead p {
    max-width: 72rem;
    color: #6c6c6c;
    font-size: 1.08rem;
    line-height: 1.72;
  }

  .market-stat-grid {
    display: grid;
    gap: 1rem;
  }

  .market-stat {
    min-height: 11rem;
    border: 1px solid rgba(36, 36, 36, 0.08);
    border-radius: 24px;
    padding: 1.25rem;
    background:
      linear-gradient(135deg, rgba(216, 229, 223, 0.92), rgba(229, 229, 229, 0.94)),
      #e5e5e5;
  }

  .market-stat strong {
    display: block;
    color: #4d805b;
    font-size: clamp(2.6rem, 5vw, 5rem);
    font-weight: 800;
    line-height: 0.95;
  }

  .market-stat span {
    display: block;
    margin-top: 1rem;
    color: #242424;
    font-size: 1rem;
    font-weight: 750;
  }

  .source-note {
    color: #707070;
    font-size: 0.88rem;
  }

  .visual-section-heading {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .visual-section-heading h2 {
    max-width: 60rem;
    font-size: clamp(2.6rem, 5.5vw, 6rem);
    line-height: 0.94;
  }

  .thesis-stage {
    position: relative;
    display: grid;
    gap: 1.5rem;
    border-radius: 1.4rem;
    padding: clamp(1.1rem, 3vw, 2.5rem);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035)),
      #2b2b2b;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 38px 100px rgba(0, 0, 0, 0.22);
    overflow: hidden;
  }

  .thesis-stage::before {
    position: absolute;
    inset: 12%;
    content: "";
    background:
      linear-gradient(rgba(158, 230, 173, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(158, 230, 173, 0.08) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(circle, black, transparent 74%);
  }

  .thesis-copy,
  .architecture-grid {
    position: relative;
    z-index: 1;
  }

  .thesis-copy h3 {
    max-width: 65rem;
    margin-top: 0.85rem;
    font-size: clamp(1.6rem, 3vw, 3rem);
    line-height: 1.04;
  }

  .architecture-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .architecture-item {
    display: flex;
    gap: 0.65rem;
    align-items: center;
    min-height: 4.6rem;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 16px;
    padding: 1rem;
    color: rgba(239, 239, 239, 0.76);
    background: rgba(17, 18, 28, 0.55);
  }

  .architecture-item :global(svg) {
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
    animation: ticker-scroll 42s linear infinite;
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

  .evidence-layout {
    display: grid;
    gap: 2rem;
  }

  .regulatory-panel h2,
  .evidence-layout h2,
  .roadmap-panel h2 {
    margin-top: 0.7rem;
    font-size: clamp(2.7rem, 5.2vw, 5.8rem);
    line-height: 0.93;
  }

  .regulatory-panel > p,
  .roadmap-card p {
    color: #6c6c6c;
    font-size: 1.08rem;
    line-height: 1.72;
  }

  .proof-grid {
    display: grid;
    gap: 1rem;
  }

  .proof-card {
    min-height: 16rem;
    border: 1px solid rgba(36, 36, 36, 0.08);
    border-radius: 24px;
    padding: 1.3rem;
    color: #242424;
    background: #e5e5e5;
    overflow: hidden;
    transition: transform 160ms ease, color 160ms ease, background 160ms ease;
  }

  .proof-card:hover {
    transform: translateY(-4px);
    color: #efefef;
    background: #4d805b;
  }

  .proof-card :global(svg) {
    color: #4d805b;
    font-size: 2rem;
  }

  .proof-card span {
    display: block;
    margin-top: 2.6rem;
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.1;
  }

  .proof-card p {
    margin-top: 0.7rem;
    color: #707070;
    line-height: 1.55;
  }

  .proof-card:hover :global(svg),
  .proof-card:hover p {
    color: rgba(239, 239, 239, 0.78);
  }

  .participants-section {
    display: grid;
    gap: 2rem;
  }

  .participants-heading h2 {
    max-width: 68rem;
    margin-top: 0.7rem;
    color: #242424;
    font-size: clamp(2.7rem, 5.2vw, 5.8rem);
    font-weight: 650;
    letter-spacing: 0;
    line-height: 0.93;
  }

  .participants-heading p {
    max-width: 62rem;
    margin-top: 1rem;
    color: #6c6c6c;
    font-size: 1.08rem;
    line-height: 1.72;
  }

  .ecosystem-map {
    position: relative;
    margin-top: 3.5rem;
    min-height: 48rem;
  }

  .ecosystem-map::before {
    position: absolute;
    inset: 9%;
    content: "";
    background:
      linear-gradient(rgba(77, 128, 91, 0.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(77, 128, 91, 0.12) 1px, transparent 1px);
    background-size: 32px 32px;
    border-radius: 24px;
    opacity: 0.7;
    pointer-events: none;
    mask-image: radial-gradient(circle, black, transparent 74%);
  }

  .orbit-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 0;
    width: min(48rem, 82vw);
    aspect-ratio: 1;
    border: 1px solid rgba(77, 128, 91, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background:
      radial-gradient(circle, rgba(158, 230, 173, 0.18), transparent 28%),
      radial-gradient(circle, transparent 58%, rgba(198, 216, 226, 0.4) 59%, transparent 60%);
    pointer-events: none;
  }

  .orbit-ring::before,
  .orbit-ring::after {
    position: absolute;
    inset: 12%;
    content: "";
    border: 1px solid rgba(36, 36, 36, 0.08);
    border-radius: 50%;
  }

  .orbit-ring::after {
    inset: 29%;
    border-color: rgba(77, 128, 91, 0.18);
  }

  .orbit-line {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 0;
    width: min(16rem, 24vw);
    height: 2px;
    transform-origin: left center;
    background: linear-gradient(90deg, rgba(77, 128, 91, 0.68), rgba(77, 128, 91, 0));
    pointer-events: none;
  }

  .orbit-line::after {
    position: absolute;
    top: 50%;
    right: -0.1rem;
    width: 0.42rem;
    height: 0.42rem;
    content: "";
    border-top: 2px solid rgba(77, 128, 91, 0.58);
    border-right: 2px solid rgba(77, 128, 91, 0.58);
    transform: translateY(-50%) rotate(45deg);
  }

  .line-market-makers {
    transform: rotate(-90deg);
  }

  .line-trading-venues {
    transform: rotate(-30deg);
  }

  .line-oracle-providers {
    transform: rotate(30deg);
  }

  .line-product-builders {
    transform: rotate(90deg);
  }

  .line-liquidity-providers {
    transform: rotate(150deg);
  }

  .line-wallets {
    transform: rotate(210deg);
  }

  .ecosystem-node,
  .ecosystem-center {
    position: relative;
    z-index: 1;
    border: 1px solid rgba(36, 36, 36, 0.08);
    border-radius: 24px;
    padding: 1.2rem;
    background: #e5e5e5;
  }

  .ecosystem-node {
    position: absolute;
    width: min(17rem, 28vw);
    min-height: 12rem;
    transform: translate(-50%, -50%);
    box-shadow: 0 18px 50px rgba(36, 36, 36, 0.08);
  }

  .ecosystem-center {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    width: min(22rem, 48vw);
    min-height: min(22rem, 48vw);
    place-items: center;
    text-align: center;
    background:
      linear-gradient(135deg, rgba(216, 229, 223, 0.96), rgba(158, 230, 173, 0.36)),
      #d8e5df;
    box-shadow: 0 24px 80px rgba(36, 36, 36, 0.12);
    transform: translate(-50%, -50%);
  }

  .ecosystem-node span {
    display: block;
    color: #4d805b;
    font-size: 1.2rem;
    font-weight: 800;
    line-height: 1.12;
  }

  .center-logo {
    display: grid;
    width: min(8rem, 48%);
    aspect-ratio: 1;
    place-items: center;
    border-radius: 50%;
    background: rgba(158, 230, 173, 0.2);
    filter: drop-shadow(0 12px 26px rgba(36, 36, 36, 0.12));
  }

  .center-logo :global(svg) {
    width: 100%;
    height: 100%;
    color: #4d805b;
    opacity: 0.58;
  }

  .center-logo :global(g) {
    fill: currentColor;
  }

  .ecosystem-node strong,
  .ecosystem-center strong {
    display: block;
    margin-top: 0.55rem;
    color: #242424;
    font-size: 0.95rem;
  }

  .ecosystem-center strong {
    font-size: 1.1rem;
  }

  .ecosystem-node p,
  .ecosystem-center p {
    margin-top: 0.8rem;
    color: #707070;
    line-height: 1.58;
  }

  .ecosystem-center p {
    color: #4d805b;
    font-weight: 750;
  }

  .ecosystem-node.market-makers {
    top: 5%;
    left: 50%;
  }

  .ecosystem-node.trading-venues {
    top: 29%;
    left: 87%;
  }

  .ecosystem-node.oracle-providers {
    top: 71%;
    left: 87%;
  }

  .ecosystem-node.product-builders {
    top: 95%;
    left: 50%;
  }

  .ecosystem-node.liquidity-providers {
    top: 71%;
    left: 13%;
  }

  .ecosystem-node.wallets {
    top: 29%;
    left: 13%;
  }

  .regulatory-panel,
  .market-panel,
  .roadmap-panel {
    border-radius: 24px;
    border: 1px solid rgba(36, 36, 36, 0.08);
    background:
      linear-gradient(135deg, rgba(216, 229, 223, 0.92), rgba(229, 229, 229, 0.94)),
      #e5e5e5;
    color: #242424;
    padding: clamp(1.4rem, 4vw, 3rem);
  }

  .market-panel {
    background:
      linear-gradient(135deg, rgba(198, 216, 226, 0.92), rgba(229, 229, 229, 0.94)),
      #e5e5e5;
  }

  .market-panel h2 {
    margin-top: 0.7rem;
    max-width: 68rem;
    font-size: clamp(2.7rem, 5.2vw, 5.8rem);
    font-weight: 650;
    letter-spacing: 0;
    line-height: 0.93;
  }

  .market-panel p {
    max-width: 70rem;
    margin-top: 1rem;
    color: #6c6c6c;
    font-size: 1.08rem;
    line-height: 1.72;
  }

  .regulatory-panel > p {
    max-width: 66rem;
    margin-top: 1rem;
  }

  .regulatory-columns,
  .roadmap-grid {
    display: grid;
    gap: 1rem;
    margin-top: 2rem;
  }

  .regulatory-columns div,
  .roadmap-card {
    border-radius: 16px;
    padding: 1.1rem;
    background: rgba(255, 255, 255, 0.5);
  }

  .regulatory-columns strong,
  .roadmap-card span {
    color: #4d805b;
    font-weight: 800;
  }

  .regulatory-columns p {
    margin-top: 0.55rem;
    color: #707070;
    line-height: 1.55;
  }

  .evidence-table {
    border-top: 1px solid rgba(36, 36, 36, 0.1);
  }

  .evidence-row {
    display: grid;
    grid-template-columns: 0.55fr 1.45fr;
    gap: 1rem;
    border-bottom: 1px solid rgba(36, 36, 36, 0.1);
    padding: 1rem 0;
    color: #707070;
  }

  .evidence-row span {
    color: #242424;
    font-weight: 700;
  }

  .evidence-row strong {
    color: #4d805b;
    font-weight: 700;
  }

  @media (min-width: 768px) {
    .market-stat-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .proof-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .regulatory-columns,
    .roadmap-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .evidence-layout {
      grid-template-columns: 0.95fr 1.05fr;
      align-items: start;
    }

    .proof-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
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
      font-size: clamp(2.85rem, 11.4vw, 3.55rem);
    }

    .hero-actions {
      flex-direction: column;
    }

    .sprinter-button {
      width: 100%;
    }

    .architecture-grid,
    .evidence-row {
      grid-template-columns: 1fr;
    }

    .ecosystem-map {
      display: grid;
      gap: 1rem;
      margin-top: 2rem;
      min-height: auto;
    }

    .ecosystem-map::before,
    .orbit-ring,
    .orbit-line {
      display: none;
    }

    .ecosystem-center,
    .ecosystem-node {
      position: relative;
      top: auto;
      left: auto;
      width: auto;
      min-height: auto;
      transform: none;
    }

    .ecosystem-center {
      min-height: 13rem;
      order: -1;
    }

    .ticker-track {
      animation-duration: 52s;
    }
  }
</style>
