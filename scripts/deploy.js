const hre = require("hardhat");

async function main() {
  const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry");
  const registry = await ProductRegistry.deploy();
  await registry.waitForDeployment();
  console.log("ProductRegistry deployed to:", await registry.getAddress());

  const Pairing = await hre.ethers.getContractFactory("Pairing");
  const pairing = await Pairing.deploy();
  await pairing.waitForDeployment();
  console.log("Pairing deployed to:", await pairing.getAddress());

  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  console.log("Verifier deployed to:", await verifier.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
