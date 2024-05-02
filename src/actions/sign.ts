import { signERC2612Permit } from "eth-permit";
import type { BigNumber } from "ethers";
import { sdk } from "src/stores/eth-sdk";
import { signer, signerAddress } from "svelte-ethers-store";
import { get } from "svelte/store";

export async function signPermit(
  tokenAddress: string,
  value: BigNumber,
  deadline: number
) {
  if (tokenAddress == "0x0") return;
  // let synth = get(sdk).POOL.attach(tokenAddress);

  // The address that will be approved to spend the tokens
  const spender = get(sdk).ROUTER.address;
  const owner = get(signerAddress);

  const result = await signERC2612Permit(
    get(signer),
    tokenAddress,
    owner,
    spender,
    value.toString(),
    deadline
  );

  return result;

  // await synth
  //   .connect(get(signer))
  //   .permit(
  //     owner,
  //     spender,
  //     value,
  //     result.deadline,
  //     result.v,
  //     result.r,
  //     result.s
  //   );
}
