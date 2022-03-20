const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyTokenMarket", function () {
  it("MyTokenMarket add liquidity and buy MyToken", async function () {
    let [owner, second] = await ethers.getSigners();
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    let tAmount = ethers.utils.parseUnits("100000", 18);
    const myToken = await MyToken.deploy(tAmount);
    await myToken.deployed();
    let routerAddr = "0x59b670e9fA9D0A427751Af201D676719a970857b";
    let wethAddr = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
    let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
    const myTokenMarket = await MyTokenMarket.deploy(myToken.address, routerAddr, wethAddr);
    await myTokenMarket.deployed();

    await myToken.approve(myTokenMarket.address, ethers.constants.MaxUint256);
    let ethAmount = ethers.utils.parseUnits("100", 18);
    await myTokenMarket.addLiquidity(tAmount, { value: ethAmount })
    console.log("添加流动性");

    let b = await myToken.balanceOf(owner.address);
    console.log("持有token:" + ethers.utils.formatUnits(b, 18));

    let buyEthAmount = ethers.utils.parseUnits("1", 18);
    out = await myTokenMarket.buyToken("0", { value: buyEthAmount })

    b = await myToken.balanceOf(owner.address);
    console.log("购买到:" + ethers.utils.formatUnits(b, 18));
  });
});
