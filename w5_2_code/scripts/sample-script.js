const hre = require("hardhat");
let routerV2Addr = require(`../deployments/dev/UniswapV2Router01.json`);
let routerV3Addr = require(`../deployments/dev/Router.json`);

async function main() {
  // const MyFlashLoanSimpleReceiver = await hre.ethers.getContractFactory("MyFlashLoanSimpleReceiver");
  // const myFlashLoanSimpleReceiver = await MyFlashLoanSimpleReceiver.deploy(routerV2Addr.address,routerV3Addr.address);

  // await myFlashLoanSimpleReceiver.deployed();

  // console.log("myFlashLoanSimpleReceiver deployed to:", myFlashLoanSimpleReceiver.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
