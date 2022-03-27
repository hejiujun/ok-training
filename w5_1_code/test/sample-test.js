const { expect } = require("chai");
const { ethers } = require("hardhat");
let routerV2Abi = require(`../deployments/abi/UniswapV2Router01.json`);
let routerV2Addr = require(`../deployments/dev/UniswapV2Router01.json`);
let factoryV2Abi = require(`../deployments/abi/UniswapV2Factory.json`);
let factoryV2Addr = require(`../deployments/dev/UniswapV2Factory.json`);
let routerV3Addr = require(`../deployments/dev/Router.json`);
let pairAbi=require(`../deployments/abi/UniswapV2Pair.json`);


describe("TokenA", function () {
  it("TokenA and TokenB test example", async function () {
    const [owner] = await ethers.getSigners();
    const TokenA = await hre.ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy();
    await tokenA.deployed();
    console.log("TokenA deployed to:", tokenA.address);

    const TokenB = await hre.ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy();
    await tokenB.deployed();
    console.log("TokenB deployed to:", tokenB.address);

    const MyFlashSwap = await hre.ethers.getContractFactory("MyFlashSwap");
    const flashSwap = await MyFlashSwap.deploy(routerV3Addr.address);
    await flashSwap.deployed();
    console.log("MyFlashSwap deployed to:", flashSwap.address);

    let routerV2 = new ethers.Contract(routerV2Addr.address, routerV2Abi.abi, owner);
    console.log("routerV2 address:", routerV2.address);

    let factoryV2 = new ethers.Contract(factoryV2Addr.address, factoryV2Abi.abi, owner);
    console.log("factoryV2 address:", factoryV2.address);

    await factoryV2.createPair(tokenA.address, tokenB.address)
    const PairAddress = await factoryV2.getPair(tokenA.address, tokenB.address)
    console.log("PairAddress address:", PairAddress);
    const Pair =new ethers.Contract(PairAddress, pairAbi.abi, owner);
    console.log("Pair address:", Pair.address);
    
    const tokenAAmount = ethers.utils.parseUnits("100", 18);
    const tokenBAmount = ethers.utils.parseUnits("400", 18);

    await tokenA.approve(routerV2.address, ethers.constants.MaxUint256);
    await tokenB.approve(routerV2.address, ethers.constants.MaxUint256);

    

    await routerV2.addLiquidity(
      tokenA.address,
      tokenB.address,
      tokenAAmount,
      tokenBAmount,
      0,
      0,
      owner.address,
      ethers.constants.MaxUint256
    );

    const balanceABefore = await tokenA.balanceOf(owner.address);
    const balanceBBefore = await tokenB.balanceOf(owner.address);

    const amount0 = ethers.utils.parseUnits("1", 18);
    const amount1 = ethers.utils.parseUnits("4", 18);
    let n=ethers.utils.parseUnits("1", 18);
    
    await Pair.swap(
      amount0,
      amount1,
      flashSwap.address,
      ethers.utils.defaultAbiCoder.encode(['uint'], [n])
    );

    const balanceAAfter = await tokenA.balanceOf(owner.address);
    const balanceBAfter = await tokenB.balanceOf(owner.address);

    console.log("tokenA balance:",balanceAAfter);
    console.log("tokenB balance:",balanceBAfter);

    let a=balanceAAfter-balanceABefore;
    let b=balanceBAfter-balanceBBefore;
    console.log("tokenA balance:",a);
    console.log("tokenB balance:",b);

    // wait until the transaction is mined
    // await setGreetingTx.wait();

    //expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
