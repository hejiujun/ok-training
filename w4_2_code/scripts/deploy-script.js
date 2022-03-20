const hre = require("hardhat");

async function main() {
  let [owner, second] = await ethers.getSigners();
  //MyToken deploy
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  let tAmount = ethers.utils.parseUnits("100000", 18);
  const myToken = await MyToken.deploy(tAmount);
  await myToken.deployed();
  console.log("MyToken deployed to:", myToken.address);
  //MyTokenMarket deploy
  let routerAddr = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  let wethAddr = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
  const myTokenMarket = await MyTokenMarket.deploy(myToken.address, routerAddr, wethAddr);
  await myTokenMarket.deployed();
  console.log("MyTokenMarket deployed to:", myTokenMarket.address);
  //SushiToken deploy
  const SushiToken = await ethers.getContractFactory("SushiToken");
  const sushiToken = await SushiToken.deploy();
  console.log("SushiToken deployed to:", sushiToken.address);
  //MasterChef deploy
  const MasterChef = await ethers.getContractFactory("MasterChef");
  const masterChef = await MasterChef.deploy(sushiToken.address, owner.address, "1000000000000000000000", "0", "1000000000000000000000");
  console.log("MasterChef deployed to:", masterChef.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
