const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  const Rose = await hre.ethers.getContractFactory("Rose");
  const rose = await Rose.deploy();
  await rose.deployed();

  console.log("Rose deployed to:", rose.address);

  await writeAddr(rose.address, "Rose", network.name)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
