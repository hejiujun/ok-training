const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Score", function () {
  it("Gets the value of the score", async function () {
    const Score = await ethers.getContractFactory("Score");
    const s = await Score.deploy();
    await s.deployed();
    const Teacher = await ethers.getContractFactory("Teacher");
    const t = await Teacher.deploy();
    await t.deployed();
    await t.giveScore(s.address, s.getBellaAddress(), s.getAliceAddress(), 30);

    console.log("Score:", await s.getScore(s.getAliceAddress()));
    expect(await s.getScore(s.getAliceAddress())).to.equal(30);

  });
});