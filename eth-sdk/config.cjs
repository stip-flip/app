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
      USDC: "0xc08b453c3328007f88993717ba77e67e94c79f1b",
      POOL: "0x4e411752f571838243B8E38c1957B968B3aa37cD",
      POOL_FACTORY: "0xB0bDf614Fe41f5e83937Bef3C8E1994474b34F14",
    },
  },
  outputPath: "eth-sdk/build/",
});
