// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/// @title RedPacket - 简单链上红包
/// @notice 创建者锁定 ETH，指定份数，人人平均领取。
contract RedPacket {
    // 结构体定义
    struct Packet {
        address creator; // 创建人
        uint256 totalAmount; // 锁定的初始 ETH
        uint256 remainingAmount; // 剩余未领取
        uint256 totalShares; // 总份数/人数上限
        uint256 remainingShares; // 剩余可领份数
        uint64 createdAt; // 创建时间戳
        uint64 expiresAt; // 0 表示不限时
        string note; // 祝福语
    }

    uint256 public nextPacketId = 1;
    mapping(uint256 => Packet) public packets; // packetId => 元数据
    mapping(uint256 => mapping(address => uint256)) public claimedAmount; // packetId => 领取人 => 金额

    event RedPacketCreated(
        uint256 indexed packetId,
        address indexed creator,
        uint256 totalAmount,
        uint256 totalShares,
        uint64 expiresAt,
        string note
    );
    event RedPacketClaimed(
        uint256 indexed packetId,
        address indexed claimer,
        uint256 amount,
        uint256 remainingShares
    );
    event RedPacketExhausted(uint256 indexed packetId);
    event ClaimFailed(uint256 indexed packetId, address indexed claimer, string reason);
    event Refunded(uint256 indexed packetId, address indexed to, uint256 amount);

    error PacketNotFound();
    error NotCreator();

    /// @notice 创建红包并锁入 ETH
    /// @param totalShares 份数（人数）
    /// @param durationInSeconds 过期时间（秒），0 表示不过期
    /// @param note 祝福语
    function createRedPacket(
        uint256 totalShares,
        uint64 durationInSeconds,
        string calldata note
    ) external payable returns (uint256 packetId) {
        require(totalShares > 0, "shares required");
        require(msg.value > 0, "value required");
        require(msg.value >= totalShares, "amount lt shares"); // 避免平均分后为 0

        packetId = nextPacketId++;
        uint64 expiresAt = durationInSeconds == 0
            ? 0
            : uint64(block.timestamp) + durationInSeconds;

        packets[packetId] = Packet({
            creator: msg.sender,
            totalAmount: msg.value,
            remainingAmount: msg.value,
            totalShares: totalShares,
            remainingShares: totalShares,
            createdAt: uint64(block.timestamp),
            expiresAt: expiresAt,
            note: note
        });

        emit RedPacketCreated(
            packetId,
            msg.sender,
            msg.value,
            totalShares,
            expiresAt,
            note
        );
    }

    /// @notice 抢红包
    /// @dev 重复领取/抢空/过期不 revert，而是用事件提示前端。
    function claim(uint256 packetId) external returns (uint256 claimed) {
        Packet storage packet = packets[packetId];
        if (packet.creator == address(0)) {
            revert PacketNotFound();
        }

        if (packet.expiresAt != 0 && packet.expiresAt <= block.timestamp) {
            emit ClaimFailed(packetId, msg.sender, "EXPIRED");
            return 0;
        }

        if (packet.remainingShares == 0 || packet.remainingAmount == 0) {
            emit ClaimFailed(packetId, msg.sender, "EMPTY");
            emit RedPacketExhausted(packetId);
            return 0;
        }

        if (claimedAmount[packetId][msg.sender] > 0) {
            emit ClaimFailed(packetId, msg.sender, "ALREADY_CLAIMED");
            return 0;
        }

        claimed = _calculateShare(packet.remainingAmount, packet.remainingShares);
        claimedAmount[packetId][msg.sender] = claimed;
        packet.remainingAmount -= claimed;
        packet.remainingShares -= 1;

        (bool ok, ) = msg.sender.call{value: claimed}("");
        require(ok, "transfer failed");

        emit RedPacketClaimed(packetId, msg.sender, claimed, packet.remainingShares);

        if (packet.remainingShares == 0 || packet.remainingAmount == 0) {
            emit RedPacketExhausted(packetId);
        }
    }

    /// @notice 过期后创建者可退款剩余金额
    function refund(uint256 packetId, address payable to) external returns (uint256 amount) {
        Packet storage packet = packets[packetId];
        if (packet.creator == address(0)) revert PacketNotFound();
        if (packet.creator != msg.sender) revert NotCreator();
        require(packet.expiresAt != 0 && packet.expiresAt <= block.timestamp, "not expired");
        require(packet.remainingAmount > 0, "nothing to refund");

        amount = packet.remainingAmount;
        packet.remainingAmount = 0;
        packet.remainingShares = 0;

        (bool ok, ) = to.call{value: amount}("");
        require(ok, "refund failed");

        emit Refunded(packetId, to, amount);
        emit RedPacketExhausted(packetId);
    }

    function hasClaimed(uint256 packetId, address user) external view returns (uint256) {
        return claimedAmount[packetId][user];
    }

    function packetInfo(
        uint256 packetId
    )
        external
        view
        returns (
            address creator,
            uint256 totalAmount,
            uint256 remainingAmount,
            uint256 totalShares,
            uint256 remainingShares,
            uint64 createdAt,
            uint64 expiresAt,
            string memory note
        )
    {
        Packet storage packet = packets[packetId];
        if (packet.creator == address(0)) revert PacketNotFound();
        return (
            packet.creator,
            packet.totalAmount,
            packet.remainingAmount,
            packet.totalShares,
            packet.remainingShares,
            packet.createdAt,
            packet.expiresAt,
            packet.note
        );
    }

    function _calculateShare(
        uint256 remainingAmount,
        uint256 remainingShares
    ) private pure returns (uint256) {
        if (remainingShares == 1) {
            return remainingAmount;
        }
        // Even split for simplicity; tiny dust stays for the last claimer.
        uint256 share = remainingAmount / remainingShares;
        if (share == 0) {
            return 1;
        }
        return share;
    }
}
