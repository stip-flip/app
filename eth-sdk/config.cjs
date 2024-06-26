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
      ORACLE: "0x52E71673C5D687fA39A5Cdc9Aa5f2dF3D55b472d",
      TRADER_PERIPHERY: "0x899b94A15089c4E964c67795178f9B4Db9a53175",
      ROUTER: "0xD468eC8E7e62a78EB5BD03A1F5b59957D19fB702",
      QUOTER: "0x913e097Af8035Bc0D06d3D6e0f9259E5799AACDe",
      POSITION_MANAGER: "0xc8955696450aa5c29F3a157EB0eF75Bd4f71F6cF",
      WETC9: "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a",
      UNIV3_POOL: "0xD29aadB325E0e059ce0a97396156DA06Fe9c2284",
    },
    ether: {
      USDC: "0x76d0184CF511788032A74a1FB91146e63F43dd53",
      POOL: "0x4bc58480Fb15DF55e71691147930b428634b4BCF",
      ORACLE: "0xc2716755B77DfaA808fEA2E5f130425644FEa7a7",
      TRADER_PERIPHERY: "0xD2ad4B4E1199414A801744f57B7BFcE0E5b4aDd3",
      ROUTER: "0x5c613499558694B9794dD75A1603677f3a1C3e20",
      QUOTER: "0x6924592AAe9183d2CF1D200a6e211Aa165F63210",
      POSITION_MANAGER: "0x5d1535B5e4e69D72b0BFDed45038100d639BD2d1",
      WETC9: "0x82A618305706B14e7bcf2592D4B9324A366b6dAd",
      UNIV3_POOL: "0x1Bf6fA5f3D8aB1e8f4cFf7F0f6f9f1A9f3d5f3c4", // incorrect address
    },
  },
  outputPath: "eth-sdk/build/",
});
