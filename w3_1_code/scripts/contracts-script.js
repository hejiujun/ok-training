const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  const Tenmile = await hre.ethers.getContractFactory("Tenmile");
  const tenmile = await Tenmile.deploy();

  await tenmile.deployed();

  console.log("Tenmile deployed to:", tenmile.address);
  await writeAddr(tenmile.address, "Tenmile", network.name)

  const Coronation = await hre.ethers.getContractFactory("Coronation");
  const coronation = await Coronation.deploy();

  await coronation.deployed();

  console.log("Coronation deployed to:", coronation.address);
  await writeAddr(coronation.address, "Coronation", network.name)

  const Vault = await hre.ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(coronation.address);

  await vault.deployed();

  console.log("Vault deployed to:", vault.address);
  await writeAddr(vault.address, "Vault", network.name)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
