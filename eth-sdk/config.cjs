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
      ROUTER: "0x2f1a8a4fb2d14D3D3893F6488CAF3fD090E8a90b",
      QUOTER: "0xa6Efa28585193d83cCB5CdCF4a467bf1336296b3",
      POSITION_MANAGER: "0x6ab7B2fdbB8a7A4f928205ebb4b517DD0b0a5321",
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
