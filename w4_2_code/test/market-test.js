const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyTokenMarket", function () {
  it("MyTokenMarket add liquidity and buy MyToken", async function () {
    let [owner, second] = await ethers.getSigners();
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    let tAmount = ethers.utils.parseUnits("100000", 18);
    const myToken = await MyToken.deploy(tAmount);
    await myToken.deployed();
    const SushiToken = await ethers.getContractFactory("SushiToken");
    const sushiToken = await SushiToken.deploy();
    console.log("SushiToken deployed to:", sushiToken.address);
    const MasterChef = await ethers.getContractFactory("MasterChef");
    const masterChef = await MasterChef.deploy(sushiToken.address, owner.address, "1000000000000000000000", "0", "1000000000000000000000");
    console.log("MasterChef deployed to:", masterChef.address);
    //Router address
    let routerAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    //Weth address
    let wethAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
    const myTokenMarket = await MyTokenMarket.deploy(myToken.address, routerAddr, wethAddr, masterChef.address);
    await myTokenMarket.deployed();
    await myToken.approve(myTokenMarket.address, ethers.constants.MaxUint256);
    let ethAmount = ethers.utils.parseUnits("100", 18);
    await myTokenMarket.addLiquidity(tAmount, { value: ethAmount })
    console.log("添加流动性");

    await sushiToken.transferOwnership(masterChef.address);
    await masterChef.add("0", myToken.address, true);

    let buyEthAmount = ethers.utils.parseUnits("1", 18);
    out = await myTokenMarket.buyToken("0", { value: buyEthAmount });

    await myTokenMarket.withdraw();

    let o = await myToken.balanceOf(owner.address);
    console.log("取回token:" + ethers.utils.formatUnits(o, 18));
  });
});
