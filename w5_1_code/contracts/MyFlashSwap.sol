// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyFlashSwap is IUniswapV2Callee {
    using SafeERC20 for IERC20;

    uint24 MEDIUMFREE = 3000;
    address immutable routerV3;

    constructor(address _routerV3) public {
        routerV3 = _routerV3;
    }

    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external override {
        address[] memory path = new address[](2);
        {
            // scope for token{0,1}, avoids stack too deep errors
            address token0 = IUniswapV2Pair(msg.sender).token0();
            address token1 = IUniswapV2Pair(msg.sender).token1();
            path[0] = token0;
            path[1] = token1;
        }
        IERC20 tokenA = IERC20(path[0]);
        IERC20 tokenB = IERC20(path[1]);
        uint256 amount0Min = LowGasSafeMath.add(amount0, MEDIUMFREE);
        uint256 amount1Min = LowGasSafeMath.add(amount1, MEDIUMFREE);

        if (amount0 > 0) {
            tokenA.safeApprove(routerV3, amount0);
            uint256 amountOut0 = ISwapRouter(routerV3).exactInputSingle(
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: path[0],
                    tokenOut: path[1],
                    fee: MEDIUMFREE,
                    recipient: address(this),
                    deadline: block.timestamp,
                    amountIn: amount0,
                    amountOutMinimum: amount1Min,
                    sqrtPriceLimitX96: 0
                })
            );
            
            assert(tokenA.transfer(msg.sender, amount0));
            assert(amountOut0 > amount0Min);
            uint256 profit0 = amountOut0 - amount0Min;
            assert(tokenA.transfer(sender, profit0));
        } else {
            tokenB.safeApprove(routerV3, amount1);
            uint256 amountOut1 = ISwapRouter(routerV3).exactInputSingle(
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: path[1],
                    tokenOut: path[0],
                    fee: MEDIUMFREE,
                    recipient: address(this),
                    deadline: block.timestamp,
                    amountIn: amount1,
                    amountOutMinimum: amount0Min,
                    sqrtPriceLimitX96: 0
                })
            );

            assert(tokenB.transfer(msg.sender, amount1));
            assert(amountOut1 > amount1Min);
            uint256 profit1 = amountOut1 - amount1Min;
            assert(tokenB.transfer(sender, profit1));
        }
    }
}
