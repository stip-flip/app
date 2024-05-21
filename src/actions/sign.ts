import { signERC2612Permit } from "eth-permit";
import type { BigNumber } from "ethers";

import { signer, signerAddress } from "svelte-ethers-store";
import { get } from "svelte/store";

export async function signPermit(
  tokenAddress: string,
  spender: string,
  value: BigNumber,
  deadline: number
) {
  if (tokenAddress == "0x0") return;
  // let synth = get(sdk).POOL.attach(tokenAddress);

  // The address that will be approved to spend the tokens

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
}
