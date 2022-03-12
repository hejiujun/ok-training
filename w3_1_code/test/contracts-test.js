const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tenmile", function () {
  it("token issuer,increase total supply", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Tenmile = await ethers.getContractFactory("Tenmile");
    const tenmile = await Tenmile.deploy();
    await tenmile.deployed();
    //测试初始token值
    expect(await tenmile.balanceOf(owner.address)).to.equal(0);
    expect(await tenmile.totalSupply()).to.equal(0);
    //合约创建者才能增发，增发500个token
    await tenmile.increaseTotalSupply(owner.address,500);
    const totalSupply=await tenmile.totalSupply();
    expect(ethers.utils.formatUnits(totalSupply, 18)).to.equal('500.0');
    //转账20个token给addr1
    await tenmile.transfer(addr1.address,20);
    expect(await tenmile.balanceOf(addr1.address)).to.equal(20);


    const Coronation = await hre.ethers.getContractFactory("Coronation");
    const coronation = await Coronation.deploy();
    await coronation.deployed();
    console.log("Coronation deployed to:", coronation.address);
    console.log("owner balance:", await coronation.balanceOf(owner.address));
    
  });
});
