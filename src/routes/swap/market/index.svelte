<script lang="ts">
  import Icon from "@iconify/svelte";
  import { formatUnits, parseEther } from "ethers/lib/utils";
  import _ from "lodash";
  import { validator } from "src/actions/big-number-input";
  import { signPermit } from "src/actions/sign";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { useBalance } from "src/hooks/balance";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { useAllowance, useBalance as useBal } from "src/hooks/erc20";
  import { buildPath, swapOut } from "src/hooks/sf/swapMath";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify, switchNetwork, updateVc } from "src/lib";
  import { SUPPORTED_NETWORKS, sdk } from "src/stores";
  import {
    chainId,
    defaultEvmStores,
    signer,
    signerAddress,
  } from "svelte-ethers-store";
  import Modal from "../components/_modal.svelte";
  import { modal } from "src/lib/web3";
  import { onMount } from "svelte";

  let amountOut: string;
  let amountIn: string;

  let price: number = 0;

  let selectToken: "token0" | "token1";
  let selectedToken0: TokenInfoAndBalance;
  let selectedToken1: TokenInfoAndBalance;

  let selectedToken: TokenInfoAndBalance;

  $: {
    if (selectedToken && selectToken == "token0") {
      if (selectedToken == selectedToken1) {
        selectedToken = undefined;
        selectedToken1 = undefined;
      } else {
        selectedToken0 = selectedToken;
      }
      // selectedToken = undefined;
    } else {
      selectedToken1 = selectedToken;
      // selectedToken = undefined;
    }
  }

  let error: string;

  let checkbox: HTMLInputElement;
  let open: boolean = false;

  const ZERO_ADDRESS = "0x0";

  $: synthInfo = useSynthInfos;

  $: quoteToken = useBalance;

  $: balance0 = useBal(selectedToken0?.info.address, $signerAddress);

  $: synth0 = $synthInfo.find(
    (si) => si.address == selectedToken0?.info.address
  );

  $: synth0Price = Number(
    formatUnits(synth0?.currentPrice || 0, synth0?.oracleDecimals)
  );

  $: synth0Ratio = Number(formatUnits(synth0?.ratio || 0, 18));

  $: synth1 = $synthInfo.find(
    (si) => si.address == selectedToken1?.info.address
  );

  $: synth1Price = Number(
    formatUnits(synth1?.currentPrice || 0, synth1?.oracleDecimals)
  );

  $: synth1Ratio = Number(formatUnits(synth1?.ratio || 0, 18));

  $: supportedNetwork = SUPPORTED_NETWORKS.includes(Number($chainId));

  function zeroToWETC9(tokenAddress: string) {
    return tokenAddress == ZERO_ADDRESS ? $sdk.WETC9.address : tokenAddress;
  }

  $: allowance = useAllowance(
    selectedToken0?.info.address,
    $sdk.ROUTER.address,
    $signerAddress
  );

  $: tokenInfosAndBalances = [
    ...($synthInfo || []).map((pi) => pi.token),
    $quoteToken,
  ].filter((t) => !!t);

  $: filteredSelectedToken1 = tokenInfosAndBalances.filter(
    (t: TokenInfoAndBalance) => {
      if (!selectedToken0) return true;
      return t.info.address != selectedToken0.info.address;
    }
  );

  $: {
    if (
      selectedToken0 &&
      selectedToken1 &&
      filteredSelectedToken1.length &&
      !filteredSelectedToken1.some(
        (t) => t?.info?.address == selectedToken1?.info.address
      )
    ) {
      selectedToken1 = undefined;
    }
  }

  $: selectedPool = $synthInfo.find(
    (pi) =>
      pi.address == selectedToken0?.info.address ||
      pi.address == selectedToken1?.info.address
  );

  let path: string;
  let reversePath: string;
  let steps: string[][];
  let reverseSteps: string[][];

  $: [path, reversePath, steps, reverseSteps] = buildPath(
    selectedToken0,
    selectedToken1
  );

  $: {
    if (selectedToken0 && selectedToken1 && selectedPool) {
      debOut();
    }
  }

  // debounce outgoing amount
  const debOut = _.debounce(async () => {
    const res = await swapOut(
      $sdk,
      amountOut,
      path,
      steps,
      synth0,
      synth1,
      selectedToken0,
      selectedToken1
    );
    error = res.error;
    price = res.price;
    amountIn = Number(amountOut) ? res.amountIn : "";
  }, 1000);

  // debounce incoming amount
  const debIn = _.debounce(async () => {
    const res = await swapOut(
      $sdk,
      amountIn,
      reversePath,
      reverseSteps,
      synth1,
      synth0,
      selectedToken1,
      selectedToken0
    );
    error = res.error;
    price = res.price;
    amountOut = Number(amountIn) ? res.amountIn : "";
  }, 1000);

  onMount(updateVc);
</script>

<Modal
  id="selectToken"
  otherTokenSelected={selectToken == "token0" ? selectedToken1 : selectedToken0}
  tokenInfosAndBalances={selectToken == "token0"
    ? tokenInfosAndBalances
    : filteredSelectedToken1}
  bind:selectToken
  bind:selectedToken
  bind:checkbox
  bind:open
  {selectedToken0}
  {selectedToken1}
/>

<div
  class="lg:w-1/3 m-auto lg:mt-4 lg:mb-24 lg:border-2 lg:border-primary rounded-lg p-4 lg:bg-gradient lg:h-auto lg:pt-0 container-height"
  id="container"
>
  <div
    class="w-full flex space-x-4 lg:mt-8 p-8 bg-slate-200 rounded-3xl shadow-lg"
  >
    <input
      bind:value={amountOut}
      type="text"
      inputmode="decimal"
      placeholder="0"
      class="input input-ghost w-1/2 text-white text-2xl"
      class:input-error={Number(amountOut) > $balance0}
      on:validated={(v) => (amountOut = v.detail)}
      on:input={debOut}
      use:validator={{
        value: amountOut,
      }}
    />
    <div class="w-1/2">
      <label
        for="selectToken"
        tabindex="0"
        id="token0"
        class="w-full btn rounded-lg shadow-lg"
        on:click={(_) => {
          selectToken = "token0";
          open = true;
        }}
      >
        {#if selectedToken0 != undefined}
          <div class="flex space-x-2 items-center">
            <CoinIcon symbol={selectedToken0?.info?.symbol} />
            <span>{selectedToken0?.info.symbol}</span>
          </div>
        {:else}
          Sell token
        {/if}
      </label>
      {#if selectedToken0 != undefined}
        <div
          class="ml-4 text-sm text-neutral cursor-pointer h-0"
          on:click={(_) => {
            amountOut = String($balance0 || 0);
            debOut();
          }}
        >
          Balance: {commify($balance0, 4)}
        </div>
      {/if}
    </div>
  </div>
  <div class="w-full flex justify-center h-0">
    <span
      class="z-10"
      on:click={(_) => {
        [selectedToken0, selectedToken1] = [selectedToken1, selectedToken0];
        [amountIn, amountOut] = [amountOut, amountIn];
        debOut();
      }}
    >
      <Icon
        class="text-4xl text-primary bg-slate-200 -mt-2 cursor-pointer"
        icon="mdi:swap-vertical"
      />
    </span>
  </div>
  <div
    class="w-full flex space-x-4 mt-4 p-8 bg-slate-200 rounded-3xl relative shadow-lg"
  >
    <input
      bind:value={amountIn}
      type="text"
      inputmode="decimal"
      placeholder="0"
      class="input input-ghost w-1/2 text-white text-2xl"
      on:validated={(v) => (amountIn = v.detail)}
      on:input={debIn}
      use:validator={{
        value: amountIn,
        max: String(1e18),
      }}
    />
    <div class="dropdown w-1/2">
      <label
        for="selectToken"
        tabindex="0"
        class="w-full btn rounded-lg shadow-lg"
        on:click={(_) => {
          open = true;
          selectToken = "token1";
        }}
        >{#if selectedToken1 != undefined}
          <div class="flex space-x-2 items-center">
            <CoinIcon symbol={selectedToken1?.info?.symbol} />
            <span>{selectedToken1?.info.symbol}</span>
          </div>
        {:else}
          Buy token
        {/if}</label
      >
    </div>
  </div>
  {#if path != ""}
    <div class="px-4">
      <div id="current-price" class="flex justify-between my-4 text-lg">
        <strong> Price </strong>
        <strong class="flex space-x-2 items-center">
          <span class="flex items-center space-x-2"
            >{commify(1)}
            <CoinIcon className="ml-2" symbol={selectedToken0.info.symbol} />
          </span>
          <span>for</span>
          <span class="flex items-center space-x-2"
            >{commify(price)}
            <CoinIcon className="ml-2" symbol={selectedToken1.info.symbol} />
          </span>
        </strong>
      </div>
    </div>
    {#if Number(amountOut)}
      <div class="px-4">
        <div class="flex justify-between my-4 text-lg">
          <strong> Fees </strong>
          <strong>
            {commify(0.3, 4)} %
          </strong>
        </div>
      </div>
    {/if}
  {/if}

  {#if error}
    <div class="bg-warning p-4 rounded-xl text-center mt-8 text-l text-black">
      {@html error}
    </div>
  {:else}
    <button
      id="swap"
      class="btn btn-primary btn-lg w-full mt-8"
      disabled={Number(amountOut) > Number(balance0) ||
        (Number(amountOut || 0) == 0 &&
          !!signer &&
          !!supportedNetwork &&
          selectedToken0 &&
          selectedToken1)}
      on:click={async (_) => {
        if (!$signer) return modal.open();
        if (!supportedNetwork) return switchNetwork(63);
        if (!selectedToken0 || !selectedToken1) checkbox.click();
        if (Number(amountOut) > $balance0) return;
        let signature;
        let shares = Number(amountOut);
        if (synth0) {
          shares = (shares * synth0Price) / synth0Ratio;
          if ($allowance < Number(amountOut)) {
            console.log("signature");
            signature = await signPermit(
              selectedToken0.info.address,
              $sdk.ROUTER.address,
              parseEther(String(shares)),
              Math.round(Date.now() / 1000 + 60 * 60)
            );
          }
        }
        console.log(path, amountOut);
        broadcastTransaction(
          "Swapping " +
            selectedToken0.info.symbol +
            " for " +
            selectedToken1.info.symbol,
          $sdk.ROUTER.connect($signer).multicall(
            [
              !!signature
                ? $sdk.ROUTER.interface.encodeFunctionData("selfPermit", [
                    synth0?.address,
                    parseEther(String(shares)),
                    signature.deadline,
                    signature?.v,
                    signature.r,
                    signature.s,
                  ])
                : "",
              $sdk.ROUTER.interface.encodeFunctionData("exactInput", [
                {
                  amountIn: parseEther(String(shares)),
                  amountOutMinimum: parseEther("0"),
                  deadline: Math.floor(Date.now() / 1000) + 60 * 20,
                  path: path,
                  recipient: $signerAddress,
                },
              ]),
            ].filter((x) => !!x),
            {
              value:
                selectedToken0.info.address == ZERO_ADDRESS
                  ? parseEther(amountOut)
                  : 0,
            }
          )
        );
      }}
    >
      {#if !$signer}
        Connect Wallet
      {:else if !supportedNetwork}
        Switch Network
      {:else if selectedToken0 && selectedToken1}
        Swap <CoinIcon symbol={selectedToken0.info.symbol} />for <CoinIcon
          symbol={selectedToken1.info.symbol}
        />
      {:else if Number(amountOut) > $balance0}
        Insufficient balance
      {:else}
        Select tokens
      {/if}
    </button>
  {/if}
</div>
