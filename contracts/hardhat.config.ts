import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    // 👇 ADD THIS HEDERA TESTNET CONFIGURATION 👇
    hederaTestnet: {
      type: "http",
      chainType: "generic", // Hedera is a general EVM-compatible chain
      url: "https://testnet.hashio.io/api",
      // Hedera Testnet EVM Chain ID is 296 (0x128)
      chainId: 296, 
      accounts: ["0x586fff5966d2770f6f4590942369c0018e3aba4b01a95b0a34238d3b9e874f6c"],
    },
    // 👆 END HEDERA TESTNET CONFIGURATION 👆
  },
};

export default config;