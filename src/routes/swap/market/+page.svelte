<script lang="ts">
  import Icon from "@iconify/svelte";
  import { BigNumber, ethers } from "ethers";
  import { formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
  import _ from "lodash";
  import { validator } from "src/actions/big-number-input";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { useBalance } from "src/hooks/balance";
  import type { TokenInfoAndBalance } from "src/hooks/erc20";
  import { useAllowance, useBalance as useBal } from "src/hooks/erc20";
  import { broadcastTransaction } from "src/hooks/transactions";
  import { commify } from "src/lib";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";
  import Modal from "../components/_modal.svelte";
  import { useSynthInfos } from "src/hooks/sf/synth";
  import { signPermit } from "src/actions/sign";

  let amountOut: string = "0";
  let amountIn: string = "0";

  let price: string = "0";

  let selectToken: "token0" | "token1";
  let selectedToken0: TokenInfoAndBalance;
  let selectedToken1: TokenInfoAndBalance;

  let error: string;

  let checkbox: HTMLInputElement;

  const ZERO_ADDRESS = "0x0";

  $: poolInfos = useSynthInfos;

  $: quoteToken = useBalance;

  $: balance0 = useBal(selectedToken0?.info.address, $signerAddress);

  function zeroToWETC9(tokenAddress: string) {
    return tokenAddress == ZERO_ADDRESS ? $sdk.WETC9.address : tokenAddress;
  }

  function zeroForOne(tokenIn: string, tokenOut: string) {
    return tokenIn < tokenOut;
  }

  $: allowance = useAllowance(
    selectedToken0?.info.address,
    $sdk.ROUTER.address,
    $signerAddress
  );

  $: tokenInfosAndBalances = [
    ...($poolInfos || []).map((pi) => pi.token),
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

  $: selectedPool = $poolInfos.find(
    (pi) =>
      pi.address == selectedToken0?.info.address ||
      pi.address == selectedToken1?.info.address
  );

  let path: string;
  let reversePath: string;

  $: {
    if (!selectedToken0 || !selectedToken1) path = "";
    else if (selectedToken0.info.address == ZERO_ADDRESS) {
      path = ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [$sdk.WETC9.address, 3000, selectedToken1.info.address]
      );
      reversePath = ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [selectedToken1.info.address, 3000, $sdk.WETC9.address]
      );
    } else if (selectedToken1.info.address == ZERO_ADDRESS) {
      path = ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [selectedToken0.info.address, 3000, $sdk.WETC9.address]
      );
      reversePath = ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [$sdk.WETC9.address, 3000, selectedToken0.info.address]
      );
    } else {
      path = ethers.utils.solidityPack(
        ["address", "uint24", "address", "uint24", "address"],
        [
          selectedToken0.info.address,
          3000,
          $sdk.WETC9.address,
          3000,
          selectedToken1.info.address,
        ]
      );
      reversePath = ethers.utils.solidityPack(
        ["address", "uint24", "address", "uint24", "address"],
        [
          selectedToken1.info.address,
          3000,
          $sdk.WETC9.address,
          3000,
          selectedToken0.info.address,
        ]
      );
    }
  }

  $: {
    if (selectedToken0 && selectedToken1 && selectedPool) {
      debOut();
    }
  }

  $: errors = {
    liquidities: `Not enough ${selectedToken1?.info?.name} liquidities in the Uniswap pool`,
    void: "This uniswap pool does not exist, <a class='font-bold underline' href='https://www.etcswap.org/#/pools'>create it</a> first",
  };

  // debounce outgoing amount
  const debOut = _.debounce(async () => {
    if (selectedToken0 && selectedToken1) {
      let amount = parseUnits(
        amountOut == "0" ? "0.000001" : amountOut,
        selectedToken0.info.decimals
      );
      try {
        const res = await $sdk.QUOTER.callStatic.quoteExactInput(path, amount);
        let divisor = ethers.BigNumber.from(2).pow(96);
        let p = BigNumber.from(1e4);
        for (let i = 0; i < res.sqrtPriceX96AfterList.length; i++) {
          p = p
            .mul(res.sqrtPriceX96AfterList[i])
            .div(divisor)
            .mul(res.sqrtPriceX96AfterList[i])
            .div(divisor);
        }
        amountIn =
          amountOut == "0"
            ? "0"
            : formatUnits(res.amountOut, selectedToken1.info.decimals);
        price = zeroForOne(
          zeroToWETC9(selectedToken0.info.address),
          zeroToWETC9(selectedToken1.info.address)
        )
          ? commify(p.toNumber() / 1e4)
          : commify(1e4 / p.toNumber());
        error = "";
      } catch (err: any) {
        console.log(err.message);
        if (err.message.includes("TF")) {
          error = errors.liquidities;
        } else if (err.message.includes("AS")) {
          // do nothing
          error = "";
        } else {
          error = errors.void;
        }
      }
      // console.log(res.data[1]);
    }
  }, 1000);

  // debounce incoming amount
  const debIn = _.debounce(async () => {
    console.log("debIn");
    if (selectedToken0 && selectedToken1) {
      let amount = parseUnits(
        amountIn == "0" ? "0.000001" : amountIn,
        selectedToken1.info.decimals
      );
      try {
        const res = await $sdk.QUOTER.callStatic.quoteExactOutput(
          reversePath,
          amount
        );
        let divisor = ethers.BigNumber.from(2).pow(96);
        let p = BigNumber.from(1e4);
        for (let i = 0; i < res.sqrtPriceX96AfterList.length; i++) {
          p = p
            .mul(res.sqrtPriceX96AfterList[i])
            .div(divisor)
            .mul(res.sqrtPriceX96AfterList[i])
            .div(divisor);
        }

        amountOut =
          amountIn == "0"
            ? "0"
            : formatUnits(res.amountIn, selectedToken1.info.decimals);
        price = zeroForOne(
          zeroToWETC9(selectedToken0.info.address),
          zeroToWETC9(selectedToken1.info.address)
        )
          ? commify(p.toNumber() / 1e4)
          : commify(1e4 / p.toNumber());
        error = "";
      } catch (err: any) {
        console.log(err.message);
        if (err.message.includes("TF")) {
          error = errors.liquidities;
        } else if (err.message.includes("AS")) {
          // do nothing
          error = "";
        } else {
          error = errors.void;
        }
      }
    }
  }, 1000);
</script>

<Modal
  id="selectToken"
  otherTokenSelected={selectToken == "token0" ? selectedToken1 : selectedToken0}
  tokenInfosAndBalances={selectToken == "token0"
    ? tokenInfosAndBalances
    : filteredSelectedToken1}
  bind:selectToken
  bind:selectedToken0
  bind:selectedToken1
  bind:checkbox
/>

<div
  class="lg:w-1/3 m-auto mt-4 mb-24 lg:border-2 lg:border-primary rounded-lg p-4 lg:bg-gradient"
>
  <div
    class="w-full flex space-x-4 mt-8 p-8 bg-slate-200 rounded-3xl shadow-lg"
  >
    <input
      bind:value={amountOut}
      type="text"
      placeholder="Amount to swap"
      class="input input-ghost w-1/2 text-white text-2xl"
      on:validated={(v) => (amountOut = v.detail)}
      on:input={debOut}
      use:validator={{
        value: amountOut,
        max: $balance0 || 0,
      }}
    />
    <div class="w-1/2">
      <label
        for="selectToken"
        tabindex="0"
        id="token0"
        class="w-full btn rounded-full shadow-lg"
        on:click={(_) => {
          selectToken = "token0";
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
          class="absolute ml-4 text-sm text-neutral cursor-pointer"
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
      placeholder="Amount to swap"
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
        class="w-full btn rounded-full shadow-lg"
        on:click={(_) => {
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
      on:click={async (_) => {
        if (!selectedToken0 || !selectedToken1) checkbox.click();
        let signature;

        if ($allowance < Number(amountOut)) {
          console.log("signature");
          signature = await signPermit(
            selectedToken0.info.address,
            $sdk.ROUTER.address,
            parseEther(amountOut),
            Math.round(Date.now() / 1000 + 60 * 60)
          );
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
                ? $sdk.POOL.interface.encodeFunctionData("permit", [
                    $signerAddress,
                    $sdk.ROUTER.address,
                    parseEther(amountOut),
                    signature.deadline,
                    signature?.v,
                    signature.r,
                    signature.s,
                  ])
                : "",
              $sdk.ROUTER.interface.encodeFunctionData("exactInput", [
                {
                  amountIn: parseEther(amountOut),
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
            // $sdk.ROUTER.functions.encodeFunctionData("exactInput", [
            //   {
            //     amountIn: parseEther(amountOut),
            //     amountOutMinimum: parseEther("0"),
            //     deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            //     path: path,
            //     recipient: $signerAddress,
            //   },
            // ])
          )
        );
      }}
    >
      {#if selectedToken0 && selectedToken1}
        Swap <CoinIcon symbol={selectedToken0.info.symbol} />for <CoinIcon
          symbol={selectedToken1.info.symbol}
        />
      {:else}
        Select tokens
      {/if}
    </button>
  {/if}
</div>
