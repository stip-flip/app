# Stip & Flip Design Direction

This document captures the current landing-page direction so it can be applied consistently across the app and docs.

## Product Positioning

S&F should feel like protocol infrastructure, not a themed trading app.

Primary message:

> The perpetual settlement layer.

Supporting message:

> S&F makes perpetual positions work like tokens. You can trade them anywhere, while the protocol handles collateral, prices, funding, and settlement.

Use the app to demonstrate the protocol, but do not frame the product as only a DEX. The bigger idea is tokenized perpetual exposure with neutral settlement and open participation.

## Visual Tone

The interface should feel:

- infrastructural;
- neutral;
- technical but legible;
- calm and credible;
- open-protocol rather than corporate.

Avoid:

- casino/trader hype;
- oversized yield language;
- stock DeFi gradients;
- decorative blobs or busy illustrations;
- landing pages that look like a generic SaaS funnel.

## Color System

The current direction uses a dark charcoal/purple base with green settlement accents.

Core colors:

- Background charcoal: `#252a32` to `#343146`
- Deep panel: `rgba(17, 18, 28, 0.70)`
- Settlement green: `#9ee6ad`
- Muted text: `hsl(var(--bc) / 0.68)` to `hsl(var(--bc) / 0.74)`
- Borders: `rgba(255, 255, 255, 0.10)` to `rgba(158, 230, 173, 0.20)`

Use green for protocol truth, settlement, positive contrast, and key outcomes. Do not make the whole interface green.

The homepage nav should share the landing palette: dark glass, green-tinted border, and subtle purple/charcoal depth. Avoid the older orange/purple gradient on protocol-facing pages.

## Typography

Use large, direct type for protocol claims.

Hero headline style:

- very large;
- semibold/heavy;
- tight line height around `0.9` to `0.94`;
- no negative letter spacing;
- sentence should be short enough to read immediately.

Section headings should be large, but not all sections need hero-scale type. Use hero-scale only for thesis-level messages.

Small labels:

- uppercase;
- green;
- bold;
- modest letter spacing;
- short, factual labels such as `Settlement stack`, `The shift`, `Compared to perp venues`.

## Layout Principles

Use stacked narrative sections for major ideas.

Prefer:

- one idea per section;
- spacious vertical rhythm;
- full-width bands or unframed layouts;
- large thesis block followed by visual evidence;
- repeated cards only for repeated choices or pathways.

Avoid:

- cramming explanation and diagrams side by side when both compete for attention;
- nested cards;
- dense first viewports;
- too many bordered boxes in a row.

The first hero should be copy-led:

1. short label;
2. main thesis;
3. beginner-readable explanation;
4. two CTAs.

The protocol visual should live in its own section below the hero.

## Hero Background Mark

Use the S&F mark as a large transparent background object.

Guidelines:

- position it behind the hero copy, mostly on the right side;
- keep it subtle enough that text remains dominant;
- use a greenish/white translucent treatment;
- it may be large and partially cropped;
- do not make it look like a foreground logo.

The mark should add identity and depth, not become an illustration.

## Protocol Visuals

Visuals should explain the system architecture.

The settlement-stack diagram should read top to bottom:

1. execution venues;
2. position tokens;
3. protocol settlement.

Token labels should describe exposure, not vague market concepts.

Good labels:

- `Long BTC exposure`
- `Inverse power exposure`
- `Cubed SOL exposure`

Avoid vague labels like `Portable market` when the object is a token.

## Components

### Nav

Homepage nav:

- dark translucent glass;
- green-tinted border;
- soft inner highlight;
- rounded pill shape;
- same palette as landing background.

### Buttons

Primary CTA:

- green;
- direct verb;
- use icon when it clarifies action.

Secondary CTA:

- outline;
- restrained;
- same height as primary CTA.

### Path Cards

Use cards for audience pathways:

- Trade;
- Provide liquidity;
- Submit prices;
- Create markets.

Cards should be equal height, lightly bordered, and calm. They should explain what a user can do, not oversell.

## Copy Voice

Write for serious users first, but keep the first layer accessible to newcomers.

Prefer:

- "positions work like tokens";
- "trade can happen anywhere";
- "the protocol handles collateral, prices, funding, and settlement";
- "perps should not be trapped inside venues";
- "settlement stays canonical".

Avoid leading with:

- internal protocol jargon;
- ETC before the user understands the product;
- oracle-round mechanics in the hero;
- "no liquidations" as the main pitch;
- hype claims without a mechanism.

ETC belongs in a later explanatory section. It should be introduced as the settlement base after the user understands why settlement matters.

## Applying This To Docs

Docs should use the same conceptual architecture:

1. What is S&F?
2. Core thesis.
3. Settlement vs execution.
4. Tokenized positions.
5. OTC vs Market.
6. Why ETC.

Docs should keep diagrams visually consistent with the landing page:

- execution above;
- tokens in the middle;
- settlement below;
- green for canonical protocol state.

## Applying This To The App

The app can remain utilitarian, but should inherit the same protocol language:

- Swap pages should explain `OTC` as issuance/redemption and `Market` as secondary trading.
- Earn pages should frame liquidity as backing tokenized exposure.
- Oracle pages should frame price submission as an open protocol role.
- Navigation and empty states should avoid generic DEX language where protocol-specific terms are clearer.

The app should feel like the operating surface for a settlement protocol, not just a swap UI.
