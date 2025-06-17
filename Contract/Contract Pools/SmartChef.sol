// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NekoPools.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartChefFactory is Ownable {
    address[] public allPools;

    event PoolCreated(
        address indexed pool,
        address indexed stakingToken,
        address indexed rewardToken,
        uint256 timeUnit,
        uint256 rewardRatioNumerator,
        uint256 rewardRatioDenominator,
        uint256 nativeFee,
        address owner
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    function createPool(
        address stakingToken,
        address rewardToken,
        uint256 timeUnit,
        uint256 rewardRatioNumerator,
        uint256 rewardRatioDenominator,
        uint256 nativeFee
    ) external onlyOwner returns (address pool) {
        require(stakingToken != address(0), "Invalid staking token");
        require(rewardToken != address(0), "Invalid reward token");

        NekoPools newPool = new NekoPools(
            stakingToken,
            rewardToken,
            timeUnit,
            rewardRatioNumerator,
            rewardRatioDenominator,
            nativeFee,
            msg.sender // owner pool ini adalah caller dari createPool
        );

        pool = address(newPool);
        allPools.push(pool);

        emit PoolCreated(
            pool,
            stakingToken,
            rewardToken,
            timeUnit,
            rewardRatioNumerator,
            rewardRatioDenominator,
            nativeFee,
            msg.sender
        );
    }

    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }

    function totalPools() external view returns (uint256) {
        return allPools.length;
    }
}
