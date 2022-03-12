const { ethers, network } = require("hardhat");

const roseAddr = require(`../deployments/${network.name}/Rose.json`)


async function main() {

    let [owner, second, third] = await ethers.getSigners();

    let rose = await ethers.getContractAt("Rose",
        roseAddr.address,
        owner);

    await rose.awardItem(owner.address, "https://meta.sadgirlsbar.io/cats/12.json");

    await rose.transferFrom(owner.address, second.address, 1);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
