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
      POOL: "0x536431fffbb75e8f3891ea3b5482a2c62ef4bd03",
      ORACLE: "0x378fB5a7b85F44Eb656Ef0D7C0D2109dE41871A1",
      TRADER_PERIPHERY: "0x899b94A15089c4E964c67795178f9B4Db9a53175",
      ROUTER: "0x191B31C9FBd86eA70E3058423A2eC65725bbC433",
      QUOTER: "0xC066F3c2f1F1CD6f64562a27Ed07B789231b0eE7",
      POSITION_MANAGER: "0x9eb357EaE382140516c795D55B755C7C06479970",
      WETC9: "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a",
      UNIV3_POOL: "0xD29aadB325E0e059ce0a97396156DA06Fe9c2284",
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
