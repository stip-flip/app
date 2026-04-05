const sdk = require("@dethcrypto/eth-sdk");

module.exports = sdk.defineConfig({
  etherscanURLs: {
    mordor: "https://etc-mordor.blockscout.com/api",
    ether: "https://etc.blockscout.com/api",
  },
  rpc: {
    mordor: "https://mordor.stipflip.xyz",
    ether: "https://classic.stipflip.xyz",
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
      ORACLE: "0x4AC635E92801e657F44BDEfcc7660Ea1431DF846",
      TRADER_PERIPHERY: "0xD2ad4B4E1199414A801744f57B7BFcE0E5b4aDd3",
      ROUTER: "0x4ed8bf33091eea5fCd6fe3BF91c3E31eCac103Cd",
      QUOTER: "0x1EeBE2Dcc030d1418714915457A7637f2a5E585F",
      POSITION_MANAGER: "0x042890000913bdB3802AB8A9d07a2EF7fD7F3102",
      WETC9: "0x82A618305706B14e7bcf2592D4B9324A366b6dAd",
      UNIV3_POOL: "0x5cF1209D6EeEB49634A25A1bAD56e15805bE7F3D",
    },
  },
  outputPath: "eth-sdk/build/",
});
