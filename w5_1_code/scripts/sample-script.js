const hre = require("hardhat");
let routerV3Addr = require(`../deployments/dev/Router.json`);

async function main() {
  const TokenA = await hre.ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.deploy();
  await tokenA.deployed();
  console.log("TokenA deployed to:", tokenA.address);

  const TokenB = await hre.ethers.getContractFactory("TokenB");
  const tokenB = await TokenB.deploy();
  await tokenB.deployed();
  console.log("TokenB deployed to:", tokenB.address);

  const MyFlashSwap = await hre.ethers.getContractFactory("MyFlashSwap");
  const flashSwap = await MyFlashSwap.deploy(routerV3Addr.address);
  await flashSwap.deployed();
  console.log("MyFlashSwap deployed to:", flashSwap.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
