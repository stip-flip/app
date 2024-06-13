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
      ROUTER: "0x191B31C9FBd86eA70E3058423A2eC65725bbC433",
      QUOTER: "0xC066F3c2f1F1CD6f64562a27Ed07B789231b0eE7",
      POSITION_MANAGER: "0x9eb357EaE382140516c795D55B755C7C06479970",
      WETC9: "0x1953cab0E5bFa6D4a9BaD6E05fD46C1CC6527a5a",
      UNIV3_POOL: "0xD29aadB325E0e059ce0a97396156DA06Fe9c2284",
    },
    ether: {
      USDC: "0x76d0184CF511788032A74a1FB91146e63F43dd53",
      POOL: "0x4bc58480Fb15DF55e71691147930b428634b4BCF",
      ORACLE: "0x50dF6441af59Eb9b0348d1d7b0aEA5c4e29218Dc",
      TRADER_PERIPHERY: "0xD2ad4B4E1199414A801744f57B7BFcE0E5b4aDd3",
      ROUTER: "0x1700204CcC954BDd2444C0444d9DB5B9635514Dd",
      QUOTER: "0x3FCe6BAFfbB77ce053962158b289aFa1d73c2bbf",
      POSITION_MANAGER: "0x963619B73a7aEe47e05Bc9E2498FcF00aA198A7A",
      WETC9: "0x82A618305706B14e7bcf2592D4B9324A366b6dAd",
      // UNIV3_POOL: "0x1Bf6fA5f3D8aB1e8f4cFf7F0f6f9f1A9f3d5f3c4", // incorrect address
    },
  },
  outputPath: "eth-sdk/build/",
});
