<script lang="ts">
  import Icon from "@iconify/svelte";
  import { BigNumber, constants } from "ethers";
  import { formatEther, parseEther } from "ethers/lib/utils";
  import { validator } from "src/actions/big-number-input";
  import { signPermit } from "src/actions/sign";
  import CoinIcon from "src/components/coin-icon.svelte";
  import { useBalance } from "src/hooks/balance";
  import { useAllowance } from "src/hooks/erc20";
  import { broadcastTransaction } from "src/hooks/transactions";
  import type { PoolInfo } from "src/hooks/uniswap/pool";
  import type { UniPositionInfo } from "src/hooks/uniswap/position";
  import { commify } from "src/lib";
  import {
    getShares,
    getSynthAmount,
    uniRatioToSynthPrice,
  } from "src/lib/sf/math";
  import { computeAmount0, computeAmount1 } from "src/lib/uniswap/math";
  import { getAmountsDelta } from "src/lib/uniswap/sqrtPriceMath";
  import { getRatioForTick } from "src/lib/uniswap/tick";
  import { sdk } from "src/stores";
  import { signer, signerAddress } from "svelte-ethers-store";

  export let pool: PoolInfo;
  export let selectedPosition: UniPositionInfo;

  let mode: "withdraw" | "deposit" = "withdraw";

  $: amounts = getAmountsDelta(
    getRatioForTick(selectedPosition?.tickLower),
    getRatioForTick(selectedPosition?.tickUpper),
    pool.ratio,
    selectedPosition?.liquidity,
    false
  );

  $: etcAmount =
    (Number(formatEther(String(amounts[pool.synthIndex ? 0 : 1] || 0))) *
      Number(percent)) /
    100;

  $: sharesAmount =
    (Number(formatEther(String(amounts[pool.synthIndex ? 1 : 0] || 0))) *
      Number(percent)) /
    100;

  $: allowance = useAllowance(
    pool?.synth?.info.address || "",
    $sdk.POSITION_MANAGER.address,
    $signerAddress
  );

  let etcDeposit: string;

  let synthDeposit: string;

  // translate synthetics to shares
  $: shares = getShares(Number(synthDeposit), pool.synthPrice, pool.synthRatio);

  $: etcFees = formatEther(
    selectedPosition?.fees["amount" + pool.synthIndex ? "0" : "1"] || "0"
  );
  $: synthFees = formatEther(
    selectedPosition?.fees["amount" + pool.synthIndex ? "1" : "0"] || "0"
  );

  $: console.log("synthPrice", pool.synthPrice);

  let percent: string = "0";

  function switchMode() {
    mode = mode == "withdraw" ? "deposit" : "withdraw";
  }

  function recomputeETC(synth: number) {
    // translate synth to shares
    const shares = getShares(synth, pool.synthPrice, pool.synthRatio);
    console.log(shares, synth);
    const computeAmount = pool.synthIndex ? computeAmount0 : computeAmount1;
    etcDeposit = String(
      computeAmount(
        pool.ratio,
        getRatioForTick(selectedPosition.tickLower),
        getRatioForTick(selectedPosition.tickUpper),
        shares
      )
    );
  }

  function recomputeSynth(etc: number) {
    const computeAmount = pool.synthIndex ? computeAmount1 : computeAmount0;
    const shares = computeAmount(
      pool.ratio,
      getRatioForTick(selectedPosition.tickLower),
      getRatioForTick(selectedPosition.tickUpper),
      etc
    );
    synthDeposit = String(
      getSynthAmount(shares, pool.synthPrice, pool.synthRatio)
    );
  }

  async function action() {
    if (mode == "withdraw") {
      broadcastTransaction(
        `Collecting liquidities and fees from ${pool.synth?.info?.symbol}`,
        $sdk.POSITION_MANAGER.connect($signer).multicall([
          percent != "0"
            ? $sdk.POSITION_MANAGER.interface.encodeFunctionData(
                "decreaseLiquidity",
                [
                  {
                    tokenId: selectedPosition.id,
                    liquidity: BigNumber.from(selectedPosition.liquidity)
                      .mul(percent)
                      .div(100),
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
                  },
                ]
              )
            : "",
          $sdk.POSITION_MANAGER.interface.encodeFunctionData("collect", [
            {
              tokenId: selectedPosition.id,
              recipient: $signerAddress,
              amount0Max: BigNumber.from("1").shl(128).sub(1),
              amount1Max: BigNumber.from("1").shl(128).sub(1),
            },
          ]),
        ])
      );
    } else {
      let signature;
      if ($allowance < Number(shares)) {
        signature = await signPermit(
          pool.synth?.info?.address || "",
          $sdk.POSITION_MANAGER.address,
          parseEther(String(shares)),
          Math.round(Date.now() / 1000 + 60 * 60)
        );
      }
      broadcastTransaction(
        `Depositing liquidities to ETC/${pool.synth?.info?.symbol}`,
        $sdk.POSITION_MANAGER.connect($signer).multicall(
          [
            !!signature
              ? $sdk.POSITION_MANAGER.interface.encodeFunctionData(
                  "selfPermit",
                  [
                    pool.synth?.info?.address || "",
                    parseEther(String(shares)),
                    signature.deadline,
                    signature.v,
                    signature.r,
                    signature.s,
                  ]
                )
              : "",
            $sdk.POSITION_MANAGER.interface.encodeFunctionData(
              "increaseLiquidity",
              [
                {
                  tokenId: selectedPosition.id,
                  amount0Desired: parseEther(
                    pool.synthIndex ? etcDeposit : String(shares)
                  ),
                  amount1Desired: parseEther(
                    pool.synthIndex ? String(shares) : etcDeposit
                  ),
                  amount0Min: 0,
                  amount1Min: 0,
                  deadline: Math.floor(Date.now() / 1000) + 60 * 20,
                },
              ]
            ),
            $sdk.POSITION_MANAGER.interface.encodeFunctionData("refundETH"),
          ],
          { value: parseEther(etcDeposit) }
        )
      );
    }
  }
</script>

<input type="checkbox" id={pool.address} class="modal-toggle" />
<label for={pool.address} class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold flex items-center">
        <CoinIcon symbol={pool.synth?.info?.symbol} className="mr-2" />{pool
          ?.synth?.info?.symbol}
      </h2>
      <div class="flex items-center">
        <Icon icon="mdi:ethereum" class="text-green-600 text-2xl" />{commify(
          (getRatioForTick(
            pool.reversed
              ? -selectedPosition?.tickUpper
              : selectedPosition?.tickLower
          ) *
            pool.synthPrice) /
            pool.synthRatio
        )} - <Icon
          icon="mdi:ethereum"
          class="text-green-600 text-2xl"
        />{commify(
          (getRatioForTick(
            pool.reversed
              ? -selectedPosition?.tickLower
              : selectedPosition?.tickUpper
          ) *
            pool.synthPrice) /
            pool.synthRatio
        )}
      </div>
    </div>
    <div class="divider" />
    <div class="tabs tabs-boxed">
      <a
        class="tab tab-lg w-1/2"
        on:click={switchMode}
        class:tab-active={mode == "withdraw"}>Withdraw</a
      >
      <a
        class="tab tab-lg w-1/2"
        on:click={switchMode}
        class:tab-active={mode == "deposit"}>Deposit</a
      >
    </div>
    {#if mode == "withdraw"}
      <div class="fine-border p-4 rounded-xl my-4">
        <h2 class="text-bold text-xl">Amount</h2>
        <div class="flex items-center justify-between my-4">
          <strong class="text-xl w-1/4">{percent}%</strong>
          <div
            class="p-4 py-2 bg-primary bg-opacity-25 rounded-2xl cursor-pointer"
            on:click={(_) => (percent = "25")}
          >
            25%
          </div>
          <div
            class="p-4 py-2 bg-primary bg-opacity-25 rounded-2xl cursor-pointer"
            on:click={(_) => (percent = "50")}
          >
            50%
          </div>
          <div
            class="p-4 py-2 bg-primary bg-opacity-25 rounded-2xl cursor-pointer"
            on:click={(_) => (percent = "75")}
          >
            75%
          </div>
          <div
            class="p-4 py-2 bg-primary bg-opacity-25 rounded-2xl cursor-pointer"
            on:click={(_) => (percent = "100")}
          >
            Max
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          bind:value={percent}
          class="range"
        />
      </div>
      <!-- <div class="border-b my-4 mt-8" /> -->
      <label class="input-group w-full mt-2">
        <div class="input input-bordered w-2/3 flex items-center">
          {commify(etcAmount)} + {commify(etcFees)} fees
        </div>
        <span class="w-1/3 text-center flex items-center">
          <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
          ETC</span
        >
      </label>
      <label class="input-group w-full mt-2">
        <div class="input input-bordered w-2/3 flex items-center">
          {commify(
            getSynthAmount(
              Number(sharesAmount),
              pool.synthPrice,
              pool.synthRatio
            )
          )} + {commify(synthFees)} fees
        </div>
        <span class="w-1/3 text-center flex items-center">
          <CoinIcon symbol={pool.synth?.info?.symbol} className="mr-1" />
          {pool.synth?.info?.symbol}</span
        >
      </label>
    {:else}
      <div class="fine-border p-4 rounded-xl my-4">
        <h2 class="flex items-center justify-between">
          <div class="flex">
            <Icon icon="mdi:ethereum" class="text-green-600 text-2xl" />
            <span>ETC</span>
          </div>
          <div>
            {commify(
              formatEther(
                String(
                  getAmountsDelta(
                    getRatioForTick(selectedPosition.tickLower),
                    getRatioForTick(selectedPosition.tickUpper),
                    pool.ratio,
                    selectedPosition.liquidity,
                    false
                  )[pool.synthIndex ? 0 : 1]
                )
              ),
              3
            )}
          </div>
        </h2>
        <h2 class="flex items-center justify-between mt-4">
          <div class="flex">
            <CoinIcon symbol={pool?.synth?.info?.symbol} />
            <span class="ml-2">{pool?.synth?.info?.symbol}</span>
          </div>
          <div>
            {commify(
              getSynthAmount(
                Number(
                  formatEther(
                    String(
                      getAmountsDelta(
                        getRatioForTick(selectedPosition.tickLower),
                        getRatioForTick(selectedPosition.tickUpper),
                        pool.ratio,
                        selectedPosition.liquidity,
                        false
                      )[pool.synthIndex ? 1 : 0]
                    )
                  )
                ),
                pool.synthPrice,
                pool.synthRatio
              ),
              3
            )}
          </div>
        </h2>
      </div>
      <label class="input-group w-full mt-8">
        <input
          bind:value={etcDeposit}
          type="text"
          placeholder="0"
          class="input input-bordered w-2/3 flex items-center"
          class:input-error={Number(etcDeposit) > Number($useBalance.balance)}
          on:input={(_) => recomputeSynth(Number(etcDeposit))}
          on:validated={(v) => (etcDeposit = v.detail)}
          disabled={!!pool.synthIndex
            ? getRatioForTick(selectedPosition.tickUpper) <= pool.ratio
            : getRatioForTick(selectedPosition.tickLower) >= pool.ratio}
          use:validator={{
            value: etcDeposit,
          }}
        />
        <span class="w-1/3 text-center flex items-center bg-opaque">
          <Icon class="inline text-xl text-green-600" icon="mdi:ethereum" />
          ETC</span
        >
      </label>
      <div class="text-right px-4">
        <span
          class="cursor-pointer"
          on:click={(_) => (etcDeposit = String($useBalance?.balance))}
        >
          <span class="text-xs">Balance: </span>
          <span class="text-xs">{commify($useBalance?.balance)}</span>
        </span>
      </div>
      <label class="input-group w-full mt-2">
        <input
          bind:value={synthDeposit}
          type="text"
          placeholder="0"
          class="input input-bordered w-2/3 flex items-center"
          class:input-error={Number(synthDeposit) > Number(pool.synth?.balance)}
          on:input={(_) => recomputeETC(Number(synthDeposit))}
          on:validated={(v) => (synthDeposit = v.detail)}
          disabled={!!pool.synthIndex
            ? getRatioForTick(selectedPosition.tickLower) >= pool.ratio
            : getRatioForTick(selectedPosition.tickUpper) <= pool.ratio}
          use:validator={{
            value: synthDeposit,
          }}
        />

        <span class="w-1/3 text-center flex items-center bg-opaque">
          <CoinIcon symbol={pool.synth?.info?.symbol} className="mr-1" />
          {pool.synth?.info?.symbol}</span
        >
      </label>
      <div class="text-right px-4">
        <span
          class="cursor-pointer"
          on:click={(_) => (synthDeposit = String(pool.synth?.balance))}
        >
          <span class="text-xs">Balance: </span>
          <span class="text-xs">{commify(pool.synth?.balance)}</span>
        </span>
      </div>
    {/if}
    <!-- <div class="m-4 mx-12 p-2 font-light bg-blend-lighten rounded-lg">
      Fees accumulated:
      {#await $sdk.POOL.attach(poolAddress).positionPnL(selectedPosition?.tickLower, selectedPosition?.tickUpper, $signerAddress) then pnl}
        {commify(formatUnits(pnl, $usdcInfo?.decimals || 18))}
        <br />
        Liquidities after: {commify(
          formatAmount(selectedPosition?.liquidity, $usdcInfo?.decimals || 18) +
            (mode == "deposit" ? Number(amount) : -Number(amount)) +
            Number(formatUnits(pnl, $usdcInfo?.decimals || 18))
        )}
      {:catch err}
        0
      {/await}
    </div> -->
    <!-- <div class="border-b" /> -->
    <div class="text-right pt-4">
      <button class="btn btn-primary w-full" on:click={(_) => action()}>
        {#if mode == "withdraw"}
          Collect
        {:else}
          Mint
        {/if}
      </button>
    </div>
  </label>
</label>
