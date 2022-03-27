// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20{

    constructor() ERC20("ERC20 TokenA", "TokenA") {
        _mint(msg.sender, 1200000 * 10**uint256(decimals()));
    }

}