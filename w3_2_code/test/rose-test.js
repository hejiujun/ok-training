const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rose", function () {
  it("The rose contract test result", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Rose = await ethers.getContractFactory("Rose");
    const rose = await Rose.deploy();
    await rose.deployed();

    await rose.awardItem(owner.address,"https://meta.sadgirlsbar.io/cats/12.json");

    expect(await rose.balanceOf(owner.address)).to.equal(1);

  });
});
