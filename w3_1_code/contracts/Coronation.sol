// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Coronation is ERC20Permit {
    constructor()
        ERC20("Coronation ERC2612 Token", "corone")
        ERC20Permit("Coronation ERC2612 Token")
    {
        _mint(msg.sender, 2000 * 10**uint256(decimals()));
    }
}
