// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20("MyToken", "mt") {
    constructor(uint256 initialSupply) public {
        _mint(msg.sender, initialSupply);
    }
}
