// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {YDToken} from "../token/YDToken.sol";
import {CourseFactory} from "./CourseFactory.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//课程购买 & 收益分发
contract CourseAccess {
    using SafeERC20 for IERC20;

    YDToken public yd;
    CourseFactory public factory;
    address public platform; // 平台手续费地址（5%）

    mapping(address => mapping(uint256 => bool)) public purchased;

    event CoursePurchased(address indexed buyer, uint256 indexed courseId, uint256 price);

    constructor(address _yd, address _factory, address _platform) {
        yd = YDToken(_yd);
        factory = CourseFactory(_factory);
        platform = _platform;
    }

    /// @notice 用户购买课程
    function buyCourse(uint256 courseId) external {
        CourseFactory.Course memory course = factory.getCourse(courseId);

        require(course.active, "inactive");

        require(!purchased[msg.sender][courseId], "already bought");

        uint256 price = course.price;
        uint256 authorAmount = (price * 95) / 100;
        uint256 platformFee = price - authorAmount; // 5%

        // 转账 YD
        IERC20(yd).safeTransferFrom(msg.sender, course.instructor, authorAmount);
        IERC20(yd).safeTransferFrom(msg.sender, platform, platformFee);

        // 记录购买状态
        purchased[msg.sender][courseId] = true;

        emit CoursePurchased(msg.sender, courseId, price);
    }

    /// @notice 查询已购状态
    function hasPurchased(address user, uint256 courseId) external view returns (bool) {
        return purchased[user][courseId];
    }
}
