// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/redPackage.sol";

contract RedPacketTest is Test {
    RedPacket private red;

    function setUp() public {
        red = new RedPacket();
    }

    function testCreateAndClaim() public {
        vm.deal(address(this), 2 ether);

        uint256 packetId = red.createRedPacket{value: 1 ether}(2, 1 days, "gm");
        assertEq(packetId, 1);

        address alice = address(0xA11CE);
        vm.prank(alice);
        uint256 claimAmount = red.claim(packetId);

        assertEq(claimAmount, 0.5 ether);
        assertEq(alice.balance, 0.5 ether);
    }

    function testDuplicateClaimReturnsZero() public {
        vm.deal(address(this), 1 ether);

        uint256 packetId = red.createRedPacket{value: 1 ether}(1, 0, "one-shot");
        address alice = address(0xBEEF);

        vm.prank(alice);
        uint256 first = red.claim(packetId);
        assertEq(first, 1 ether);

        vm.prank(alice);
        uint256 second = red.claim(packetId);
        assertEq(second, 0);
    }

    function testRefundAfterExpiry() public {
        vm.deal(address(this), 1 ether);
        uint256 packetId = red.createRedPacket{value: 1 ether}(2, 1 days, "expire");

        vm.warp(block.timestamp + 2 days);
        uint256 refunded = red.refund(packetId, payable(address(this)));

        assertEq(refunded, 1 ether);
        assertEq(address(red).balance, 0);
    }
}
