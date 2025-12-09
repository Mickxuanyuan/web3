// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {YDToken} from "../src/token/YDToken.sol";
import {CourseFactory} from "../src/course/CourseFactory.sol";
import {CourseAccess} from "../src/course/CourseAccess.sol";

contract DeployAll is Script {
    function run() external {
        vm.startBroadcast();

        // 1. 部署 YD Token
        uint256 initialSupply = 1000000 * 10**18; // 初始供应量：100万代币
        YDToken yd = new YDToken(initialSupply);

        // 2. 部署 CourseFactory
        CourseFactory factory = new CourseFactory();



        // 3. 平台费地址设置为 deployer
        address platform = msg.sender;

        // 4. 部署 CourseAccess
        CourseAccess access = new CourseAccess(address(yd), address(factory), platform);

        vm.stopBroadcast();


        console.log("YD Token:", address(yd));
        console.log("CourseFactory:", address(factory));
        console.log("CourseAccess:", address(access));
    }
}
