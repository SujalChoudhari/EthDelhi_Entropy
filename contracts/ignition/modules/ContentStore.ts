import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// This is the simplest module, deploying the contract without constructor arguments.
const ContentStoreModule = buildModule("ContentStoreModule", (m) => {
  // m.contract takes the contract name as the first argument
  const contentStore = m.contract("ContentStore"); 

  // The module returns an object containing the deployed contract instance
  return { contentStore };
});

export default ContentStoreModule;