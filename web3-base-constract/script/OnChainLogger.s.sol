// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import { OnChainLogger } from "../src/OnChainLogger.sol";

contract OnChainLoggerScript is Script {
    OnChainLogger public onChainLogger;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory rpcUrl = vm.envString("RPC_URL");
        vm.createSelectFork(rpcUrl); // 可选：部署前 fork
        vm.startBroadcast(deployerPrivateKey);

        onChainLogger = new OnChainLogger();

        vm.stopBroadcast();

        console.log("Deploy address:", address(onChainLogger));
    }
}
