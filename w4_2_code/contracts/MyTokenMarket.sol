// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.12;

import "./IUniswapV2Router01.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./MasterChef.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public myToken;
    address public router;
    address public weth;
    address public chef;

    constructor(
        address _token,
        address _router,
        address _weth,
        address _chef
    ) public {
        myToken = _token;
        router = _router;
        weth = _weth;
        chef = _chef;
    }

    function addLiquidity(uint256 tokenAmount) public payable {
        IERC20(myToken).safeTransferFrom(
            msg.sender,
            address(this),
            tokenAmount
        );
        IERC20(myToken).safeApprove(router, tokenAmount);
        IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(
            myToken,
            tokenAmount,
            0,
            0,
            msg.sender,
            block.timestamp
        );
    }

    function buyToken(uint256 minTokenAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = myToken;

        IUniswapV2Router01(router).swapExactETHForTokens{value: msg.value}(
            minTokenAmount,
            path,
            address(this),
            block.timestamp
        );
        uint256 mAmount = IERC20(myToken).balanceOf(address(this));
        uint256 pid = MasterChef(chef).poolLength();
        uint256 _pid = pid - 1;
        IERC20(myToken).safeApprove(chef, mAmount);
        MasterChef(chef).deposit(_pid, mAmount);
    }

    function withdraw() public payable {
        uint256 pid = MasterChef(chef).poolLength();
        uint256 _pid = pid - 1;
        MasterChef(chef).emergencyWithdraw(_pid);
        uint256 amount = IERC20(myToken).balanceOf(address(this));
        IERC20(myToken).safeTransfer(msg.sender, amount);
    }
}
