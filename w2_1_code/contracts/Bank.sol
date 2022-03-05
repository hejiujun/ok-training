// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Bank {
    address private owner;

    struct Funder {
        address addr;
        uint256 amount;
    }

    Funder[] public funders;
    event Received(address, uint256);

    modifier ownerFunc() {
        require(owner == msg.sender);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        funders.push(Funder({addr: msg.sender, amount: msg.value}));
        emit Received(msg.sender, msg.value);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawMoney() public ownerFunc {
        address payable to = payable(msg.sender);
        to.transfer(getBalance());
    }

    function withdrawMoneyTo(address payable _to) public {
        _to.transfer(getBalance());
    }

    function getFundersLength() public view returns (uint256) {
        return funders.length;
    }
}
