const { ethers, network } = require("hardhat");

const roseAddr = require(`../deployments/${network.name}/Rose.json`)


async function parseTransferEvent(event) {
    const TransferEvent = new ethers.utils.Interface(["event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"]);
    let decodedData = TransferEvent.parseLog(event);
    console.log("from:" + decodedData.args.from);
    console.log("to:" + decodedData.args.to);
    console.log("tokenId:" + decodedData.args.tokenId);
}

async function main() {
    let [owner, second] = await ethers.getSigners();
    let rose = await ethers.getContractAt("Rose",
        roseAddr.address,
        owner);

    let filter = rose.filters.Transfer()
    filter.fromBlock = 1;
    filter.toBlock = 10;


    let events = await ethers.provider.getLogs(filter);
    for (let i = 0; i < events.length; i++) {
        parseTransferEvent(events[i]);

    }
}

main()




