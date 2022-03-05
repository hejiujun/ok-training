const hre = require("hardhat");

async function main() {
  const Score = await hre.ethers.getContractFactory("Score");
  const score = await Score.deploy();

  await score.deployed();

  console.log("Score deployed to:", score.address);

  const Teacher = await hre.ethers.getContractFactory("Teacher");
  const t = await Teacher.deploy();

  await t.deployed();

  console.log("Score deployed to:", t.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });