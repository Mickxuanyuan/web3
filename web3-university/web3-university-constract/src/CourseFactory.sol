// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

/// @title CourseFactory
/// @notice 记录课程的基础信息，并挂接到链下数据库和 IPFS 元数据。
/// @dev 元数据 URI 建议使用 ipfs://CID 形式，完整课程内容可放在数据库/对象存储。
contract CourseFactory {
    struct Course {
        uint256 id;
        address instructor;
        string metadataURI; // 课程元数据(例如 IPFS CID)
        uint256 createdAt;
        bool active;
    }

    // 存储所有课程；id 从 1 开始自增
    mapping(uint256 => Course) private courses;
    uint256 public courseCount;

    error InvalidCourse(uint256 courseId);
    error NotInstructor(address caller, uint256 courseId);

    event CourseCreated(uint256 indexed courseId, address indexed instructor, string metadataURI);
    event CourseMetadataUpdated(uint256 indexed courseId, string metadataURI);
    event CourseActiveStateChanged(uint256 indexed courseId, bool active);

    /// @notice 创建新课程，记录元数据 URI
    /// @param metadataURI 课程元数据地址 (如 ipfs://CID)
    /// @return courseId 新课程 ID
    function createCourse(string calldata metadataURI) external returns (uint256 courseId) {
        courseId = ++courseCount;
        courses[courseId] = Course({
            id: courseId,
            instructor: msg.sender,
            metadataURI: metadataURI,
            createdAt: block.timestamp,
            active: true
        });

        emit CourseCreated(courseId, msg.sender, metadataURI);
    }

    /// @notice 更新课程的元数据 URI，通常对应 IPFS 的新版本
    /// @param courseId 课程 ID
    /// @param metadataURI 新的元数据地址
    function updateMetadata(uint256 courseId, string calldata metadataURI) external {
        Course storage course = courses[courseId];
        if (course.instructor == address(0)) revert InvalidCourse(courseId);
        if (course.instructor != msg.sender) revert NotInstructor(msg.sender, courseId);

        course.metadataURI = metadataURI;
        emit CourseMetadataUpdated(courseId, metadataURI);
    }

    /// @notice 上/下架课程
    /// @param courseId 课程 ID
    /// @param active 是否可用
    function setActive(uint256 courseId, bool active) external {
        Course storage course = courses[courseId];
        if (course.instructor == address(0)) revert InvalidCourse(courseId);
        if (course.instructor != msg.sender) revert NotInstructor(msg.sender, courseId);

        course.active = active;
        emit CourseActiveStateChanged(courseId, active);
    }

    /// @notice 获取课程详情
    /// @param courseId 课程 ID
    /// @return Course 课程结构体
    function getCourse(uint256 courseId) external view returns (Course memory) {
        Course memory course = courses[courseId];
        if (course.instructor == address(0)) revert InvalidCourse(courseId);
        return course;
    }

    /// @notice 获取全部课程（可能随课程数量增长而变贵，前端可做分页/缓存）
    /// @return list 课程列表
    function getCourses() external view returns (Course[] memory list) {
        uint256 count = courseCount;
        list = new Course[](count);
        for (uint256 i = 0; i < count; i++) {
            list[i] = courses[i + 1]; // id 从 1 开始
        }
        return list;
    }
}
