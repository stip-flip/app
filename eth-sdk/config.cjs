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
    sepolia: {
      USDC: "0x0E93915A24848b3BD7e9D907DA1229da264d5071",
      POOL: "0xd1c24ccb43c3e2d93817104cd725ae280da3b6fa",
      POOL_FACTORY: "0x29945B3BC31AA2BEad3cAF1f28e993069BfF59Ff",
    },
    goerli: {
      USDC: "0xE8D09a0ee0b4B4353F5c43C13ad10DacB7B60c0f",
      POOL: "0xe615c586791c111e2b2bd182127957c80bbf510f",
      POOL_FACTORY: "0x3ddC3D14f517E9e1705E9d5608d22ae10124BB98",
    },
  },
  outputPath: "eth-sdk/build/",
});
