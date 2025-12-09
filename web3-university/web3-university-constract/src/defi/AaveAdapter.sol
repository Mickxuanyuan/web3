// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * AAVE 只需要用到 ERC20.transferFrom 和 allowance
 * 因此引入 IERC20 + SafeERC20
 */
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * AAVE V3 LendingPool（IPool）接口
 * 只保留：
 *  - supply()
 *  - withdraw()
 */
interface IPool {
    /**
     * @param asset 存入的资产（如 USDT）
     * @param amount 数量
     * @param onBehalfOf aUSDT 归属地址（你收到利息的地址）
     * @param referralCode 固定填 0
     */
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;

    /**
     * @param asset 提取的资产（USDT）
     * @param amount 想取多少（uint(-1) = 全部）
     * @param to 收款地址
     */
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

/**
 * @title AaveAdapter
 * @notice 对接 AAVE V3，让作者：
 *         - 存入 USDT → 获得 aUSDT
 *         - aUSDT 持续自动生利息（APY）
 *         - 随时 withdraw（本金 + 利息）
 */
contract AaveAdapter {
    using SafeERC20 for IERC20;

    IPool public immutable pool;      // AAVE 池
    address public immutable USDT;    // USDT 地址
    address public immutable aUSDT;   // aUSDT 地址（收益代币）

    constructor(address _pool, address _usdt, address _aUSDT) {
        pool = IPool(_pool);
        USDT = _usdt;
        aUSDT = _aUSDT;
    }

    /* -------------------------------------------------------------------------- */
    /*                                 AAVE SUPPLY                                 */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice 作者将 USDT 存入 AAVE，获得 aUSDT
     *
     * 流程：
     * 1. 作者 → transferFrom → Adapter：USDT
     * 2. Adapter → approve → AAVE Pool
     * 3. AAVE pool.supply() → 给用户 mint aUSDT
     */
    function depositUSDT(uint256 amount) external {
        // 收集用户 USDT
        IERC20(USDT).safeTransferFrom(msg.sender, address(this), amount);

        // 授权给 AAVE Pool
        IERC20(USDT).safeIncreaseAllowance(address(pool), amount);

        // 存入 AAVE，aUSDT mint 给 msg.sender
        pool.supply(USDT, amount, msg.sender, 0);
    }

    /* -------------------------------------------------------------------------- */
    /*                                AAVE WITHDRAW                                */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice 提取 USDT（本金 + 利息）
     */
    function withdrawUSDT(uint256 amount, address to) external {
        // 调用 AAVE 的 withdraw
        pool.withdraw(USDT, amount, to);
    }

    /* -------------------------------------------------------------------------- */
    /*                            GET aUSDT BALANCE                                 */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice 查询用户的 aUSDT 余额（等于本金+利息）
     */
    function balanceOfAUSDT(address user) external view returns (uint256) {
        return IERC20(aUSDT).balanceOf(user);
    }
}
