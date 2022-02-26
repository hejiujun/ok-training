const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  it("Gets the value of the count", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    const t = await Counter.deploy();
    await t.deployed();
    await t.count();
    await t.count();
    expect(await t.getCounter()).to.equal(2);
  });
});