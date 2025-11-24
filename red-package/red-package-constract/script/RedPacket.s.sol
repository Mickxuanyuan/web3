// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/redPackage.sol";

contract RedPacketScript is Script {
    function run() external returns (RedPacket deployed) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        deployed = new RedPacket();
        vm.stopBroadcast();
    }
}
