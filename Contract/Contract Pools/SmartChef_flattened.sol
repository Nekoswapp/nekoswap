
// File: @openzeppelin/contracts/token/ERC20/IERC20.sol


// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// File: @openzeppelin/contracts/utils/Context.sol


// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol


// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File: @openzeppelin/contracts/security/ReentrancyGuard.sol


// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }
}

// File: @openzeppelin/contracts/security/Pausable.sol


// OpenZeppelin Contracts (last updated v4.7.0) (security/Pausable.sol)

pragma solidity ^0.8.0;


/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    constructor() {
        _paused = false;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        require(!paused(), "Pausable: paused");
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        require(paused(), "Pausable: not paused");
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

// File: Contract Pools/NekoPools.sol


pragma solidity ^0.8.20;





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

// File: Contract Pools/SmartChef.sol


pragma solidity ^0.8.20;



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
