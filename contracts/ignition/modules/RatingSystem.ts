import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// This is the simplest module, deploying the contract without constructor arguments.
const RatingSystemModule = buildModule("RatingSystemModule", (m) => {
  // m.contract takes the contract name as the first argument
  const ratingSystem = m.contract("RatingSystem"); 

  // The module returns an object containing the deployed contract instance
  return { ratingSystem };
});

export default RatingSystemModule;