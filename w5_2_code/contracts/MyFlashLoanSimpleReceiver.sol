// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.10;

import "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/SafeMath.sol";
import "@aave/core-v3/contracts/dependencies/gnosis/contracts/GPv2SafeERC20.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import "@aave/core-v3/contracts/mocks/tokens/MintableERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";

contract MyFlashLoanSimpleReceiver is FlashLoanSimpleReceiverBase {
    using GPv2SafeERC20 for IERC20;
    using SafeMath for uint256;
    uint24 MEDIUMFREE = 3000;
    address immutable routerV2;
    address immutable routerV3;

    constructor(
        IPoolAddressesProvider provider,
        address _routerV2,
        address _routerV3
    ) FlashLoanSimpleReceiverBase(provider) {
        routerV2 = _routerV2;
        routerV3 = _routerV3;
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address, // initiator
        bytes memory // params
    ) public override returns (bool) {
        address[] memory path = new address[](2);
        require(
            amount <= IERC20(asset).balanceOf(address(this)),
            "Invalid balance for the contract"
        );
        {
            address token0 = IUniswapV2Pair(msg.sender).token0();
            address token1 = IUniswapV2Pair(msg.sender).token1();
            path[0] = token0;
            path[1] = token1;
        }
        //require(path[0] == asset, "Not a TokenA contract");
        IERC20 tokenA = IERC20(path[0]);
        IERC20 tokenB = IERC20(path[1]);
        uint256 amountRequired = tokenB.balanceOf(address(this));
        tokenA.approve(routerV2, amount);
        IUniswapV2Router01(routerV2).swapExactTokensForTokens(
            amount,
            0,
            path,
            address(this),
            block.timestamp
        );
        uint256 amountReceived = tokenB.balanceOf(address(this));
        assert(amountReceived > amountRequired);

        uint256 amountMin = LowGasSafeMath.add(amount, MEDIUMFREE);
        tokenB.approve(routerV3, amountReceived);
        uint256 amountOut = ISwapRouter(routerV3).exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: path[1],
                tokenOut: path[0],
                fee: MEDIUMFREE,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountReceived,
                amountOutMinimum: amountMin,
                sqrtPriceLimitX96: 0
            })
        );

        assert(amountOut > amountMin);
        MintableERC20 token = MintableERC20(asset);
        uint256 amountToReturn = amountOut.add(premium);
        token.mint(premium);
        IERC20(asset).approve(address(POOL), amountToReturn);
        return true;
    }
}
