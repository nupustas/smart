const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "daring cinnamon sense jazz silver pave refuse retreat project visual kidney jelly";
const alchemyURL = "https://eth-sepolia.g.alchemy.com/v2/L5-33JxU2tEs3RVfAzftM";

module.exports = {
  networks: {
    // local Ganache network
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },

    // Sepolia test network
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: { phrase: mnemonic },
          providerOrUrl: alchemyURL,
          numberOfAddresses: 7, // 
        }),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};