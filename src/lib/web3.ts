import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5";

const projectId = "dd1aa6f8f217f1aeee645355fb4e24e8";

// 2. Set chains
const mainnet = {
  chainId: 61,
  name: "Ethereum Classic",
  currency: "ETC",
  explorerUrl: "https://etc.blockscout.com/",
  rpcUrl: "https://ether.stipflip.xyz",
};

const testnet = {
  chainId: 63,
  name: "Mordor",
  currency: "METC",
  explorerUrl: "https://mordor-etc.blockscout.com/",
  rpcUrl: "https://mordor.stipflip.xyz",
};

// 3. Create your application's metadata object
const metadata = {
  name: "Stip&Flip",
  description: "Decentralized Synthetic trading",
  url: "https://stipflip.xyz", // url must match your domain & subdomain
  icons: ["https://stipflip.xyz/favicon.ico"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "https://ether.stipflip.xyz", // used for the Coinbase SDK
  defaultChainId: 61, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
export const modal = createWeb3Modal({
  ethersConfig,
  chains: [mainnet, testnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});
