const hre = require("hardhat");

async function main() {
  //MyToken deploy
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  let tAmount = ethers.utils.parseUnits("100000", 18);
  const myToken = await MyToken.deploy(tAmount);
  await myToken.deployed();
  console.log("MyToken deployed to:", myToken.address);
  //MyTokenMarket deploy
  let routerAddr = "0x59b670e9fA9D0A427751Af201D676719a970857b";
  let wethAddr = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
  let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
  const myTokenMarket = await MyTokenMarket.deploy(myToken.address, routerAddr, wethAddr);
  await myTokenMarket.deployed();
  console.log("MyTokenMarket deployed to:", myTokenMarket.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
