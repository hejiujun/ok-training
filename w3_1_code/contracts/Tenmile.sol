// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Tenmile is ERC20 {
    address private owner;

    modifier onlyOwner(address account) {
        require(owner == account, "Failed, not token issuer!");
        _;
    }

    constructor() ERC20("Ten Mile ERC20 Token", "tm") {
        owner = msg.sender;
        _mint(msg.sender, 0 * 10**uint256(decimals()));
    }

    function increaseTotalSupply(address account, uint256 amount)
        public
        onlyOwner(account)
    {
        _mint(account, amount * 10**uint256(decimals()));
    }
}
