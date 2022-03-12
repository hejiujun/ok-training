// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
    mapping(address => uint256) public deposited;
    address public immutable token;

    constructor(address _token) {
        token = _token;
    }

    function permitDeposit(
        address user,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        IERC20Permit(token).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        deposit(user, amount);
    }

    function deposit(address user, uint256 amount) public {
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer from error"
        );
        deposited[user] += amount;
    }

    function withdraw(address user, uint256 amount) public {
        require(
            IERC20(token).transfer(msg.sender, amount),
            "Transfer from error"
        );
        deposited[user] -= amount;
    }

    function balanceOf(address user) public view returns (uint256) {
        return deposited[user];
    }
}
