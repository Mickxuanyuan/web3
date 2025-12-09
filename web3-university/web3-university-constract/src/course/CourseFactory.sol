// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CourseFactory {

    struct Course {
        uint256 price;
        address instructor;
        string metadataURI; // IPFS 地址
        bool active;
    }

    uint256 public nextCourseId;
    uint256[] public courseIds;

    mapping(uint256 => Course) public courses;

    event CourseCreated(uint256 indexed courseId, address indexed instructor, uint256 price);
    event CourseUpdated(uint256 indexed courseId, string newURI);
    event CourseActiveSet(uint256 indexed courseId, bool active);

    /// @notice 课程创建、维护、列表
    function createCourse(uint256 price, string calldata metadataURI) external {
        require(price > 0, "price error");

        uint256 courseId = nextCourseId++;
        courses[courseId] = Course({
            price: price,
            instructor: msg.sender,
            metadataURI: metadataURI,
            active: true
        });

        courseIds.push(courseId);

        emit CourseCreated(courseId, msg.sender, price);
    }

    /// @notice 获取单个课程
    function getCourse(uint256 courseId) external view returns (Course memory) {
        require(courses[courseId].instructor != address(0), "not exist");
        return courses[courseId];
    }

    /// @notice 获取课程列表
    function getCourses() external view returns (Course[] memory) {
        Course[] memory result = new Course[](courseIds.length);
        for (uint256 i = 0; i < courseIds.length; i++) {
            result[i] = courses[courseIds[i]];
        }
        return result;
    }

    /// @notice 更新 metadata（作者更新封面/简介等）
    function updateMetadata(uint256 courseId, string calldata newURI) external {
        Course storage c = courses[courseId];
        require(c.instructor == msg.sender, "not instructor");
        c.metadataURI = newURI;
        emit CourseUpdated(courseId, newURI);
    }

    /// @notice 上下架课程
    function setActive(uint256 courseId, bool active) external {
        Course storage c = courses[courseId];
        require(c.instructor == msg.sender, "not instructor");
        c.active = active;
        emit CourseActiveSet(courseId, active);
    }
}
