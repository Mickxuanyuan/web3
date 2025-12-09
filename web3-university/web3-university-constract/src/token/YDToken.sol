// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title YDToken
/// @notice 简单的可增发、可销毁 ERC20 代币，支持标准授权(approve/allowance)流程。
contract YDToken is ERC20, ERC20Burnable, Ownable {
    constructor(uint256 initialSupply) ERC20("YDToken", "YD") Ownable(msg.sender) {
        // 初始发行给合约部署者
        _mint(msg.sender, initialSupply);
    }

    /// @notice 仅拥有者可增发新代币
    /// @param to 接收增发代币的地址
    /// @param amount 增发数量
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

