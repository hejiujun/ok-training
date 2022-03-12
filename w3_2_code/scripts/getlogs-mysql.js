const { ethers, network } = require("hardhat");
var mysql = require('mysql');

const roseAddr = require(`../deployments/${network.name}/Rose.json`)

var connection = mysql.createConnection({
    host     : 'loaclhost',
    user     : 'root',
    password : 'Hlande@2022',
    database : 'erc_test'
  });

connection.connect();

async function parseTransferEvent(event) {
    const TransferEvent = new ethers.utils.Interface(["event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"]);
    let decodedData = TransferEvent.parseLog(event);
    console.log("from:" + decodedData.args.from);
    console.log("to:" + decodedData.args.to);
    console.log("tokenId:" + decodedData.args.tokenId);
    let from=decodedData.args.from;
    let to=decodedData.args.to;
    let tokenId=decodedData.args.tokenId;
    let sql='INSERT INTO transfer_info (from, to, token_id) VALUES (?, ?, ?)';
    let array=new Array();
    array.push(from);
    array.push(to);
    array.push(tokenId.toString());
    console.log(array);
    connection.query(sql,array, (err, results) => {
        if(err){
            console.log(err);
        }
        console.log(results);
    });
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

connection.end();



