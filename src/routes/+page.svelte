<script lang="ts">
  const pools = [
    {
      volume: "1,000 ethers",
      fundingRate: "12.4%",
      liquidities: "2,000 ethers",
      tokenMinted: "1,000,000 FLIP-BTC",
    },
    {
      volume: "1,000 ethers",
      fundingRate: "6.34%",
      liquidities: "2,000 ethers",
      tokenMinted: "1,000,000 STUP-BTC",
    },
  ];
</script>

<div class="bg-gradient full-height overflow-scroll">
  <div class="w-1/2 m-auto pt-32">
    <h1 class="text-7xl">S&F global</h1>
    <h2 class="mt-8 text-4xl text-base-content font-bold">
      Trade everything with up to 10x leverage
    </h2>
  </div>
  <div class="w-1/3 m-auto mt-32 flex items-center justify-between">
    <div
      class="h-20 border border-base-content rounded-3xl flex items-center p-8"
    >
      Launch App
    </div>
    <div
      class="h-20 border border-base-content rounded-3xl flex items-center p-8"
    >
      Read the docs
    </div>
  </div>
  <div class="w-1/2 m-auto mt-32">
    <p class="text-3xl text-center text-primary">
      Experience the world's first perpetual protocol built around concentrated
      liquidity.
    </p>
    <p class="text-3xl text-center mt-12 text-primary">
      S&F offers a free market for funding rates, enabling the best funding rate
      for traders at all times, and a complete risk control for liquidity
      providers. With S&F your are in control.
    </p>
  </div>

  <div class="w-1/2 m-auto mt-32">
    <table class="table w-full my-24">
      <thead>
        <tr>
          <th>Daily volume</th>
          <th>Funding rate</th>
          <th>Liquidities</th>
          <th>Token minted</th>
        </tr>
      </thead>
      <tbody>
        {#each pools || [] as p, i}
          <tr class="hover cursor-pointer">
            <td>
              <strong>{p.volume}</strong>
            </td>
            <td>
              {p.fundingRate}
            </td>
            <td>
              {p.liquidities}
            </td>
            <td>
              {p.tokenMinted}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
