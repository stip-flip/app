const sdk = require("@dethcrypto/eth-sdk");

module.exports = sdk.defineConfig({
  etherscanURLs: {
    mordor: "https://etc-mordor.blockscout.com/api",
    ether: "https://etc.blockscout.com/api",
  },
  rpc: {
    mordor: "https://mordor.sf.exchange",
    ether: "https://etc.etcdesktop.com",
  },
  contracts: {
    mordor: {
      USDC: "0x26c922212b440fc48ab8f54c822349cacc9ce91a",
      POOL: "0x5ac308ccfbcfaddea056bd148031a37fdd756ee8",
      ORACLE: "0x378fB5a7b85F44Eb656Ef0D7C0D2109dE41871A1",
      TRADER_PERIPHERY: "0x10DFC6EA1f62E4639EEE08Ea2034B927e4915324",
    },
    ether: {
      USDC: "0x76d0184CF511788032A74a1FB91146e63F43dd53",
      POOL: "0x3308AEA51fe3133C23a314f849afCAEe949E3C86",
      ORACLE: "0x1D82819403ACC5D85e3934d8e13fd63B78fbF465",
      TRADER_PERIPHERY: "0x10DFC6EA1f62E4639EEE08Ea2034B927e4915324",
    },
  },
  outputPath: "eth-sdk/build/",
});
