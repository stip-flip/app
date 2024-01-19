const sdk = require("@dethcrypto/eth-sdk");

module.exports = sdk.defineConfig({
  etherscanURLs: {
    sepolia: "https://api-sepolia.etherscan.io/api",
    mordor: "https://etc-mordor.blockscout.com/api",
  },
  etherscanKeys: {
    sepolia: "EYBN1WQYRX7ADX3A9XJQUQUEJ15Y73V6GH",
  },
  rpc: {
    mordor: "https://rpc.mordor.etccooperative.org/",
  },
  contracts: {
    goerli: {
      USDC: "0xc08b453c3328007f88993717ba77e67e94c79f1b",
      POOL: "0x6487bd2d1e8125868804a9290090e69c0973059d",
    },
    // mordor: {
    //   USDC: "0x26c922212b440fc48ab8f54c822349cacc9ce91a",
    //   POOL: "0x5ac308ccfbcfaddea056bd148031a37fdd756ee8",
    // },
  },
  outputPath: "eth-sdk/build/",
});
