const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank", function () {
    it("get bank contracts account balance", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const Bank = await ethers.getContractFactory("Bank");
        const bank = await Bank.deploy();
        await bank.deployed();
     
        console.log("Number of Funder :", await bank.getFundersLength());

        console.log("bank contracts account balance:", await bank.getBalance());


    });
});
