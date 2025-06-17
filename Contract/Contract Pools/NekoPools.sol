// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract NekoPools is Ownable, ReentrancyGuard, Pausable {
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    uint256 public timeUnit;
    uint256 public rewardRatioNumerator;
    uint256 public rewardRatioDenominator;

    uint256 public nativeFee;

    uint256 private totalStaked;

    struct Staker {
        uint256 amountStaked;
        uint256 lastClaimedTime;
        uint256 rewardDebt;
    }

    mapping(address => Staker) public stakers;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardTokenDeposited(address indexed owner, uint256 amount);
    event RewardTokenWithdrawn(address indexed owner, uint256 amount);
    event RewardRatioUpdated(uint256 numerator, uint256 denominator);
    event NativeFeeUpdated(uint256 newFee);

    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _timeUnit,
        uint256 _rewardRatioNumerator,
        uint256 _rewardRatioDenominator,
        uint256 _nativeFee,
        address _owner
    ) Ownable(_owner) {
        require(_stakingToken != address(0), "Staking token zero address");
        require(_rewardToken != address(0), "Reward token zero address");
        require(_timeUnit > 0, "Time unit must > 0");
        require(_rewardRatioDenominator > 0, "Denominator must > 0");

        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);

        timeUnit = _timeUnit;
        rewardRatioNumerator = _rewardRatioNumerator;
        rewardRatioDenominator = _rewardRatioDenominator;

        nativeFee = _nativeFee;
    }

    function setRewardRatio(uint256 _numerator, uint256 _denominator) external onlyOwner {
        require(_denominator > 0, "Denominator must > 0");
        rewardRatioNumerator = _numerator;
        rewardRatioDenominator = _denominator;
        emit RewardRatioUpdated(_numerator, _denominator);
    }

    function setNativeFee(uint256 _nativeFee) external onlyOwner {
        nativeFee = _nativeFee;
        emit NativeFeeUpdated(_nativeFee);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function stake(uint256 amount) external payable nonReentrant whenNotPaused {
        require(msg.value >= nativeFee, "Must pay native fee");
        require(amount > 0, "Amount must > 0");

        payable(owner()).transfer(nativeFee);

        Staker storage staker = stakers[msg.sender];
        _claimReward(msg.sender);

        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Stake token transfer failed");

        staker.amountStaked += amount;
        staker.lastClaimedTime = block.timestamp;

        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant whenNotPaused {
        Staker storage staker = stakers[msg.sender];
        require(staker.amountStaked >= amount, "Insufficient stake");

        _claimReward(msg.sender);

        staker.amountStaked -= amount;
        totalStaked -= amount;

        require(stakingToken.transfer(msg.sender, amount), "Unstake token transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    function claimReward() external nonReentrant whenNotPaused {
        uint256 reward = _calculateReward(msg.sender);
        require(reward > 0, "No reward");

        stakers[msg.sender].lastClaimedTime = block.timestamp;
        stakers[msg.sender].rewardDebt = 0;

        require(rewardToken.transfer(msg.sender, reward), "Reward transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }

    function _claimReward(address user) internal {
        uint256 reward = _calculateReward(user);
        if (reward > 0) {
            stakers[user].lastClaimedTime = block.timestamp;
            stakers[user].rewardDebt = 0;

            require(rewardToken.transfer(user, reward), "Reward transfer failed");

            emit RewardClaimed(user, reward);
        }
    }

    function _calculateReward(address user) internal view returns (uint256) {
        Staker storage staker = stakers[user];
        if (staker.amountStaked == 0 || staker.lastClaimedTime == 0) return 0;

        uint256 timeDiff = block.timestamp - staker.lastClaimedTime;
        uint256 reward = (staker.amountStaked * rewardRatioNumerator * timeDiff) / (timeUnit * rewardRatioDenominator);

        return reward + staker.rewardDebt;
    }

    function depositRewardTokens(uint256 amount) external onlyOwner {
        require(rewardToken.transferFrom(msg.sender, address(this), amount), "Deposit failed");
        emit RewardTokenDeposited(msg.sender, amount);
    }

    function withdrawRewardTokens(uint256 amount) external onlyOwner {
        require(rewardToken.transfer(msg.sender, amount), "Withdraw failed");
        emit RewardTokenWithdrawn(msg.sender, amount);
    }

    function getPendingReward(address user) external view returns (uint256) {
        return _calculateReward(user);
    }

    function getUserStaked(address user) external view returns (uint256) {
        return stakers[user].amountStaked;
    }

    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }

    function getAPR() external view returns (uint256) {
        if (totalStaked == 0) {
            return (rewardRatioNumerator * 1e18) / rewardRatioDenominator;
        }
        uint256 baseAPR = (rewardRatioNumerator * 1e18) / rewardRatioDenominator;
        uint256 apr = baseAPR * 1e18 / (totalStaked + 1e18);
        return apr;
    }

    receive() external payable {}
}
