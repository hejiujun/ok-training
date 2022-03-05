// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IScore {
    function setScore(
        address teacherName,
        address studentName,
        uint256 count
    ) external;
}

contract Score {
    address emma = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address alice = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address bella = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    mapping(address => uint256) public students;
    address teachers;

    modifier validTeacher(address teacherName) {
        require(teachers == teacherName, "Fail,the teacher can add points!");
        _;
    }

    constructor() {
        //初始学生数据
        students[emma] = 0;
        students[alice] = 0;
        //初始老师数据
        teachers = bella;
    }

    function setScore(
        address teacherName,
        address studentName,
        uint256 count
    ) external validTeacher(teacherName) {
        uint256 s = students[studentName];
        s += count;
        require(s < 100, "Score no more than 100!");
        students[studentName] += count;
    }

    function getScore(address studentName) public view returns (uint256) {
        return students[studentName];
    }

    function getEmmaAddress() public view returns (address) {
        return emma;
    }

    function getAliceAddress() public view returns (address) {
        return alice;
    }

    function getBellaAddress() public view returns (address) {
        return bella;
    }
}

contract Teacher {
    function giveScore(
        address _score,
        address teacherName,
        address studentName,
        uint256 count
    ) external {
        IScore(_score).setScore(teacherName, studentName, count);
    }
}
