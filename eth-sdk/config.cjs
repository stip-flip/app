const sdk = require("@dethcrypto/eth-sdk");

module.exports = sdk.defineConfig({
  etherscanURLs: {
    sepolia: "https://api-sepolia.etherscan.io/api",
  },
  etherscanKeys: {
    sepolia: "EYBN1WQYRX7ADX3A9XJQUQUEJ15Y73V6GH",
  },
  // rpc: {
  //   sepolia: "https://eth-sepolia.g.alchemy.com/v2/p485wpX8q1LUZSlUwcqc_ClbYCle4aKu"
  // },
  contracts: {
    goerli: {
      USDC: "0xc08b453c3328007f88993717ba77e67e94c79f1b",
      POOL: "0xc38d66dB689Fcc0Dd5c55B9678AfA917b79FF77F",
    },
  },
  outputPath: "eth-sdk/build/",
});
