// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title OnChainLogger
/// @notice 用事件(Event)记录链上数据
contract OnChainLogger {
    address public owner;
    /// @notice 日志事件（The Graph 将监听此事件）
    event DataLogged(
        address indexed sender,  // 可索引发起人
        string tag,              // 分类或类型
        string content,          // 实际要记录的数据
        uint256 timestamp        // 写入时间
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @notice 只有发布者才有权限写日志方法
    function log(string calldata tag, string calldata content) external onlyOwner {
        // 通知所有的订阅合约的人
        emit DataLogged(msg.sender, tag, content, block.timestamp);
    }
}
